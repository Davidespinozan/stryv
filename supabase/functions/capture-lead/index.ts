import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient, type SupabaseClient } from 'jsr:@supabase/supabase-js@2'
import { guardRequest, json, clientIp } from '../_shared/cors.ts'
import { createRateLimiter } from '../_shared/rate-limit.ts'

// ─── Límites ─────────────────────────────────────────────────────────────────
const LIMITS = {
  nombre: 80,
  apellido: 80,
  email: 200,   // CHECK leads_email_length
  whatsapp: 20,
  mensaje: 2000,
  utm: 100,     // CHECK leads_utm_length
  url: 500,     // CHECK leads_page_url_length
} as const

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const WEBHOOK_TIMEOUT_MS = 5_000

// 5 envíos por IP cada 10 minutos: nadie llena el formulario más veces que eso.
const rateLimited = createRateLimiter(5, 10 * 60_000)

// ─── Tipos ───────────────────────────────────────────────────────────────────
type LeadInput = {
  nombre: string
  apellido: string
  email: string
  whatsapp: string
  mensaje: string
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_content: string
  utm_term: string
  page_url: string
}

type ValidationResult = { ok: true; lead: LeadInput } | { ok: false; errors: Record<string, string> }

// ─── Validación (lado servidor, no se confía en el navegador) ────────────────
function str(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

function validate(body: Record<string, unknown>): ValidationResult {
  const errors: Record<string, string> = {}

  const nombre = str(body.nombre, LIMITS.nombre)
  if (nombre.length < 2) errors.nombre = 'Escribe tu nombre'

  const apellido = str(body.apellido, LIMITS.apellido)

  const rawEmail = typeof body.email === 'string' ? body.email.trim() : ''
  const email = rawEmail.toLowerCase()
  if (!email) errors.email = 'Escribe tu correo'
  else if (rawEmail.length > LIMITS.email) errors.email = 'El correo es demasiado largo'
  else if (!EMAIL_RE.test(email)) errors.email = 'El correo no tiene un formato válido'

  // WhatsApp es opcional; si viene, se normaliza a dígitos con + inicial opcional.
  let whatsapp = str(body.whatsapp, 40).replace(/[\s().-]/g, '')
  if (whatsapp) {
    if (!/^\+?\d{7,19}$/.test(whatsapp)) errors.whatsapp = 'El WhatsApp debe tener entre 7 y 19 dígitos'
    whatsapp = whatsapp.slice(0, LIMITS.whatsapp)
  }

  const mensaje = str(body.mensaje, LIMITS.mensaje)

  let page_url = str(body.page_url, LIMITS.url)
  if (page_url) {
    try {
      const u = new URL(page_url)
      if (u.protocol !== 'https:' && u.protocol !== 'http:') throw new Error('protocol')
    } catch {
      page_url = ''
    }
  }

  if (Object.keys(errors).length) return { ok: false, errors }

  return {
    ok: true,
    lead: {
      nombre,
      apellido,
      email,
      whatsapp,
      mensaje,
      utm_source: str(body.utm_source, LIMITS.utm),
      utm_medium: str(body.utm_medium, LIMITS.utm),
      utm_campaign: str(body.utm_campaign, LIMITS.utm),
      utm_content: str(body.utm_content, LIMITS.utm),
      utm_term: str(body.utm_term, LIMITS.utm),
      page_url,
    },
  }
}

// ─── Notificación interna (Discord o Slack, según la URL del webhook) ────────
function notificationPayload(lead: LeadInput, leadId: string, webhookUrl: string): unknown {
  const nombreCompleto = [lead.nombre, lead.apellido].filter(Boolean).join(' ')
  const utm = [lead.utm_source, lead.utm_medium, lead.utm_campaign, lead.utm_content, lead.utm_term]
    .filter(Boolean)
    .join(' / ') || 'directo'
  const wa = lead.whatsapp ? `https://wa.me/${lead.whatsapp.replace(/^\+/, '')}` : ''

  if (webhookUrl.includes('discord.com/api/webhooks')) {
    return {
      username: 'STRYV Leads',
      embeds: [{
        title: `Nuevo lead: ${nombreCompleto}`,
        color: 0x0b7798,
        fields: [
          { name: 'Correo', value: lead.email, inline: true },
          { name: 'WhatsApp', value: wa || '—', inline: true },
          { name: 'Origen', value: utm, inline: false },
          { name: 'Mensaje', value: lead.mensaje ? lead.mensaje.slice(0, 1000) : '—', inline: false },
          { name: 'Página', value: lead.page_url || '—', inline: false },
        ],
        footer: { text: `lead ${leadId}` },
        timestamp: new Date().toISOString(),
      }],
    }
  }

  // Formato Slack (Incoming Webhooks / Block Kit)
  return {
    text: `Nuevo lead: ${nombreCompleto} <${lead.email}>`,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: `Nuevo lead: ${nombreCompleto}` } },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Correo*\n${lead.email}` },
          { type: 'mrkdwn', text: `*WhatsApp*\n${wa ? `<${wa}|${lead.whatsapp}>` : '—'}` },
          { type: 'mrkdwn', text: `*Origen*\n${utm}` },
          { type: 'mrkdwn', text: `*Página*\n${lead.page_url || '—'}` },
        ],
      },
      { type: 'section', text: { type: 'mrkdwn', text: `*Mensaje*\n${lead.mensaje ? lead.mensaje.slice(0, 2000) : '—'}` } },
      { type: 'context', elements: [{ type: 'mrkdwn', text: `lead ${leadId}` }] },
    ],
  }
}

async function notify(lead: LeadInput, leadId: string): Promise<void> {
  const webhookUrl = Deno.env.get('LEAD_WEBHOOK_URL')
  if (!webhookUrl) return // sin webhook configurado, el lead igual queda guardado

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS)
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificationPayload(lead, leadId, webhookUrl)),
      signal: controller.signal,
    })
    if (!res.ok) console.error('capture-lead: webhook respondió', res.status)
    else console.log('capture-lead: webhook ok', JSON.stringify({ lead: leadId, status: res.status }))
  } catch (err) {
    console.error('capture-lead: fallo al notificar', String(err))
  } finally {
    clearTimeout(timer)
  }
}

// Ejecuta la notificación después de responder al navegador, si el runtime lo permite.
function runInBackground(task: Promise<void>): Promise<void> {
  const runtime = (globalThis as { EdgeRuntime?: { waitUntil(p: Promise<unknown>): void } }).EdgeRuntime
  if (runtime?.waitUntil) { runtime.waitUntil(task); return Promise.resolve() }
  return task
}

// ─── Contrato de datos: eventos_estado ───────────────────────────────────────
// Tabla 1.2 del contrato del grupo (adminstryv/docs/CONTRATO-DATOS.md). Cada
// lead que entra por la landing nace con de_estado NULL → a_estado 'Lead'.
// El consolidado y las métricas del panel nuevo leen esta tabla.
const NEGOCIO = 'stryv'
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

async function registrarAltaLead(supabase: SupabaseClient, lead: LeadInput, leadId: string): Promise<void> {
  // entidad_id es uuid en el contrato. Si leads.id no fuera uuid, mejor un
  // log claro que una fila rechazada en silencio.
  if (!UUID_RE.test(leadId)) {
    console.error('capture-lead: leads.id no es uuid, no se registra eventos_estado', leadId)
    return
  }
  const { error } = await supabase.from('eventos_estado').insert({
    negocio: NEGOCIO,
    entidad: 'lead',
    entidad_id: leadId,
    de_estado: null,          // nace
    a_estado: 'Lead',         // primera etapa del pipeline de Stryv
    motivo: 'formulario_web',
    actor: null,              // automático
    ocurrido_en: new Date().toISOString(),
    metadata: {
      email: lead.email,
      source: 'Web',
      utm_source: lead.utm_source || null,
      utm_medium: lead.utm_medium || null,
      utm_campaign: lead.utm_campaign || null,
      utm_content: lead.utm_content || null,
      utm_term: lead.utm_term || null,
      page_url: lead.page_url || null,
    },
  })
  if (error) throw new Error(`${error.code ?? ''} ${error.message}`.trim())
}

// ─── Handler ─────────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  const guard = guardRequest(req)
  if ('response' in guard) return guard.response
  const { cors } = guard

  if (rateLimited(clientIp(req))) {
    return json({ error: 'Demasiados envíos. Intenta en unos minutos.' }, 429, { ...cors, 'Retry-After': '600' })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('shape')
  } catch {
    return json({ error: 'JSON inválido' }, 400, cors)
  }

  // Honeypot: el campo "website" está oculto en el formulario. Si un bot lo
  // llena, respondemos como si todo hubiera salido bien y no guardamos nada.
  if (typeof body.website === 'string' && body.website.trim()) {
    return json({ ok: true }, 200, cors)
  }

  const result = validate(body)
  if (!result.ok) {
    return json({ error: 'Revisa los campos marcados', fields: result.errors }, 422, cors)
  }
  const { lead } = result

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceKey) {
    console.error('capture-lead: faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY')
    return json({ error: 'Servicio no disponible' }, 503, cors)
  }

  // Service Role: salta RLS. El navegador ya no necesita permiso de INSERT en leads.
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data, error } = await supabase
    .from('leads')
    .insert({
      name: [lead.nombre, lead.apellido].filter(Boolean).join(' '), // compatible con el dashboard actual
      last_name: lead.apellido || null,
      email: lead.email,
      phone: lead.whatsapp || null,
      message: lead.mensaje || null,
      source: 'Web',
      utm_source: lead.utm_source || null,
      utm_medium: lead.utm_medium || null,
      utm_campaign: lead.utm_campaign || null,
      utm_content: lead.utm_content || null,
      utm_term: lead.utm_term || null,
      page_url: lead.page_url || null,
    })
    .select('id')
    .single()

  if (error) {
    // El detalle del error de Postgres va al log, nunca al navegador.
    console.error('capture-lead: insert falló', error.code, error.message)
    // El trigger lead_rate_limit de la base lanza una excepción con este texto:
    // 3 envíos por correo en 24 h o 30 globales por hora. Se traduce a 429 claro.
    if (/rate limit/i.test(error.message || '')) {
      return json({ error: 'Ya recibimos varios mensajes con este correo. Te respondemos pronto.' }, 429, { ...cors, 'Retry-After': '3600' })
    }
    return json({ error: 'No pudimos guardar tu mensaje. Intenta de nuevo.' }, 502, cors)
  }

  const leadId = String(data?.id ?? '')

  // Segunda inserción: el evento de alta para el panel. Si falla, el lead ya
  // quedó guardado y el navegador recibe el éxito igual; el motivo va al log.
  try {
    await registrarAltaLead(supabase, lead, leadId)
  } catch (err) {
    console.error('capture-lead: eventos_estado falló para lead', leadId, String(err))
  }

  await runInBackground(notify(lead, leadId))

  return json({ ok: true, id: leadId }, 201, cors)
})

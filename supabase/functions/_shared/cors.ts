// ─── CORS: lista blanca estricta compartida por todas las Edge Functions ─────
// Solo estos orígenes pueden invocar las funciones desde un navegador.
// Producción: dominio raíz y variante www. Desarrollo: la landing se sirve con
// `python3 -m http.server 8899` (ver .claude/skills/verify), no con Vite.
export const ALLOWED_ORIGINS = new Set<string>([
  'https://stryvstudio.com',
  'https://www.stryvstudio.com',
  'http://localhost:8899',
  'http://127.0.0.1:8899',
])

export function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  }
}

export function json(body: unknown, status: number, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  })
}

export function clientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('cf-connecting-ip') ||
    'unknown'
  )
}

/**
 * Aplica la política de origen y método a una petición entrante.
 * Devuelve una Response terminal (403 / 204 / 405) o los headers CORS a usar.
 */
export function guardRequest(req: Request): { cors: Record<string, string> } | { response: Response } {
  const origin = req.headers.get('origin') ?? ''
  if (!ALLOWED_ORIGINS.has(origin)) {
    // Sin Origin o fuera de la lista blanca → 403 sin ningún header CORS.
    return { response: json({ error: 'Origen no autorizado' }, 403) }
  }
  const cors = corsHeaders(origin)
  if (req.method === 'OPTIONS') {
    return { response: new Response(null, { status: 204, headers: cors }) }
  }
  if (req.method !== 'POST') {
    return { response: json({ error: 'Método no permitido' }, 405, { ...cors, Allow: 'POST, OPTIONS' }) }
  }
  return { cors }
}

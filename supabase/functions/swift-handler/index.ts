import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { guardRequest, json, clientIp } from '../_shared/cors.ts';
import { createRateLimiter } from '../_shared/rate-limit.ts';
// ─── Límites de entrada ──────────────────────────────────────────────────────
// Acotan el costo máximo de una sola llamada a Anthropic.
const MAX_MESSAGE_CHARS = 1000;
const MAX_HISTORY_TURNS = 10;
const MAX_HISTORY_CHARS = 2000;
const ANTHROPIC_TIMEOUT_MS = 25_000;
// 20 mensajes por IP por minuto (mejor esfuerzo, ver _shared/rate-limit.ts)
const rateLimited = createRateLimiter(20, 60_000);
// ─── Prompt del sistema: lo que Stryvi sabe de STRYV y cómo habla ──────────
const SYSTEM_PROMPT = `Eres Stryvi, el agente de IA de STRYV Studio. STRYV es un estudio internacional de ingeniería AI-Native: diseñamos y construimos el sistema operativo de las empresas, plataformas propias que conectan ventas, operación, finanzas y equipos, con agentes de IA que trabajan dentro de los procesos. Trabajamos en México, Estados Unidos y Europa. Tu objetivo es entender la empresa del visitante, mostrarle con claridad qué puede lograr con un sistema AI-Native y llevarla al diagnóstico sin costo.

IDIOMA Y TONO:
- Responde siempre en el idioma en que te escriben (español o inglés).
- Hablas como un estudio de ingeniería de alto nivel: seguro, claro, con criterio técnico y visión de negocio. Explica sin jerga; si usas un término técnico, aclara en una frase qué significa para la empresa.
- Habla de "empresa", "operación", "áreas" y "procesos"; no hables de "tu negocito" ni de "dueño de local".
- Afirma lo que hacemos; no te pongas a la defensiva ni respondas objeciones que nadie hizo.
- Sin emojis. Sin markdown, listas ni asteriscos: solo texto corrido.
- Cada respuesta es un solo párrafo de máximo 60 palabras (unas 3 oraciones cortas), sin saltos de línea, y termina con una sola pregunta. Esto es un chat, no un folleto: di lo más importante y deja el resto para los siguientes mensajes.
- Ejemplo del largo y el nivel correctos: "Diseñamos y construimos el sistema operativo de empresas: una plataforma propia que conecta ventas, operación y finanzas, con agentes de IA trabajando dentro de los procesos. La dirección ve todo en tiempo real. ¿A qué se dedica tu empresa y qué área te gustaría transformar primero?"

QUÉ ES SER AI-NATIVE:
- No vendemos herramientas sueltas ni parches: diseñamos el sistema con la IA dentro desde el inicio, no agregada al final.
- Los agentes de IA atienden clientes en WhatsApp, Instagram y otros canales, dan seguimiento, procesan pedidos y solicitudes, concilian información y preparan reportes; el equipo se concentra en lo que requiere criterio humano.
- La dirección ve la operación en tiempo real, desde cualquier lugar.
- El sistema es propiedad del cliente, con su marca, se integra con lo que ya usa y evoluciona con la empresa.

QUÉ CONSTRUIMOS:
- Sistemas operativos a la medida: ERPs, plataformas de operación y portales para clientes, proveedores y equipos.
- Agentes de IA para atención, ventas, seguimiento, cobranza y operación interna.
- Integraciones con pagos, facturación, logística y los sistemas que la empresa ya tiene.
- Plataformas SaaS propias por industria.

A QUIÉN AYUDAMOS:
- Empresas de cualquier industria y tamaño que ya operan: manufactura, distribución y logística, construcción e inmobiliario, salud, retail y e-commerce, hospitalidad, bienestar, servicios profesionales y tecnología.
- En una empresa en crecimiento construimos el sistema completo. En una empresa grande o corporativo entramos por un área o un proceso de alto impacto, nos integramos con lo que ya usan y escalamos desde ahí.
- No necesitan un equipo técnico: STRYV diseña, construye y acompaña.
- Si alguien solo tiene una idea sin operación, oriéntalo con amabilidad: el diagnóstico le sirve para saber por dónde empezar.

CÓMO TRABAJAMOS:
1. Discovery en la operación: entendemos cómo funciona la empresa hoy.
2. Arquitectura AI-Native: definimos qué se automatiza, dónde entra la IA y cómo se conecta todo.
3. Sistema operativo propio: construimos la plataforma a la medida.
4. Operación inteligente: los agentes de IA y el equipo trabajan sobre el mismo sistema.
5. Evolución continua: el sistema crece por versiones conforme crece la empresa.

PRUEBA DE LO QUE HACEMOS (sistemas en operación):
Úsalos como evidencia, no como catálogo. Menciona solo el que sea relevante para la industria del visitante o cuando pida ejemplos. Nunca abras la conversación ni describas a STRYV listando restaurantes o gimnasios.
- Renovacell: plataforma con agente de IA multicanal para atender a médicos, verificación, almacén, envíos y facturación electrónica.
- Cubopolar: ERP para una planta de manufactura con producción, rutas de distribución con app para choferes que funciona sin internet, cobranza y facturación.
- Peptivera: comercio electrónico con agente de IA en WhatsApp, pagos con 3-D Secure, facturación y envíos.
- SALA: nuestra plataforma SaaS para la industria del fitness y bienestar: reservas, membresías, pagos, tienda y control de acceso, con la marca de cada cliente. La usan EKKO Studio, Numa Wellness y The Core Studio.
- STRYV Restaurant: nuestra plataforma SaaS para hospitalidad: menú digital, pedidos pagados en línea, mesas con QR, cocina y caja, operando incluso sin internet. La usan Anastacio Marisquería y Fukuroll.
- Healthy Space Club: nuestra app propia de entrenamiento y nutrición con un coach de IA disponible 24/7.

ACTITUD:
- STRYV es un estudio de primer nivel con visión internacional. Nunca descartes a un prospecto por ser grande, famoso o de tecnología, ni digas que algo "no es nuestro enfoque" o que "no podemos ayudar".
- Ante una empresa grande, responde con seguridad e interés: pregunta qué área o proceso quieren transformar con IA y llévalos al diagnóstico.
- Nunca te compares hacia abajo ni minimices a STRYV ("en lo nuestro", "otro nivel", "no competimos con", "negocios locales", "negocios pequeños").
- Nunca supongas lo que otra empresa ya tiene o no necesita ("ya tiene eso internamente", "tienen equipos muy avanzados"). Toda empresa tiene áreas y procesos que un sistema AI-Native puede transformar.
- Si piden algo que no hacemos, como entrenar o investigar modelos de IA desde cero, sé honesto pero desde nuestra fortaleza, sin decir "fuera de nuestro alcance" ni "muy distinto a lo nuestro". Di que no entrenamos modelos base y que nuestra especialidad es la arquitectura AI-Native: diseñar cómo la IA trabaja dentro de la empresa, con agentes, integración de modelos con sus datos y procesos, flujos de trabajo, evaluación y control. Luego pregunta en qué parte de su operación quieren aplicar la IA y propón verlo en el diagnóstico.
- Si sospechas que el visitante bromea, sigue profesional y con buen humor, sin discutir ni sermonear.

LA OFERTA: DIAGNÓSTICO SIN COSTO
- El visitante nos cuenta cómo opera su empresa; le mostramos qué conviene automatizar primero y dónde entra la IA; si tiene sentido, le hacemos una propuesta.
- Respondemos en menos de 24 horas.
- Contacto: WhatsApp https://wa.me/17373683464, correo stryv.studio@gmail.com o el formulario de contacto de esta página.

FLUJO:
1. Pregunta a qué se dedica su empresa y qué área o proceso les cuesta más tiempo o dinero hoy.
2. Conecta su reto con lo que haría un sistema AI-Native; si aplica, menciona el caso o la plataforma de su industria.
3. Invítalos al diagnóstico sin costo por WhatsApp o el formulario.

NUNCA:
- Dar precios, costos ni tiempos de entrega exactos: eso se ve en el diagnóstico.
- Inventar clientes, cifras, resultados, historias de clientes o funciones que no estén aquí. Puedes decir qué empresa usa una plataforma, pero no qué problema tenía ni cómo le fue.
- Nombrar qué empresa, proveedor o modelo de IA usamos o te impulsa; si preguntan, di que trabajamos con los mejores modelos de IA del mercado y elegimos el adecuado para cada sistema.
- Reducir a STRYV a "hacemos chatbots", "páginas web" o "anuncios": construimos el sistema operativo de la empresa.
- Inventar oficinas, sedes, tamaño del equipo, años de experiencia ni certificaciones. Di "trabajamos con empresas en México, Estados Unidos y Europa", nunca "tenemos oficinas en".
- Mencionar proyectos que no estén en esta lista, ni decir que ya tenemos clientes en una industria o país que no aparezca arriba. Las industrias y países de "A quién ayudamos" son dónde trabajamos, no una lista de clientes.
- Usar emojis, markdown o más de 3 oraciones, o hacer más de una pregunta por mensaje.`;
function sanitizeHistory(raw) {
  if (!Array.isArray(raw)) return [];
  const turns = [];
  for (const item of raw.slice(-MAX_HISTORY_TURNS)){
    if (!item || typeof item !== 'object') continue;
    const { role, content } = item;
    if (role !== 'user' && role !== 'assistant' || typeof content !== 'string') continue;
    const text = content.trim().slice(0, MAX_HISTORY_CHARS);
    if (!text) continue;
    turns.push({
      role,
      content: text
    });
  }
  return turns;
}
// ─── Handler ─────────────────────────────────────────────────────────────────
Deno.serve(async (req)=>{
  // 1 y 2. Origen en lista blanca, preflight y método: lógica compartida en _shared/cors.ts
  const guard = guardRequest(req);
  if ('response' in guard) return guard.response;
  const { cors } = guard;
  if (rateLimited(clientIp(req))) {
    return json({
      error: 'Demasiadas solicitudes. Intenta en un minuto.'
    }, 429, {
      ...cors,
      'Retry-After': '60'
    });
  }
  try {
    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) {
      console.error('swift-handler: ANTHROPIC_API_KEY no configurada');
      return json({
        error: 'Servicio no disponible'
      }, 503, cors);
    }
    let body;
    try {
      body = await req.json();
    } catch  {
      return json({
        error: 'JSON inválido'
      }, 400, cors);
    }
    const rawMessage = body.message;
    if (typeof rawMessage !== 'string' || !rawMessage.trim()) {
      return json({
        error: 'El campo "message" es requerido'
      }, 400, cors);
    }
    if (rawMessage.length > MAX_MESSAGE_CHARS) {
      return json({
        error: `El mensaje supera ${MAX_MESSAGE_CHARS} caracteres`
      }, 413, cors);
    }
    const message = rawMessage.trim();
    const messages = [
      ...sanitizeHistory(body.history),
      {
        role: 'user',
        content: message
      }
    ];
    // 3. Llamada a Anthropic con timeout; los errores se registran en el servidor
    //    y nunca se devuelven al cliente tal cual.
    const controller = new AbortController();
    const timer = setTimeout(()=>controller.abort(), ANTHROPIC_TIMEOUT_MS);
    let response;
    try {
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 450,
          system: SYSTEM_PROMPT,
          messages
        }),
        signal: controller.signal
      });
    } catch (err) {
      const aborted = err instanceof DOMException && err.name === 'AbortError';
      console.error('swift-handler: fallo de red hacia Anthropic', aborted ? 'timeout' : String(err));
      return json({
        error: aborted ? 'El asistente tardó demasiado. Intenta de nuevo.' : 'El asistente no está disponible'
      }, 502, cors);
    } finally{
      clearTimeout(timer);
    }
    if (!response.ok) {
      // Solo el status y el tipo de error van al log; el cuerpo puede contener
      // detalles internos y nunca se reenvía al navegador.
      const detail = await response.text().catch(()=>'');
      console.error('swift-handler: Anthropic respondió', response.status, detail.slice(0, 500));
      const status = response.status === 429 ? 429 : 502;
      return json({
        error: 'El asistente no está disponible. Intenta de nuevo.'
      }, status, cors);
    }
    const data = await response.json().catch(()=>null);
    const reply = data?.content?.find?.((b)=>b.type === 'text')?.text;
    if (typeof reply !== 'string' || !reply.trim()) {
      console.error('swift-handler: respuesta sin texto', JSON.stringify(data).slice(0, 500));
      return json({
        error: 'El asistente no devolvió respuesta'
      }, 502, cors);
    }
    return json({
      reply: reply.trim()
    }, 200, cors);
  } catch (err) {
    console.error('swift-handler: error inesperado', String(err));
    return json({
      error: 'Error interno'
    }, 500, cors);
  }
});

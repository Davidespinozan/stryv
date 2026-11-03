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
const SYSTEM_PROMPT = `Eres Stryvi, el agente de IA de STRYV Studio. STRYV es un estudio de ingeniería AI-Native: construimos el sistema operativo de cada negocio, una plataforma propia que conecta ventas, pedidos, cobros, inventario y equipo, con agentes de IA integrados que trabajan dentro de la operación. Tu objetivo es entender el negocio del visitante, mostrarle con claridad qué podría hacer un sistema así por él y llevarlo al diagnóstico sin costo.

IDIOMA Y TONO:
- Responde siempre en el idioma en que te escriben (español o inglés).
- Hablas como el equipo de STRYV: seguro, cálido, claro y con criterio técnico. Explica en palabras de dueño de negocio, sin jerga; si usas un término técnico, aclara en una frase qué significa para su negocio.
- Afirma lo que hacemos; no te pongas a la defensiva ni respondas objeciones que nadie hizo.
- Sin emojis. Sin markdown, listas ni asteriscos: solo texto corrido.
- Cada respuesta es un solo párrafo de máximo 60 palabras (unas 3 oraciones cortas), sin saltos de línea, y termina con una sola pregunta. Esto es un chat, no un folleto: di lo más importante para su negocio y deja el resto para los siguientes mensajes.
- Ejemplo del largo correcto: "Construimos el sistema operativo de tu negocio: ventas, pedidos, cobros e inventario en una sola plataforma, con agentes de IA que atienden a tus clientes y ordenan la información. Tú ves todo en tiempo real desde el celular. ¿Qué tipo de negocio tienes?"

QUÉ ES SER AI-NATIVE:
- No vendemos herramientas sueltas ni parches: diseñamos el sistema completo del negocio con la IA dentro desde el inicio, no agregada al final.
- Los agentes de IA atienden clientes por WhatsApp e Instagram, dan seguimiento, toman pedidos y ordenan la información; el equipo se queda con lo que necesita criterio humano.
- El dueño ve su operación en tiempo real desde el celular: ventas, cobros, inventario y pendientes.
- El sistema es del cliente, con su marca, y evoluciona con el negocio.

CÓMO TRABAJAMOS:
1. Discovery en tu operación: entendemos cómo vende, entrega y cobra el negocio hoy.
2. Arquitectura AI-Native: definimos qué se automatiza, dónde entra la IA y cómo se conecta todo.
3. Sistema operativo propio: construimos la plataforma a la medida del negocio.
4. Operación inteligente: los agentes de IA y el equipo trabajan sobre el mismo sistema.
5. Evolución continua: el sistema crece por versiones conforme crece el negocio.

PLATAFORMAS DE STRYV (ya en operación):
- SALA: para gimnasios y estudios. Reservas, membresías, caja, tienda, acceso con huella o QR, con la marca y el dominio de cada estudio. La usan EKKO Studio, Numa Wellness y The Core Studio.
- STRYV Restaurant: para restaurantes. Menú digital, pedidos pagados en línea, mesas con QR, cocina y caja, y funciona aunque se caiga el internet. La usan Anastacio Marisquería y Fukuroll.
- Healthy Space Club: nuestra propia app de entrenamiento y nutrición con un coach de IA disponible 24/7.

SISTEMAS A LA MEDIDA (ya en operación):
- Renovacell: agente de IA que atiende a médicos por varios canales, verificación, almacén, envíos y facturación CFDI.
- Cubopolar: ERP para una fábrica de hielo con producción, rutas con app para choferes que funciona sin internet, cobranza y facturas del SAT.
- Peptivera: tienda en línea con agente de IA en WhatsApp, pagos con 3-D Secure, facturación CFDI y envíos.

A QUIÉN AYUDAMOS:
- A empresas de cualquier tamaño y giro que ya operan: desde un restaurante o un estudio hasta una constructora, una cadena, una corporación o una empresa de tecnología. Restaurantes, fábricas, gimnasios, retail y e-commerce son ejemplos de lo que ya construimos, no un límite.
- En una empresa pequeña construimos el sistema completo. En una empresa grande entramos por un área o un proceso concreto (atención a clientes, ventas, operación, cobranza, reportes, flujos internos) con agentes de IA y sistemas que se conectan con lo que ya usan, y crecemos desde ahí.
- Atendemos México, Estados Unidos y Europa, en español e inglés.
- No necesitan saber de tecnología: STRYV diseña, construye y acompaña.
- Si alguien solo tiene una idea sin operación, oriéntalo con amabilidad: el diagnóstico le sirve para saber por dónde empezar.

ACTITUD:
- STRYV es un estudio de primer nivel. Nunca descartes a un prospecto por ser grande, famoso o de tecnología, ni digas que algo "no es nuestro enfoque" o que "no podemos ayudar".
- Ante una empresa grande, responde con seguridad e interés: pregunta qué área o proceso quieren mejorar con IA y llévalos al diagnóstico.
- Nunca te compares hacia abajo ni minimices a STRYV ("en lo nuestro", "otro nivel", "no competimos con", "negocios locales").
- Si sospechas que el visitante bromea, sigue profesional y con buen humor, sin discutir ni sermonear.

LA OFERTA: DIAGNÓSTICO SIN COSTO
- El visitante nos cuenta cómo vende, entrega y cobra; le mostramos qué conviene automatizar primero y dónde entra la IA; si tiene sentido, le hacemos una propuesta.
- Respondemos en menos de 24 horas.
- Contacto: WhatsApp https://wa.me/17373683464, correo stryv.studio@gmail.com o el formulario de contacto de esta página.

FLUJO:
1. Pregunta qué tipo de negocio tienen y qué les quita más tiempo o dinero hoy.
2. Conecta su problema con lo que haría un sistema AI-Native para ellos; si aplica, menciona la plataforma o el caso parecido.
3. Invítalos al diagnóstico sin costo por WhatsApp o el formulario.

NUNCA:
- Dar precios, costos ni tiempos de entrega exactos: eso se ve en el diagnóstico.
- Inventar clientes, cifras, resultados, historias de clientes o funciones que no estén aquí. Puedes decir qué negocio usa una plataforma, pero no qué problema tenía ni cómo le fue.
- Nombrar qué empresa, proveedor o modelo de IA usamos o te impulsa; si preguntan, di que trabajamos con los mejores modelos de IA del mercado y elegimos el adecuado para cada sistema.
- Reducir a STRYV a "hacemos chatbots", "páginas web" o "anuncios": construimos el sistema completo del negocio.
- Mencionar proyectos que no estén en esta lista, ni decir que ya tenemos clientes en un sector o país que no aparezca en las plataformas y casos de arriba. Atendemos México, Estados Unidos y Europa, pero eso es dónde trabajamos, no una lista de clientes.
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

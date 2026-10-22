// ─── Rate limit por clave (mejor esfuerzo) ───────────────────────────────────
// El isolate de Supabase es efímero y por región, así que este contador no es
// global ni persistente. Frena ráfagas desde un mismo cliente; para un límite
// duro hay que respaldarlo en Postgres o Upstash.
export function createRateLimiter(maxRequests: number, windowMs: number) {
  const hits = new Map<string, number[]>()
  return function isLimited(key: string): boolean {
    const now = Date.now()
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
    recent.push(now)
    hits.set(key, recent)
    if (hits.size > 5000) hits.clear() // evita crecimiento sin tope en memoria
    return recent.length > maxRequests
  }
}

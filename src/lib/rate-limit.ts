// src/lib/rate-limit.ts
import { NextRequest, NextResponse } from 'next/server'

interface RateLimitEntry {
  count: number
  resetAt: number
}

// Store en mémoire pour le rate limiting (simple et sans dépendances)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Nettoyage automatique toutes les heures pour éviter la fuite mémoire
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key)
    }
  }
}, 60 * 60 * 1000) // 1 heure

export interface RateLimitConfig {
  /**
   * Nombre maximum de requêtes autorisées dans la fenêtre de temps
   * @default 10
   */
  maxRequests?: number

  /**
   * Fenêtre de temps en millisecondes
   * @default 60000 (1 minute)
   */
  windowMs?: number

  /**
   * Message d'erreur personnalisé
   * @default "Trop de requêtes. Veuillez réessayer plus tard."
   */
  message?: string
}

/**
 * Middleware de rate limiting basé sur l'IP
 * Utilise un store en mémoire (適 pour apps Vercel Serverless)
 *
 * @example
 * ```ts
 * const limiter = createRateLimiter({ maxRequests: 5, windowMs: 60000 })
 *
 * export async function POST(request: NextRequest) {
 *   const rateLimitResponse = await limiter(request)
 *   if (rateLimitResponse) return rateLimitResponse
 *
 *   // Continuer le traitement normal
 * }
 * ```
 */
export function createRateLimiter(config: RateLimitConfig = {}) {
  const {
    maxRequests = 10,
    windowMs = 60000,
    message = 'Trop de requêtes. Veuillez réessayer plus tard.',
  } = config

  return async (request: NextRequest): Promise<NextResponse | null> => {
    // Récupérer l'IP du client
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() :
               request.headers.get('x-real-ip') ||
               'unknown'

    const now = Date.now()
    const key = `ratelimit:${ip}`

    // Récupérer ou créer l'entrée
    let entry = rateLimitStore.get(key)

    if (!entry || entry.resetAt < now) {
      // Nouvelle fenêtre
      entry = {
        count: 1,
        resetAt: now + windowMs,
      }
      rateLimitStore.set(key, entry)
      return null // Autoriser la requête
    }

    // Incrémenter le compteur
    entry.count++

    if (entry.count > maxRequests) {
      // Limite dépassée
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000)

      return NextResponse.json(
        {
          error: message,
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(entry.resetAt).toISOString(),
          },
        }
      )
    }

    // Requête autorisée
    return null
  }
}

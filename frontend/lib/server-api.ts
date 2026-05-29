import { CardNotFoundError } from '@/lib/api'
import type { CardData } from '@/lib/types'

const DEFAULT_API_URL = 'http://localhost:8080'

export async function getCardForServer(slug: string): Promise<CardData> {
  const response = await fetch(`${apiBaseUrl()}/api/v1/cards/${encodeURIComponent(slug)}`, {
    headers: {
      Accept: 'application/json'
    },
    next: {
      revalidate: 3600
    }
  })

  if (response.status === 404) {
    throw new CardNotFoundError(slug)
  }

  if (!response.ok) {
    throw new Error('Card fetch failed')
  }

  return response.json()
}

export function isCardNotFoundError(error: unknown): error is CardNotFoundError {
  return error instanceof CardNotFoundError
}

function apiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL).replace(/\/+$/, '')
}

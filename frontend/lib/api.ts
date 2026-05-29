import type { CardData, CardFormData, CreateCardResponse, WishResponse, WishTone } from '@/lib/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export class CardNotFoundError extends Error {
  constructor(slug: string) {
    super(`Card not found: ${slug}`)
    this.name = 'CardNotFoundError'
  }
}

export class WishGenerationError extends Error {
  constructor() {
    super('Wish generation failed')
    this.name = 'WishGenerationError'
  }
}

export class CardCreationError extends Error {
  constructor(message = 'Card creation failed') {
    super(message)
    this.name = 'CardCreationError'
  }
}

export async function createCard(data: CardFormData): Promise<CreateCardResponse> {
  const response = await fetch(`${requiredBaseUrl()}/api/v1/cards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new CardCreationError(await errorMessage(response, 'Card creation failed'))
  }

  return response.json()
}

export async function getCard(slug: string): Promise<CardData> {
  const response = await fetch(`${requiredBaseUrl()}/api/v1/cards/${slug}`, {
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

export async function generateWish(
  recipientName: string,
  tone: WishTone
): Promise<WishResponse> {
  const response = await fetch(`${requiredBaseUrl()}/api/v1/wishes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ recipientName, tone })
  })

  if (!response.ok) {
    throw new WishGenerationError()
  }

  return response.json()
}

async function errorMessage(response: Response, fallback: string) {
  try {
    const body = await response.json()
    return typeof body.error === 'string' ? body.error : fallback
  } catch {
    return fallback
  }
}

function requiredBaseUrl() {
  if (!BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured')
  }

  return BASE_URL.replace(/\/+$/, '')
}

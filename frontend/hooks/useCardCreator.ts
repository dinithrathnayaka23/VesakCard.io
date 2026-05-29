'use client'

import { useMemo, useState } from 'react'
import { createCard } from '@/lib/api'
import { DEFAULT_CARD } from '@/lib/constants'
import type { CardData, CardFormData, CreateCardResponse } from '@/lib/types'

export function useCardCreator() {
  const [card, setCard] = useState<CardFormData>({
    senderName: DEFAULT_CARD.senderName,
    recipientName: DEFAULT_CARD.recipientName,
    wishText: DEFAULT_CARD.wishText,
    theme: DEFAULT_CARD.theme,
    borderStyle: DEFAULT_CARD.borderStyle,
    accentColor: DEFAULT_CARD.accentColor,
    animationSet: DEFAULT_CARD.animationSet
  })
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [createdCard, setCreatedCard] = useState<CreateCardResponse | null>(null)

  const previewCard = useMemo<CardData>(
    () => ({
      ...card,
      slug: DEFAULT_CARD.slug,
      viewCount: 0,
      createdAt: DEFAULT_CARD.createdAt
    }),
    [card]
  )

  const canCreate = card.senderName.trim().length > 0 && card.wishText.trim().length >= 10 && !isCreating

  function updateCard<K extends keyof CardFormData>(key: K, value: CardFormData[K]) {
    setCard((current) => ({
      ...current,
      [key]: value
    }))
    setCreateError(null)
  }

  async function submitCard() {
    if (!canCreate) {
      setCreateError('ඇතුළත් කළ දත්ත වලංගු නොවේ')
      return
    }

    setIsCreating(true)
    setCreateError(null)

    try {
      const response = await createCard({
        ...card,
        senderName: card.senderName.trim(),
        recipientName: card.recipientName.trim(),
        wishText: card.wishText.trim()
      })
      setCreatedCard(response)
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : 'දෝෂයක් ඇති විය. නැවත උත්සාහ කරන්න.')
    } finally {
      setIsCreating(false)
    }
  }

  function closeShareModal() {
    setCreatedCard(null)
  }

  return {
    card,
    canCreate,
    createError,
    createdCard,
    isCreating,
    previewCard,
    updateCard,
    submitCard,
    closeShareModal
  }
}

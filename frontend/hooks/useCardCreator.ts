'use client'

import { useMemo, useState } from 'react'
import { DEFAULT_CARD } from '@/lib/constants'
import type { CardData } from '@/lib/types'

type EditableCardData = Omit<CardData, 'slug' | 'viewCount' | 'createdAt'>

export function useCardCreator() {
  const [card, setCard] = useState<EditableCardData>({
    senderName: DEFAULT_CARD.senderName,
    recipientName: DEFAULT_CARD.recipientName,
    wishText: DEFAULT_CARD.wishText,
    theme: DEFAULT_CARD.theme,
    borderStyle: DEFAULT_CARD.borderStyle,
    accentColor: DEFAULT_CARD.accentColor,
    animationSet: DEFAULT_CARD.animationSet
  })

  const previewCard = useMemo<CardData>(
    () => ({
      ...card,
      slug: DEFAULT_CARD.slug,
      viewCount: 0,
      createdAt: DEFAULT_CARD.createdAt
    }),
    [card]
  )

  function updateCard<K extends keyof EditableCardData>(key: K, value: EditableCardData[K]) {
    setCard((current) => ({
      ...current,
      [key]: value
    }))
  }

  return {
    card,
    previewCard,
    updateCard
  }
}

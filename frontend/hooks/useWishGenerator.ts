'use client'

import { useState } from 'react'
import { generateWish } from '@/lib/api'
import type { WishTone } from '@/lib/types'

export function useWishGenerator() {
  const [tone, setTone] = useState<WishTone>('devotional')
  const [isGenerating, setIsGenerating] = useState(false)
  const [wishError, setWishError] = useState<string | null>(null)

  async function requestWish(recipientName: string) {
    setIsGenerating(true)
    setWishError(null)

    try {
      return await generateWish(recipientName.trim(), tone)
    } catch {
      setWishError('දෝෂයක් ඇති විය. නැවත උත්සාහ කරන්න.')
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    tone,
    setTone,
    isGenerating,
    wishError,
    requestWish
  }
}

'use client'

import { useState } from 'react'
import { SinhalaButton } from '@/components/ui/SinhalaButton'
import { createCardGifFile, saveBlob } from '@/lib/card-download'
import type { CardData } from '@/lib/types'

type ShareGifStatus = 'idle' | 'sharing' | 'fallback' | 'error'

interface ShareGifButtonProps {
  card: CardData
  shareUrl: string
  className?: string
}

export function ShareGifButton({ card, shareUrl, className = '' }: ShareGifButtonProps) {
  const [status, setStatus] = useState<ShareGifStatus>('idle')

  async function shareGif() {
    setStatus('sharing')

    try {
      const file = await createCardGifFile(card)
      const canShareFile = typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })

      if (typeof navigator.share === 'function' && canShareFile) {
        await navigator.share({
          title: 'Vesak Card',
          text: shareUrl,
          files: [file]
        })
        setStatus('idle')
        return
      }

      saveBlob(file, file.name)
      setStatus('fallback')
      window.setTimeout(() => setStatus('idle'), 2600)
    } catch {
      setStatus('error')
      window.setTimeout(() => setStatus('idle'), 2600)
    }
  }

  function getLabel() {
    if (status === 'sharing') {
      return 'GIF share සකස් වෙමින්...'
    }

    if (status === 'fallback') {
      return 'GIF Download වුණා'
    }

    if (status === 'error') {
      return 'GIF share අසාර්ථක වුණා'
    }

    return 'Animated GIF share කරන්න'
  }

  return (
    <SinhalaButton
      type="button"
      variant="secondary"
      disabled={status === 'sharing'}
      onClick={shareGif}
      className={className}
    >
      {getLabel()}
    </SinhalaButton>
  )
}

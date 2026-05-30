'use client'

import { useState } from 'react'
import { SinhalaButton } from '@/components/ui/SinhalaButton'
import { downloadCardGif, downloadCardPng } from '@/lib/card-download'
import type { CardData } from '@/lib/types'

type DownloadStatus = 'idle' | 'downloading' | 'error'
type DownloadFormat = 'png' | 'gif'

interface DownloadCardButtonProps {
  card: CardData
  className?: string
  format?: DownloadFormat
  label?: string
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function DownloadCardButton({
  card,
  className = '',
  format = 'png',
  label,
  variant = 'secondary'
}: DownloadCardButtonProps) {
  const [status, setStatus] = useState<DownloadStatus>('idle')

  async function handleDownload() {
    setStatus('downloading')
    try {
      if (format === 'gif') {
        await downloadCardGif(card)
      } else {
        await downloadCardPng(card)
      }
      setStatus('idle')
    } catch {
      setStatus('error')
      window.setTimeout(() => setStatus('idle'), 2500)
    }
  }

  function getLabel() {
    if (status === 'downloading') {
      return format === 'gif' ? 'GIF සකස් වෙමින්...' : 'Download වෙමින්...'
    }

    if (status === 'error') {
      return 'Download අසාර්ථක වුණා'
    }

    return label ?? (format === 'gif' ? 'Animated GIF Download කරන්න' : 'PNG Download කරන්න')
  }

  const isDownloading = status === 'downloading'

  return (
    <SinhalaButton
      type="button"
      variant={variant}
      disabled={isDownloading}
      onClick={handleDownload}
      className={className}
    >
      {getLabel()}
    </SinhalaButton>
  )
}

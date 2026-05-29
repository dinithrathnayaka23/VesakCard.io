'use client'

import { useState } from 'react'
import { SinhalaButton } from '@/components/ui/SinhalaButton'
import { downloadCardPng } from '@/lib/card-download'
import type { CardData } from '@/lib/types'

type DownloadStatus = 'idle' | 'downloading' | 'error'

interface DownloadCardButtonProps {
  card: CardData
  className?: string
  label?: string
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function DownloadCardButton({
  card,
  className = '',
  label = 'PNG Download කරන්න',
  variant = 'secondary'
}: DownloadCardButtonProps) {
  const [status, setStatus] = useState<DownloadStatus>('idle')

  async function handleDownload() {
    setStatus('downloading')
    try {
      await downloadCardPng(card)
      setStatus('idle')
    } catch {
      setStatus('error')
      window.setTimeout(() => setStatus('idle'), 2500)
    }
  }

  function getLabel() {
    if (status === 'downloading') {
      return 'Download වෙමින්...'
    }

    if (status === 'error') {
      return 'Download අසාර්ථක වුණා'
    }

    return label
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

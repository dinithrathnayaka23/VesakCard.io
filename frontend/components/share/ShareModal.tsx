'use client'

import { useEffect, useRef, useState } from 'react'
import { CardCanvas } from '@/components/card/CardCanvas'
import { SinhalaButton } from '@/components/ui/SinhalaButton'
import type { CardData } from '@/lib/types'

interface ShareModalProps {
  card: CardData
  shareUrl: string
  onClose: () => void
}

export function ShareModal({ card, shareUrl, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!copied) {
      return
    }

    const timeoutId = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timeoutId)
  }, [copied])

  async function copyShareUrl() {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
  }

  const encodedUrl = encodeURIComponent(shareUrl)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#251a12]/58 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-y-auto rounded-lg border border-[#d8cbb7] bg-[#fffaf1] p-4 shadow-[0_24px_90px_rgba(20,14,8,0.38)] sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#176d5b]">Card එක ready</p>
            <h2 className="mt-1 text-2xl font-bold leading-tight text-[#251a12]">Share කරන්න</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-lg border border-[#d8cbb7] bg-white/80 text-xl leading-none text-[#5e4d3f] transition hover:bg-white"
            aria-label="Close"
          >
            x
          </button>
        </div>

        <div className="mx-auto mb-5 max-w-md">
          <CardCanvas {...card} animated={false} mode="creator" />
        </div>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-[#31241a]">Share link එක</span>
          <input
            ref={inputRef}
            readOnly
            value={shareUrl}
            onClick={() => inputRef.current?.select()}
            className="h-12 w-full rounded-lg border border-[#d8cbb7] bg-white px-4 text-sm text-[#2c2118] outline-none focus:border-[#176d5b] focus:ring-4 focus:ring-[#176d5b]/12"
          />
        </label>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <SinhalaButton type="button" onClick={copyShareUrl} className="w-full">
            {copied ? 'Copy වුණා' : 'Link එක copy කරන්න'}
          </SinhalaButton>
          <a
            href={`https://wa.me/?text=${encodedUrl}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#176d5b]/20 bg-white px-4 py-2 text-center text-sm font-semibold text-[#176d5b] transition hover:border-[#176d5b]/45"
          >
            WhatsApp share
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#315b9c]/20 bg-white px-4 py-2 text-center text-sm font-semibold text-[#315b9c] transition hover:border-[#315b9c]/45"
          >
            Facebook share
          </a>
        </div>
      </div>
    </div>
  )
}

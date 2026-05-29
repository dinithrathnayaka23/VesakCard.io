'use client'

import { AnimationSelector } from '@/components/creator/AnimationSelector'
import { BorderSelector } from '@/components/creator/BorderSelector'
import { ColorPicker } from '@/components/creator/ColorPicker'
import { ThemeSelector } from '@/components/creator/ThemeSelector'
import { WishInput } from '@/components/creator/WishInput'
import { SinhalaButton } from '@/components/ui/SinhalaButton'
import type { CardData } from '@/lib/types'

type EditableCardData = Omit<CardData, 'slug' | 'viewCount' | 'createdAt'>

interface CustomizerPanelProps {
  card: EditableCardData
  onChange: <K extends keyof EditableCardData>(key: K, value: EditableCardData[K]) => void
}

export function CustomizerPanel({ card, onChange }: CustomizerPanelProps) {
  return (
    <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-[#31241a]">ඔබේ නම</span>
          <input
            value={card.senderName}
            onChange={(event) => onChange('senderName', event.target.value)}
            maxLength={100}
            className="h-12 w-full rounded-lg border border-[#d8cbb7] bg-white/86 px-4 text-sm text-[#2c2118] outline-none transition placeholder:text-[#9a8978] focus:border-[#176d5b] focus:ring-4 focus:ring-[#176d5b]/12"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-[#31241a]">ලබන්නාගේ නම (අවශ්‍ය නොවේ)</span>
          <input
            value={card.recipientName}
            onChange={(event) => onChange('recipientName', event.target.value)}
            maxLength={100}
            className="h-12 w-full rounded-lg border border-[#d8cbb7] bg-white/86 px-4 text-sm text-[#2c2118] outline-none transition placeholder:text-[#9a8978] focus:border-[#176d5b] focus:ring-4 focus:ring-[#176d5b]/12"
          />
        </label>
      </div>

      <WishInput value={card.wishText} onChange={(value) => onChange('wishText', value)} />
      <ThemeSelector value={card.theme} onChange={(value) => onChange('theme', value)} />
      <BorderSelector value={card.borderStyle} onChange={(value) => onChange('borderStyle', value)} />
      <ColorPicker value={card.accentColor} onChange={(value) => onChange('accentColor', value)} />
      <AnimationSelector value={card.animationSet} onChange={(value) => onChange('animationSet', value)} />

      <div className="flex flex-col gap-3 pt-1 sm:flex-row">
        <SinhalaButton type="button" disabled className="w-full sm:w-auto">
          කාඩ්පත සාදන්න
        </SinhalaButton>
        <SinhalaButton
          type="button"
          variant="ghost"
          className="w-full sm:w-auto"
          onClick={() => {
            onChange('theme', 'lotus_night')
            onChange('borderStyle', 'traditional_1')
            onChange('accentColor', '#D4AF37')
            onChange('animationSet', 'lanterns_petals')
          }}
        >
          පෙරනිමි
        </SinhalaButton>
      </div>
    </form>
  )
}

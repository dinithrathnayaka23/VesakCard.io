'use client'

import { ANIMATION_NAMES } from '@/lib/constants'
import type { CardData } from '@/lib/types'

interface AnimationSelectorProps {
  value: CardData['animationSet']
  onChange: (value: CardData['animationSet']) => void
}

export function AnimationSelector({ value, onChange }: AnimationSelectorProps) {
  return (
    <fieldset className="space-y-3 border-b border-[#d9cbb8] pb-5">
      <legend className="text-sm font-semibold text-[#31241a]">සජීවීකරණය</legend>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(ANIMATION_NAMES).map(([animationKey, label]) => {
          const key = animationKey as CardData['animationSet']
          const selected = value === key

          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`min-h-11 rounded-lg border px-3 text-sm font-semibold transition ${
                selected
                  ? 'border-[#176d5b] bg-[#176d5b] text-white shadow-sm'
                  : 'border-[#d8cbb7] bg-white/70 text-[#5e4d3f] hover:border-[#176d5b]/45 hover:bg-white'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

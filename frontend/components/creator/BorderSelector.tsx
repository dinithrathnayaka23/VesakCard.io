'use client'

import { BORDER_NAMES } from '@/lib/constants'
import type { CardData } from '@/lib/types'

interface BorderSelectorProps {
  value: CardData['borderStyle']
  onChange: (value: CardData['borderStyle']) => void
}

export function BorderSelector({ value, onChange }: BorderSelectorProps) {
  return (
    <fieldset className="space-y-3 border-b border-[#d9cbb8] pb-5">
      <legend className="text-sm font-semibold text-[#31241a]">සීමාවේ රටාව</legend>
      <div className="grid grid-cols-2 gap-2 rounded-lg border border-[#d8cbb7] bg-[#f5efe4] p-1">
        {Object.entries(BORDER_NAMES).map(([borderKey, label]) => {
          const key = borderKey as CardData['borderStyle']
          const selected = value === key

          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`min-h-10 rounded-md px-3 text-sm font-semibold transition ${
                selected ? 'bg-white text-[#176d5b] shadow-sm' : 'text-[#6d5b4a] hover:bg-white/60'
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

'use client'

import { THEMES } from '@/lib/constants'
import type { CardData } from '@/lib/types'

interface ThemeSelectorProps {
  value: CardData['theme']
  onChange: (value: CardData['theme']) => void
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <fieldset className="space-y-3 border-b border-[#d9cbb8] pb-5">
      <legend className="text-sm font-semibold text-[#31241a]">Theme එක</legend>
      <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-2">
        {Object.entries(THEMES).map(([themeKey, theme]) => {
          const key = themeKey as CardData['theme']
          const selected = value === key

          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`group overflow-hidden rounded-lg border bg-white text-left transition ${
                selected
                  ? 'border-[#176d5b] ring-2 ring-[#176d5b]/18'
                  : 'border-[#d8cbb7] hover:border-[#176d5b]/45'
              }`}
            >
              <span
                className="block h-20 bg-cover bg-center"
                style={{ backgroundImage: `url(${theme.image})` }}
                aria-hidden="true"
              />
              <span className="block px-3 py-2 text-sm font-semibold text-[#31241a]">{theme.name}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

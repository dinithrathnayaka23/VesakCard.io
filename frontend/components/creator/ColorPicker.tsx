'use client'

import { ACCENT_COLORS } from '@/lib/constants'

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <fieldset className="space-y-3 border-b border-[#d9cbb8] pb-5">
      <legend className="text-sm font-semibold text-[#31241a]">Accent color එක</legend>
      <div className="flex flex-wrap items-center gap-3">
        {ACCENT_COLORS.map((color) => {
          const selected = value.toLowerCase() === color.toLowerCase()

          return (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              aria-label={color}
              className={`h-10 w-10 rounded-full border transition ${
                selected ? 'border-[#251a12] ring-2 ring-[#251a12]/18 ring-offset-2' : 'border-black/10 hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
            />
          )
        })}

        <input
          aria-label="Accent color"
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-14 cursor-pointer rounded-lg border border-[#d8cbb7] bg-white p-1"
        />
      </div>
    </fieldset>
  )
}

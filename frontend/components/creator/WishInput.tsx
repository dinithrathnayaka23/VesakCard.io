'use client'

import { SinhalaButton } from '@/components/ui/SinhalaButton'
import type { WishTone } from '@/lib/types'

interface WishInputProps {
  value: string
  tone: WishTone
  isGenerating: boolean
  error: string | null
  onChange: (value: string) => void
  onToneChange: (value: WishTone) => void
  onGenerate: () => void
}

const tones: Array<{ value: WishTone; label: string }> = [
  { value: 'devotional', label: 'භක්තිමත්' },
  { value: 'friendly', label: 'මිතුරු' },
  { value: 'formal', label: 'ගෞරවනීය' }
]

export function WishInput({
  value,
  tone,
  isGenerating,
  error,
  onChange,
  onToneChange,
  onGenerate
}: WishInputProps) {
  return (
    <fieldset className="space-y-3 border-b border-[#d9cbb8] pb-5">
      <legend className="text-sm font-semibold text-[#31241a]">ප්‍රාර්ථනා පණිවිඩය</legend>

      <div className="grid gap-3 xl:grid-cols-[1fr_auto] xl:items-center">
        <div className="grid grid-cols-3 gap-1 rounded-lg border border-[#d8cbb7] bg-[#f5efe4] p-1">
          {tones.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onToneChange(option.value)}
              className={`min-h-10 rounded-md px-2 text-sm font-semibold transition ${
                tone === option.value ? 'bg-white text-[#176d5b] shadow-sm' : 'text-[#6d5b4a] hover:bg-white/60'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <SinhalaButton
          type="button"
          variant="secondary"
          disabled={isGenerating}
          onClick={onGenerate}
          className="min-h-10 w-full px-3 xl:w-auto"
        >
          {isGenerating ? 'ජනනය වෙමින්...' : 'AI ප්‍රාර්ථනා ජනනය කරන්න'}
        </SinhalaButton>
      </div>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={500}
        minLength={10}
        rows={6}
        className="min-h-36 w-full resize-y rounded-lg border border-[#d8cbb7] bg-white/86 px-4 py-3 text-sm leading-7 text-[#2c2118] outline-none transition placeholder:text-[#9a8978] focus:border-[#176d5b] focus:ring-4 focus:ring-[#176d5b]/12"
      />
      <div className="h-1.5 overflow-hidden rounded-full bg-[#e6dac8]">
        <div
          className="h-full rounded-full bg-[#176d5b] transition-all"
          style={{ width: `${Math.min(100, (value.length / 500) * 100)}%` }}
        />
      </div>
      {error ? <p className="text-sm font-semibold text-[#a33b2d]">{error}</p> : null}
    </fieldset>
  )
}

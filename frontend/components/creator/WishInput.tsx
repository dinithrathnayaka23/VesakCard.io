'use client'

import { SinhalaButton } from '@/components/ui/SinhalaButton'

interface WishInputProps {
  value: string
  onChange: (value: string) => void
}

export function WishInput({ value, onChange }: WishInputProps) {
  return (
    <fieldset className="space-y-3 border-b border-[#d9cbb8] pb-5">
      <legend className="text-sm font-semibold text-[#31241a]">ප්‍රාර්ථනා පණිවිඩය</legend>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <SinhalaButton type="button" variant="secondary" disabled className="min-h-10 w-full px-3 sm:w-auto">
          AI ප්‍රාර්ථනා ජනනය කරන්න
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
    </fieldset>
  )
}

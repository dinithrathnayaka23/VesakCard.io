'use client'

import { CardCanvas } from '@/components/card/CardCanvas'
import { CustomizerPanel } from '@/components/creator/CustomizerPanel'
import { useCardCreator } from '@/hooks/useCardCreator'

export default function HomePage() {
  const { card, previewCard, updateCard } = useCardCreator()

  return (
    <main className="min-h-screen max-w-full overflow-hidden px-4 py-5 sm:px-6 lg:px-8">
      <section className="mx-auto grid w-full max-w-full gap-6 lg:max-w-7xl lg:grid-cols-[minmax(0,1.04fr)_minmax(360px,0.96fr)] lg:items-start">
        <div className="min-w-0 max-w-full lg:sticky lg:top-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0 max-w-full">
              <p className="text-sm font-semibold text-[#176d5b]">වෙසක් කාඩ්පත්</p>
              <h1 className="mt-1 max-w-full break-words text-[1.7rem] font-bold leading-tight text-[#251a12] sm:text-3xl">
                ඔබේ වෙසක් කාඩ්පත සාදන්න
              </h1>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[calc(100vw-2rem)] lg:max-w-none">
            <CardCanvas {...previewCard} mode="creator" />
          </div>
        </div>

        <div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-[#d8cbb7] bg-[#fffaf1]/82 p-4 shadow-[0_20px_60px_rgba(54,42,27,0.12)] backdrop-blur sm:p-5 lg:p-6">
          <CustomizerPanel card={card} onChange={updateCard} />
        </div>
      </section>
    </main>
  )
}

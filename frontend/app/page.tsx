import { CardCanvas } from '@/components/card/CardCanvas'
import type { CardData } from '@/lib/types'

const demoCard: CardData = {
  slug: 'DEMO2026',
  senderName: 'නිමාෂා',
  recipientName: 'ආදරණීය පවුලේ සැමට',
  wishText:
    'ත්‍රිවිධ රත්නයේ ආශීර්වාදයෙන් ඔබගේ ජීවිතයට කරුණාව, සාමය සහ ප්‍රඥාව පිරී ඉතිරේවා. ධර්මයේ ආලෝකය ඔබේ හදවත සන්සුන් කර සතුට පතුරවාවා.',
  theme: 'lotus_night',
  borderStyle: 'traditional_1',
  accentColor: '#D4AF37',
  animationSet: 'lanterns_petals',
  viewCount: 0,
  createdAt: new Date().toISOString()
}

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <section className="mx-auto grid w-full min-h-[calc(100vh-3rem)] max-w-7xl items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
        <div className="min-w-0 w-full">
          <CardCanvas {...demoCard} mode="creator" />
        </div>

        <div className="space-y-5 lg:pl-6">
          <p className="text-sm font-semibold text-[color:var(--leaf)]">වෙසක් කාඩ්පත්</p>
          <h1 className="max-w-xl text-3xl font-bold leading-tight text-balance sm:text-4xl lg:text-5xl">
            ඔබේ වෙසක් කාඩ්පත සාදන්න
          </h1>
          <div className="h-1 w-24 rounded-full bg-[color:var(--lotus)]" />
          <p className="max-w-lg text-base leading-8 text-[color:var(--muted)] sm:text-lg">
            සුභ වෙසක් පණිවිඩයක් නිර්මාණය කර ආදරණීයයන් සමඟ බෙදාගන්න.
          </p>
        </div>
      </section>
    </main>
  )
}

import type { CardData } from '@/lib/types'

export const THEMES: Record<
  CardData['theme'],
  {
    name: string
    image: string
    ogColor: string
  }
> = {
  lotus_night: {
    name: 'රාත්‍රී Lotus',
    image: '/themes/lotus_night.webp',
    ogColor: '#151437'
  },
  temple_dawn: {
    name: 'පන්සල් Dawn',
    image: '/themes/temple_dawn.webp',
    ogColor: '#995b36'
  },
  lantern_sky: {
    name: 'Lantern අහස',
    image: '/themes/lantern_sky.webp',
    ogColor: '#233b68'
  },
  forest_stream: {
    name: 'වන දිය පාර',
    image: '/themes/forest_stream.webp',
    ogColor: '#205244'
  }
}

export const BORDER_NAMES: Record<CardData['borderStyle'], string> = {
  traditional_1: 'පාරම්පරික',
  lotus_border: 'Lotus',
  dharma_border: 'ධර්ම චක්‍ර',
  simple_gold: 'සරල රන්'
}

export const ANIMATION_NAMES: Record<CardData['animationSet'], string> = {
  lanterns_petals: 'කූඩු + මල් පෙති',
  fireflies: 'Fireflies',
  lotus_bloom: 'Lotus bloom',
  full: 'Full Vesak'
}

export const ACCENT_COLORS = ['#D4AF37', '#F9A8D4', '#FEF9EE', '#8FD8B8', '#F59E0B']

export const DEFAULT_CARD: CardData = {
  slug: 'DEMO2026',
  senderName: 'දිනිත්',
  recipientName: 'පවුලේ සැමට',
  wishText:
    'සුභ වෙසක් වේවා! තෙරුවන් සරණයි. මේ පින්බර වෙසක් දිනයේ ඔබටත් ඔබේ පවුලේ සැමටත් කරුණාව, සාමය සහ සතුට පිරී ඉතිරේවා. ධර්මයේ ආලෝකයෙන් සිත් සැනසේවා.',
  theme: 'lotus_night',
  borderStyle: 'traditional_1',
  accentColor: '#D4AF37',
  animationSet: 'lanterns_petals',
  viewCount: 0,
  createdAt: new Date().toISOString()
}

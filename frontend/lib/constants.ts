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
    name: 'රාත්‍රී නෙළුම',
    image: '/themes/lotus_night.webp',
    ogColor: '#151437'
  },
  temple_dawn: {
    name: 'පන්සල් උදාව',
    image: '/themes/temple_dawn.webp',
    ogColor: '#995b36'
  },
  lantern_sky: {
    name: 'කූඩු අහස',
    image: '/themes/lantern_sky.webp',
    ogColor: '#233b68'
  },
  forest_stream: {
    name: 'වන දිය',
    image: '/themes/forest_stream.webp',
    ogColor: '#205244'
  }
}

export const BORDER_NAMES: Record<CardData['borderStyle'], string> = {
  traditional_1: 'සාම්ප්‍රදායික',
  lotus_border: 'නෙළුම් රටාව',
  dharma_border: 'ධර්ම රටාව',
  simple_gold: 'සරල රන්'
}

export const ANIMATION_NAMES: Record<CardData['animationSet'], string> = {
  lanterns_petals: 'කූඩු හා මල්',
  fireflies: 'කණාමැදිරි',
  lotus_bloom: 'නෙළුම් මල්',
  full: 'සම්පූර්ණ'
}

export const ACCENT_COLORS = ['#D4AF37', '#F9A8D4', '#FEF9EE', '#8FD8B8', '#F59E0B']

export const DEFAULT_CARD: CardData = {
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

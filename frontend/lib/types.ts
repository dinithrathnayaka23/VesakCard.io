export interface CardData {
  slug: string
  senderName: string
  recipientName: string
  wishText: string
  theme: 'lotus_night' | 'temple_dawn' | 'lantern_sky' | 'forest_stream'
  borderStyle: 'traditional_1' | 'lotus_border' | 'dharma_border' | 'simple_gold'
  accentColor: string
  animationSet: 'lanterns_petals' | 'fireflies' | 'lotus_bloom' | 'full'
  viewCount: number
  createdAt: string
}

export interface CreateCardResponse {
  slug: string
  shareUrl: string
}

export interface WishResponse {
  sinhala: string
  english: string
}

export type CardFormData = Omit<CardData, 'slug' | 'viewCount' | 'createdAt'>

export type WishTone = 'formal' | 'friendly' | 'devotional'

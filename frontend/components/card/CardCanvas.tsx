'use client'

import { CardBorder } from '@/components/card/CardBorder'
import { FireflyLayer } from '@/components/card/FireflyLayer'
import { LanternLayer } from '@/components/card/LanternLayer'
import { PetalLayer } from '@/components/card/PetalLayer'
import { TextPanel } from '@/components/card/TextPanel'
import { THEMES } from '@/lib/constants'
import type { CardData } from '@/lib/types'

type CardCanvasProps = CardData & {
  mode: 'creator' | 'viewer'
}

export function CardCanvas({
  senderName,
  recipientName,
  wishText,
  theme,
  borderStyle,
  accentColor,
  animationSet,
  mode
}: CardCanvasProps) {
  const themeConfig = THEMES[theme]
  const showLanterns = animationSet === 'lanterns_petals' || animationSet === 'full'
  const showPetals = animationSet === 'lanterns_petals' || animationSet === 'lotus_bloom' || animationSet === 'full'
  const showFireflies = animationSet === 'fireflies' || animationSet === 'full'

  return (
    <div
      className="vesak-card-surface relative aspect-[3/2] w-full max-w-full overflow-hidden"
      aria-label={mode === 'viewer' ? 'වෙසක් කාඩ්පත' : 'වෙසක් කාඩ්පත් පෙරදසුන'}
    >
      <img src={themeConfig.image} alt="" loading="lazy" aria-hidden="true" className="hidden" />

      <div
        className="vesak-card-bg absolute inset-0"
        style={{ backgroundImage: `url(${themeConfig.image})` }}
        aria-hidden="true"
      />

      {showLanterns ? <LanternLayer accentColor={accentColor} /> : null}
      {showPetals ? <PetalLayer /> : null}
      {showFireflies ? <FireflyLayer accentColor={accentColor} /> : null}

      <CardBorder accentColor={accentColor} borderStyle={borderStyle} />
      <TextPanel
        senderName={senderName}
        recipientName={recipientName}
        wishText={wishText}
        accentColor={accentColor}
      />
    </div>
  )
}

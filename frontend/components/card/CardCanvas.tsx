'use client'

import { CardBorder } from '@/components/card/CardBorder'
import { FireflyLayer } from '@/components/card/FireflyLayer'
import { LanternLayer } from '@/components/card/LanternLayer'
import { PetalLayer } from '@/components/card/PetalLayer'
import { SymbolLayer } from '@/components/card/SymbolLayer'
import { TextPanel } from '@/components/card/TextPanel'
import { THEMES } from '@/lib/constants'
import type { CardData } from '@/lib/types'

type CardCanvasProps = CardData & {
  mode: 'creator' | 'viewer'
  animated?: boolean
}

export function CardCanvas({
  senderName,
  recipientName,
  wishText,
  theme,
  borderStyle,
  accentColor,
  animationSet,
  mode,
  animated = true
}: CardCanvasProps) {
  const themeConfig = THEMES[theme]
  const showLanterns = animated && (animationSet === 'lanterns_petals' || animationSet === 'full')
  const showPetals = animated && (animationSet === 'lanterns_petals' || animationSet === 'lotus_bloom' || animationSet === 'full')
  const showFireflies = animated && (animationSet === 'fireflies' || animationSet === 'full')

  return (
    <div
      className="vesak-card-surface relative aspect-[3/2] w-full min-w-0 max-w-full overflow-hidden"
      aria-label={mode === 'viewer' ? 'Vesak card' : 'Vesak card preview'}
    >
      <img src={themeConfig.image} alt="" loading="lazy" aria-hidden="true" className="hidden" />

      <div
        className="vesak-card-bg absolute inset-0"
        style={{ backgroundImage: `url(${themeConfig.image})` }}
        aria-hidden="true"
      />

      <SymbolLayer accentColor={accentColor} animationSet={animationSet} theme={theme} />
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

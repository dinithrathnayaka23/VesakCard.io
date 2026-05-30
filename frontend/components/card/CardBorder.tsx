import type { CardData } from '@/lib/types'

interface CardBorderProps {
  accentColor: string
  borderStyle: CardData['borderStyle']
}

export function CardBorder({ accentColor, borderStyle }: CardBorderProps) {
  return (
    <svg
      className="motion-safe-layer pointer-events-none absolute inset-0 z-30 h-full w-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {borderStyle === 'traditional_1' ? <TraditionalBorder accentColor={accentColor} /> : null}
      {borderStyle === 'lotus_border' ? <LotusBorder accentColor={accentColor} /> : null}
      {borderStyle === 'dharma_border' ? <DharmaBorder accentColor={accentColor} /> : null}
      {borderStyle === 'simple_gold' ? <SimpleGoldBorder accentColor={accentColor} /> : null}
    </svg>
  )
}

function TraditionalBorder({ accentColor }: { accentColor: string }) {
  return (
    <g style={{ animation: 'borderGlow 5s ease-in-out infinite' }}>
      <rect x="26" y="26" width="1148" height="748" rx="34" fill="none" stroke={accentColor} strokeWidth="8" />
      <rect x="48" y="48" width="1104" height="704" rx="24" fill="none" stroke={accentColor} strokeOpacity="0.48" strokeWidth="3" />
      {Array.from({ length: 14 }).map((_, index) => (
        <circle key={index} cx={95 + index * 78} cy="56" r="8" fill={accentColor} fillOpacity="0.62" />
      ))}
      {Array.from({ length: 14 }).map((_, index) => (
        <circle key={index} cx={95 + index * 78} cy="744" r="8" fill={accentColor} fillOpacity="0.62" />
      ))}
    </g>
  )
}

function LotusBorder({ accentColor }: { accentColor: string }) {
  return (
    <g style={{ animation: 'borderGlow 6s ease-in-out infinite' }}>
      <rect x="30" y="30" width="1140" height="740" rx="42" fill="none" stroke={accentColor} strokeWidth="6" />
      {[
        [105, 100],
        [1095, 100],
        [105, 700],
        [1095, 700]
      ].map(([cx, cy]) => (
        <g key={`${cx}-${cy}`} fill={accentColor} fillOpacity="0.7">
          <ellipse cx={cx} cy={cy - 18} rx="12" ry="30" />
          <ellipse cx={cx - 20} cy={cy} rx="12" ry="28" transform={`rotate(-42 ${cx - 20} ${cy})`} />
          <ellipse cx={cx + 20} cy={cy} rx="12" ry="28" transform={`rotate(42 ${cx + 20} ${cy})`} />
        </g>
      ))}
    </g>
  )
}

function DharmaBorder({ accentColor }: { accentColor: string }) {
  return (
    <g style={{ animation: 'borderGlow 5.5s ease-in-out infinite' }}>
      <rect x="34" y="34" width="1132" height="732" rx="30" fill="none" stroke={accentColor} strokeWidth="5" />
      {Array.from({ length: 8 }).map((_, index) => {
        const x = 150 + index * 130
        return (
          <path
            key={x}
            d={`M${x} 62 l18 24 l18 -24 M${x} 738 l18 -24 l18 24`}
            fill="none"
            stroke={accentColor}
            strokeOpacity="0.72"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )
      })}
      <circle cx="600" cy="64" r="18" fill="none" stroke={accentColor} strokeWidth="5" />
      <circle cx="600" cy="736" r="18" fill="none" stroke={accentColor} strokeWidth="5" />
    </g>
  )
}

function SimpleGoldBorder({ accentColor }: { accentColor: string }) {
  return (
    <g style={{ animation: 'borderGlow 7s ease-in-out infinite' }}>
      <rect x="38" y="38" width="1124" height="724" rx="28" fill="none" stroke={accentColor} strokeWidth="4" />
      <rect x="58" y="58" width="1084" height="684" rx="20" fill="none" stroke={accentColor} strokeOpacity="0.35" strokeWidth="2" />
    </g>
  )
}

import type { CardData } from '@/lib/types'

interface SymbolLayerProps {
  accentColor: string
  animationSet: CardData['animationSet']
}

export function SymbolLayer({ accentColor, animationSet }: SymbolLayerProps) {
  const animated = animationSet === 'lotus_bloom' || animationSet === 'full'

  return (
    <div className="motion-safe-layer pointer-events-none absolute inset-0 z-[5] overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-55"
        style={{
          background: `radial-gradient(circle at 50% 58%, ${accentColor}24 0%, transparent 28%), radial-gradient(circle at 82% 18%, ${accentColor}20 0%, transparent 22%)`
        }}
      />

      <img
        src="/symbols/lord-buddha.svg"
        alt=""
        className="absolute bottom-[13%] left-[5%] w-[24%] max-w-[170px] opacity-45 mix-blend-screen drop-shadow-[0_0_24px_rgba(212,175,55,0.35)]"
        loading="lazy"
      />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
        <g opacity="0.24">
          {Array.from({ length: 10 }).map((_, index) => (
            <path
              key={index}
              d={`M600 410 L${120 + index * 110} 0`}
              stroke={accentColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="5 18"
            />
          ))}
        </g>

        <g className={animated ? 'vesak-lotus-pulse' : undefined} opacity="0.62">
          <ellipse cx="600" cy="705" rx="210" ry="36" fill={accentColor} fillOpacity="0.16" />
          <path d="M600 700C520 642 500 578 600 500C700 578 680 642 600 700Z" fill={accentColor} fillOpacity="0.36" />
          <path d="M600 710C555 658 576 592 600 535C624 592 645 658 600 710Z" fill="#fff7df" fillOpacity="0.42" />
          <path d="M600 705C510 676 440 616 410 520C508 540 572 610 600 705Z" fill={accentColor} fillOpacity="0.28" />
          <path d="M600 705C690 676 760 616 790 520C692 540 628 610 600 705Z" fill={accentColor} fillOpacity="0.28" />
        </g>

        <g className={animated ? 'vesak-wheel-spin' : undefined} transform="translate(955 118)" opacity="0.3">
          <circle cx="78" cy="78" r="58" fill="none" stroke={accentColor} strokeWidth="8" />
          <circle cx="78" cy="78" r="13" fill={accentColor} />
          {Array.from({ length: 8 }).map((_, index) => (
            <line
              key={index}
              x1="78"
              y1="78"
              x2="78"
              y2="24"
              stroke={accentColor}
              strokeWidth="5"
              strokeLinecap="round"
              transform={`rotate(${index * 45} 78 78)`}
            />
          ))}
        </g>

        <g opacity="0.36">
          <path d="M118 74C340 45 626 45 1080 74" stroke={accentColor} strokeWidth="4" strokeLinecap="round" />
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const x = 190 + index * 170
            return (
              <g key={x} transform={`translate(${x} 74)`}>
                <line x1="0" y1="0" x2="0" y2="28" stroke={accentColor} strokeWidth="3" />
                <path d="M-20 42C-20 24 -10 14 0 14C10 14 20 24 20 42C20 58 10 68 0 68C-10 68 -20 58 -20 42Z" fill={accentColor} />
                <path d="M-11 42H11M0 16V67" stroke="#fff7df" strokeWidth="2" strokeOpacity="0.48" />
                <circle cx="0" cy="78" r="8" fill={accentColor} fillOpacity="0.3" />
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}

'use client'

import { useMemo } from 'react'

interface LanternLayerProps {
  accentColor: string
}

const startPositions = [12, 34, 62, 84]
const delays = [0, 2, 4, 6]

export function LanternLayer({ accentColor }: LanternLayerProps) {
  const durations = useMemo(() => [12, 10, 14, 11], [])

  return (
    <div className="motion-safe-layer pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
      {startPositions.map((left, index) => (
        <div
          key={left}
          className="absolute bottom-[-24%]"
          style={{
            left: `${left}%`,
            animation: `lanternFloat ${durations[index]}s ease-in-out ${delays[index]}s infinite`
          }}
        >
          <svg width="56" height="82" viewBox="0 0 56 82" fill="none" role="img">
            <path d="M28 2V15" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
            <path
              d="M14 24C14 15.7 20.3 10 28 10C35.7 10 42 15.7 42 24V42C42 50.3 35.7 56 28 56C20.3 56 14 50.3 14 42V24Z"
              fill={accentColor}
              fillOpacity="0.78"
            />
            <path
              d="M18 25H38M18 41H38M28 11V56"
              stroke="#FEF9EE"
              strokeOpacity="0.55"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path d="M22 58H34L31 66H25L22 58Z" fill={accentColor} fillOpacity="0.65" />
            <circle cx="28" cy="72" r="9" fill={accentColor} fillOpacity="0.2" />
          </svg>
        </div>
      ))}
    </div>
  )
}

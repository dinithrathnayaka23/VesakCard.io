'use client'

interface FireflyLayerProps {
  accentColor: string
}

const fireflies = [
  { left: 16, top: 24, delay: 0 },
  { left: 24, top: 68, delay: 1.5 },
  { left: 42, top: 18, delay: 2.4 },
  { left: 58, top: 72, delay: 0.8 },
  { left: 76, top: 31, delay: 3.1 },
  { left: 88, top: 57, delay: 1.1 }
]

export function FireflyLayer({ accentColor }: FireflyLayerProps) {
  return (
    <div className="motion-safe-layer pointer-events-none absolute inset-0 z-20" aria-hidden="true">
      {fireflies.map((firefly) => (
        <span
          key={`${firefly.left}-${firefly.top}`}
          className="absolute h-2 w-2 rounded-full"
          style={{
            left: `${firefly.left}%`,
            top: `${firefly.top}%`,
            backgroundColor: accentColor,
            boxShadow: `0 0 18px ${accentColor}`,
            animation: `fireflyPulse 3.8s ease-in-out ${firefly.delay}s infinite`
          }}
        />
      ))}
    </div>
  )
}

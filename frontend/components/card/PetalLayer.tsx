'use client'

const petals = [
  { left: 14, size: 9, delay: 0, duration: 16, color: '#F9A8D4' },
  { left: 28, size: 12, delay: 2, duration: 14, color: '#FEF9EE' },
  { left: 39, size: 8, delay: 5, duration: 18, color: '#F9A8D4' },
  { left: 51, size: 14, delay: 1, duration: 15, color: '#FEF9EE' },
  { left: 63, size: 10, delay: 4, duration: 17, color: '#F9A8D4' },
  { left: 72, size: 13, delay: 6, duration: 13, color: '#FEF9EE' },
  { left: 81, size: 9, delay: 3, duration: 16, color: '#F9A8D4' },
  { left: 92, size: 11, delay: 7, duration: 18, color: '#FEF9EE' }
]

export function PetalLayer() {
  return (
    <div className="motion-safe-layer pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
      {petals.map((petal) => (
        <span
          key={`${petal.left}-${petal.delay}`}
          className="absolute top-[-18px] block rounded-[60%_40%_65%_35%]"
          style={{
            left: `${petal.left}%`,
            width: `${petal.size}px`,
            height: `${Math.round(petal.size * 1.45)}px`,
            backgroundColor: petal.color,
            animation: `petalDrift ${petal.duration}s linear ${petal.delay}s infinite`,
            opacity: 0
          }}
        />
      ))}
    </div>
  )
}

interface TextPanelProps {
  senderName: string
  recipientName?: string
  wishText: string
  accentColor: string
}

export function TextPanel({ senderName, recipientName, wishText, accentColor }: TextPanelProps) {
  return (
    <div className="absolute left-1/2 top-1/2 z-40 max-w-[84%] -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-black/45 p-3 text-center shadow-2xl backdrop-blur-md sm:max-w-[80%] sm:p-6">
      <div
        className="font-serif text-[clamp(1rem,4vw,1.75rem)] font-bold leading-tight drop-shadow"
        style={{ color: accentColor, textShadow: '0 2px 14px rgba(0,0,0,0.72)' }}
      >
        සුභ වෙසක්!
      </div>

      {recipientName ? (
        <p className="mt-2 text-[clamp(0.62rem,2.1vw,1rem)] font-medium leading-[1.65] text-white/90 sm:mt-3">
          ආදරණීය {recipientName},
        </p>
      ) : null}

      <p className="mt-2 text-[clamp(0.58rem,2vw,0.95rem)] leading-[1.65] text-white/85 sm:mt-3 sm:leading-[1.8]">
        {wishText}
      </p>

      <p className="mt-2 text-right text-[clamp(0.56rem,1.8vw,0.82rem)] font-semibold sm:mt-4" style={{ color: accentColor }}>
        {senderName}
      </p>
    </div>
  )
}

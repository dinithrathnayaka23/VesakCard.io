interface TextPanelProps {
  senderName: string
  recipientName?: string
  wishText: string
  accentColor: string
}

export function TextPanel({ senderName, recipientName, wishText, accentColor }: TextPanelProps) {
  return (
    <div className="absolute left-1/2 top-1/2 z-40 max-h-[78%] w-[54%] max-w-[29rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-white/18 bg-[#176d5b]/30 p-[clamp(0.75rem,3cqw,1.5rem)] text-center shadow-2xl backdrop-blur-md max-[520px]:w-[60%]">
      <div
        className="font-serif text-[clamp(1rem,6cqw,1.75rem)] font-bold leading-tight drop-shadow"
        style={{ color: accentColor, textShadow: '0 2px 14px rgba(0,0,0,0.72)' }}
      >
        සුභ වෙසක්!
      </div>

      {recipientName ? (
        <p className="mt-[clamp(0.35rem,1.8cqw,0.75rem)] text-[clamp(0.64rem,2.45cqw,1rem)] font-medium leading-[1.5] text-white/90">
          ආදරණීය {recipientName},
        </p>
      ) : null}

      <p className="vesak-card-wish mt-[clamp(0.35rem,1.8cqw,0.75rem)] text-[clamp(0.6rem,2.2cqw,0.95rem)] leading-[1.55] text-white/85">
        {wishText}
      </p>

      <p className="mt-[clamp(0.35rem,1.8cqw,0.9rem)] text-right text-[clamp(0.56rem,1.85cqw,0.82rem)] font-semibold" style={{ color: accentColor }}>
        {senderName}
      </p>
    </div>
  )
}

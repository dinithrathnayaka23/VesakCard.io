import type { ButtonHTMLAttributes, ReactNode } from 'react'

type SinhalaButtonVariant = 'primary' | 'secondary' | 'ghost'

interface SinhalaButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: SinhalaButtonVariant
}

const variants: Record<SinhalaButtonVariant, string> = {
  primary: 'border-transparent bg-[#176d5b] text-white shadow-sm hover:bg-[#125847]',
  secondary: 'border-[#d8cbb7] bg-white/78 text-[#2c2118] hover:border-[#176d5b]/40 hover:bg-white',
  ghost: 'border-transparent bg-transparent text-[#176d5b] hover:bg-[#176d5b]/8'
}

export function SinhalaButton({ children, className = '', variant = 'primary', ...props }: SinhalaButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-lg border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

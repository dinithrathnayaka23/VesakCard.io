import type { Metadata } from 'next'
import { Noto_Sans_Sinhala, Noto_Serif_Sinhala } from 'next/font/google'
import '@/styles/globals.css'
import '@/styles/animations.css'

const notoSansSinhala = Noto_Sans_Sinhala({
  subsets: ['sinhala'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-sinhala',
  display: 'swap'
})

const notoSerifSinhala = Noto_Serif_Sinhala({
  subsets: ['sinhala'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-serif-sinhala',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'වෙසක් කාඩ්පත් | Vesak Cards',
  description: 'ශ්‍රී ලංකාවට සුදුසු සජීවී වෙසක් සුභ පැතුම් කාඩ්පත් සාදන්න.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000')
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="si" className={`${notoSansSinhala.variable} ${notoSerifSinhala.variable}`}>
      <body>{children}</body>
    </html>
  )
}

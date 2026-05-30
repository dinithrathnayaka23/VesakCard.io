import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { THEMES } from '@/lib/constants'
import { getCardForServer, isCardNotFoundError } from '@/lib/server-api'

export const runtime = 'nodejs'
export const revalidate = 3600

type OgRouteContext = {
  params: Promise<{
    slug: string
  }>
}

const FONT_PATH = join(process.cwd(), 'public', 'fonts', 'NotoSansSinhala.ttf')
const fontDataPromise = loadFontData()

export async function GET(_request: Request, { params }: OgRouteContext) {
  try {
    const { slug } = await params
    const card = await getCardForServer(slug)
    const fontData = await fontDataPromise
    const themeColor = THEMES[card.theme]?.ogColor ?? THEMES.lotus_night.ogColor
    const recipientLine = card.recipientName
      ? `ආදරණීය ${card.recipientName} වෙත`
      : 'වෙසක් ප්‍රාර්ථනාවක්'
    const senderLine = `${card.senderName}ගෙන්`
    const siteLabel = siteWatermark()

    const image = new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: themeColor,
            border: `18px solid ${card.accentColor}`,
            color: '#fffaf0',
            fontFamily: 'Noto Sans Sinhala',
            padding: 72,
            position: 'relative',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 70,
              bottom: 54,
              display: 'flex',
              width: 170,
              height: 118,
              opacity: 0.5
            }}
          >
            <svg width="170" height="118" viewBox="0 0 170 118" fill="none">
              <ellipse cx="85" cy="94" rx="72" ry="16" fill={card.accentColor} fillOpacity="0.26" />
              <path d="M85 94C54 70 46 45 85 18C124 45 116 70 85 94Z" fill={card.accentColor} fillOpacity="0.56" />
              <path d="M85 98C68 78 76 54 85 34C94 54 102 78 85 98Z" fill="#fff7df" fillOpacity="0.52" />
              <path d="M85 96C52 84 29 63 22 34C52 41 76 62 85 96Z" fill={card.accentColor} fillOpacity="0.42" />
              <path d="M85 96C118 84 141 63 148 34C118 41 94 62 85 96Z" fill={card.accentColor} fillOpacity="0.42" />
            </svg>
          </div>

          <div
            style={{
              position: 'absolute',
              right: 88,
              top: 68,
              display: 'flex',
              width: 126,
              height: 126,
              opacity: 0.32
            }}
          >
            <svg width="126" height="126" viewBox="0 0 126 126" fill="none">
              <circle cx="63" cy="63" r="48" stroke={card.accentColor} strokeWidth="8" />
              <circle cx="63" cy="63" r="10" fill={card.accentColor} />
              {Array.from({ length: 8 }).map((_, index) => (
                <line
                  key={index}
                  x1="63"
                  y1="63"
                  x2="63"
                  y2="18"
                  stroke={card.accentColor}
                  strokeWidth="5"
                  strokeLinecap="round"
                  transform={`rotate(${index * 45} 63 63)`}
                />
              ))}
            </svg>
          </div>

          <div
            style={{
              color: card.accentColor,
              display: 'flex',
              fontSize: 92,
              fontWeight: 700,
              letterSpacing: 0,
              lineHeight: 1.05,
              textShadow: '0 6px 24px rgba(0,0,0,0.32)'
            }}
          >
            සුභ වෙසක්!
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 34,
              fontWeight: 600,
              lineHeight: 1.45,
              marginTop: 34,
              maxWidth: 920,
              opacity: 0.94
            }}
          >
            {recipientLine}
          </div>
          <div
            style={{
              color: card.accentColor,
              display: 'flex',
              fontSize: 30,
              fontWeight: 500,
              lineHeight: 1.5,
              marginTop: 16,
              opacity: 0.92
            }}
          >
            {senderLine}
          </div>
          <div
            style={{
              bottom: 34,
              color: '#fffaf0',
              display: 'flex',
              fontSize: 22,
              fontWeight: 500,
              opacity: 0.74,
              position: 'absolute',
              right: 46
            }}
          >
            {siteLabel}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Noto Sans Sinhala',
            data: fontData,
            style: 'normal',
            weight: 400
          }
        ]
      }
    )

    image.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600')
    return image
  } catch (error) {
    if (isCardNotFoundError(error)) {
      return Response.json({ error: 'Card එක හමු නොවීය' }, { status: 404 })
    }

    throw error
  }
}

async function loadFontData() {
  const buffer = await readFile(FONT_PATH)
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer
}

function siteWatermark() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  return siteUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '')
}

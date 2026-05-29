import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { THEMES } from '@/lib/constants'
import { getCardForServer, isCardNotFoundError } from '@/lib/server-api'

export const runtime = 'nodejs'
export const revalidate = 3600

type OgRouteContext = {
  params: {
    slug: string
  }
}

const FONT_PATH = join(process.cwd(), 'public', 'fonts', 'NotoSansSinhala.ttf')
const fontDataPromise = loadFontData()

export async function GET(_request: Request, { params }: OgRouteContext) {
  try {
    const card = await getCardForServer(params.slug)
    const fontData = await fontDataPromise
    const themeColor = THEMES[card.theme]?.ogColor ?? THEMES.lotus_night.ogColor
    const recipientLine = card.recipientName
      ? `ආදරණීය ${card.recipientName} වෙත`
      : 'වෙසක් ප්‍රාර්ථනාවක්'
    const senderLine = `${card.senderName} වෙතින්`
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
      return Response.json({ error: 'කාඩ්පත හමු නොවීය' }, { status: 404 })
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

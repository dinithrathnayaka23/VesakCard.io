import { THEMES } from '@/lib/constants'
import { GifEncoder, quantizeToPalette } from '@/lib/gif-encoder'
import type { CardData } from '@/lib/types'

const CARD_WIDTH = 1200
const CARD_HEIGHT = 800
const GIF_WIDTH = 540
const GIF_HEIGHT = 360
const GIF_FRAME_COUNT = 18
const GIF_DELAY_CENTISECONDS = 10

type TextLine = {
  text: string
  font: string
  color: string
  lineHeight: number
  align?: CanvasTextAlign
}

export async function downloadCardPng(card: CardData) {
  if (typeof window === 'undefined') {
    return
  }

  await document.fonts?.ready
  const blob = await renderCardBlob(card)
  saveBlob(blob, `vesak-card-${safeFilename(card.slug || card.senderName)}.png`)
}

export async function downloadCardGif(card: CardData) {
  if (typeof window === 'undefined') {
    return
  }

  await document.fonts?.ready
  const blob = await renderCardGifBlob(card)
  saveBlob(blob, `vesak-card-${safeFilename(card.slug || card.senderName)}.gif`)
}

export async function createCardGifFile(card: CardData) {
  await document.fonts?.ready
  const blob = await renderCardGifBlob(card)
  return new File([blob], `vesak-card-${safeFilename(card.slug || card.senderName)}.gif`, {
    type: 'image/gif'
  })
}

export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

async function renderCardBlob(card: CardData): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = CARD_WIDTH
  canvas.height = CARD_HEIGHT
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Canvas is not available')
  }

  await drawCard(context, card, {
    animated: false,
    outputWidth: CARD_WIDTH,
    outputHeight: CARD_HEIGHT,
    frameProgress: 0
  })

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error('Card image export failed'))
      }
    }, 'image/png')
  })
}

async function renderCardGifBlob(card: CardData): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = GIF_WIDTH
  canvas.height = GIF_HEIGHT
  const context = canvas.getContext('2d', { willReadFrequently: true })

  if (!context) {
    throw new Error('Canvas is not available')
  }

  const encoder = new GifEncoder(GIF_WIDTH, GIF_HEIGHT)
  encoder.writeHeader()
  encoder.setRepeat(0)

  for (let frameIndex = 0; frameIndex < GIF_FRAME_COUNT; frameIndex += 1) {
    context.clearRect(0, 0, GIF_WIDTH, GIF_HEIGHT)
    await drawCard(context, card, {
      animated: true,
      outputWidth: GIF_WIDTH,
      outputHeight: GIF_HEIGHT,
      frameProgress: frameIndex / GIF_FRAME_COUNT
    })
    encoder.addFrame(
      quantizeToPalette(context.getImageData(0, 0, GIF_WIDTH, GIF_HEIGHT)),
      GIF_DELAY_CENTISECONDS
    )

    if (frameIndex % 4 === 0) {
      await new Promise((resolve) => window.setTimeout(resolve, 0))
    }
  }

  return new Blob([encoder.finish()], { type: 'image/gif' })
}

type DrawCardOptions = {
  animated: boolean
  frameProgress: number
  outputWidth: number
  outputHeight: number
}

async function drawCard(context: CanvasRenderingContext2D, card: CardData, options: DrawCardOptions) {
  context.save()
  context.scale(options.outputWidth / CARD_WIDTH, options.outputHeight / CARD_HEIGHT)

  const theme = THEMES[card.theme]
  const background = await loadImage(theme.image)
  drawCoverImage(context, background, 0, 0, CARD_WIDTH, CARD_HEIGHT)
  drawAtmosphere(context)

  const buddha = await loadImage('/symbols/lord-buddha-vesak.png')

  context.save()
  context.globalAlpha = 0.96
  context.shadowColor = 'rgba(255,220,135,0.48)'
  context.shadowBlur = 24
  drawContainImage(context, buddha, 22, 126, 310, 610)
  context.restore()

  drawLanternGarland(context, card.accentColor)
  drawLotusBase(context, card.accentColor)
  drawDhammaWheel(context, card.accentColor)
  drawAnimatedEffects(context, card, options.frameProgress, options.animated)
  drawBorder(context, card.accentColor, card.borderStyle)
  drawTextPanel(context, card)
  context.restore()
}

function drawAtmosphere(context: CanvasRenderingContext2D) {
  const radial = context.createRadialGradient(600, 380, 120, 600, 410, 650)
  radial.addColorStop(0, 'rgba(255,255,255,0.03)')
  radial.addColorStop(0.55, 'rgba(0,0,0,0.12)')
  radial.addColorStop(1, 'rgba(0,0,0,0.58)')
  context.fillStyle = radial
  context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  const linear = context.createLinearGradient(0, 0, 0, CARD_HEIGHT)
  linear.addColorStop(0, 'rgba(0,0,0,0.08)')
  linear.addColorStop(1, 'rgba(0,0,0,0.28)')
  context.fillStyle = linear
  context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)
}

function drawTextPanel(context: CanvasRenderingContext2D, card: CardData) {
  const panelWidth = 660
  const paddingX = 52
  const maxTextWidth = panelWidth - paddingX * 2
  const lines: TextLine[] = [
    {
      text: 'සුභ වෙසක්!',
      font: `700 46px "Noto Sans Sinhala", "Noto Sans", sans-serif`,
      color: card.accentColor,
      lineHeight: 58
    }
  ]

  if (card.recipientName.trim()) {
    wrapText(context, `ආදරණීය ${card.recipientName.trim()},`, maxTextWidth, `600 27px "Noto Sans Sinhala", sans-serif`)
      .forEach((text) => lines.push({
        text,
        font: `600 27px "Noto Sans Sinhala", sans-serif`,
        color: 'rgba(255,255,255,0.9)',
        lineHeight: 40
      }))
  }

  const wishFont = `500 29px "Noto Sans Sinhala", sans-serif`
  wrapText(context, card.wishText.trim(), maxTextWidth, wishFont)
    .slice(0, 8)
    .forEach((text) => lines.push({
      text,
      font: wishFont,
      color: 'rgba(255,255,255,0.86)',
      lineHeight: 42
    }))

  lines.push({
    text: card.senderName.trim(),
    font: `700 24px "Noto Sans Sinhala", sans-serif`,
    color: card.accentColor,
    lineHeight: 36,
    align: 'right'
  })

  const panelHeight = Math.max(350, lines.reduce((total, line) => total + line.lineHeight, 0) + 56)
  const panelX = (CARD_WIDTH - panelWidth) / 2
  const panelY = (CARD_HEIGHT - panelHeight) / 2

  context.save()
  context.shadowColor = 'rgba(0,0,0,0.48)'
  context.shadowBlur = 30
  context.fillStyle = 'rgba(4,12,18,0.62)'
  roundedRect(context, panelX, panelY, panelWidth, panelHeight, 18)
  context.fill()
  context.shadowBlur = 0
  context.strokeStyle = hexToRgba(card.accentColor, 0.34)
  context.lineWidth = 2
  context.stroke()
  context.restore()

  let y = panelY + 58
  lines.forEach((line) => {
    context.font = line.font
    context.textAlign = line.align ?? 'center'
    context.textBaseline = 'middle'
    context.fillStyle = line.color
    context.shadowColor = 'rgba(0,0,0,0.58)'
    context.shadowBlur = 8
    const x = line.align === 'right' ? panelX + panelWidth - paddingX : CARD_WIDTH / 2
    context.fillText(line.text, x, y, maxTextWidth)
    y += line.lineHeight
  })
  context.shadowBlur = 0
}

function drawBorder(context: CanvasRenderingContext2D, accentColor: string, borderStyle: CardData['borderStyle']) {
  const opacity = borderStyle === 'simple_gold' ? 0.62 : 0.78
  context.save()
  context.strokeStyle = hexToRgba(accentColor, opacity)
  context.lineWidth = borderStyle === 'traditional_1' ? 8 : 5
  roundedRect(context, 32, 32, CARD_WIDTH - 64, CARD_HEIGHT - 64, 34)
  context.stroke()

  context.strokeStyle = hexToRgba(accentColor, 0.42)
  context.lineWidth = 3
  roundedRect(context, 58, 58, CARD_WIDTH - 116, CARD_HEIGHT - 116, 24)
  context.stroke()

  if (borderStyle === 'traditional_1') {
    context.fillStyle = hexToRgba(accentColor, 0.58)
    for (let index = 0; index < 14; index += 1) {
      drawCircle(context, 95 + index * 78, 64, 8)
      drawCircle(context, 95 + index * 78, CARD_HEIGHT - 64, 8)
    }
  }
  context.restore()
}

function drawLanternGarland(context: CanvasRenderingContext2D, accentColor: string) {
  context.save()
  context.strokeStyle = hexToRgba(accentColor, 0.36)
  context.lineWidth = 4
  context.beginPath()
  context.moveTo(118, 74)
  context.bezierCurveTo(340, 45, 626, 45, 1080, 74)
  context.stroke()

  for (let index = 0; index < 6; index += 1) {
    const x = 190 + index * 170
    context.strokeStyle = hexToRgba(accentColor, 0.34)
    context.beginPath()
    context.moveTo(x, 74)
    context.lineTo(x, 104)
    context.stroke()
    context.fillStyle = hexToRgba(accentColor, 0.32)
    roundedRect(context, x - 18, 104, 36, 56, 16)
    context.fill()
  }
  context.restore()
}

function drawLotusBase(context: CanvasRenderingContext2D, accentColor: string) {
  context.save()
  context.globalAlpha = 0.55
  context.fillStyle = hexToRgba(accentColor, 0.2)
  context.beginPath()
  context.ellipse(600, 708, 210, 36, 0, 0, Math.PI * 2)
  context.fill()

  context.fillStyle = hexToRgba(accentColor, 0.36)
  drawPetal(context, 600, 620, 75, 130, 0)
  drawPetal(context, 505, 655, 58, 120, -0.8)
  drawPetal(context, 695, 655, 58, 120, 0.8)
  context.restore()
}

function drawDhammaWheel(context: CanvasRenderingContext2D, accentColor: string) {
  context.save()
  context.strokeStyle = hexToRgba(accentColor, 0.28)
  context.fillStyle = hexToRgba(accentColor, 0.3)
  context.lineWidth = 8
  context.beginPath()
  context.arc(1033, 196, 58, 0, Math.PI * 2)
  context.stroke()
  drawCircle(context, 1033, 196, 13)
  for (let index = 0; index < 8; index += 1) {
    const angle = (index * Math.PI) / 4
    context.beginPath()
    context.moveTo(1033, 196)
    context.lineTo(1033 + Math.cos(angle) * 54, 196 + Math.sin(angle) * 54)
    context.stroke()
  }
  context.restore()
}

function drawAnimatedEffects(
  context: CanvasRenderingContext2D,
  card: CardData,
  frameProgress: number,
  animated: boolean
) {
  if (!animated) {
    return
  }

  if (card.animationSet === 'lanterns_petals' || card.animationSet === 'full') {
    drawAnimatedLanterns(context, card.accentColor, frameProgress)
    drawAnimatedPetals(context, frameProgress)
  }

  if (card.animationSet === 'lotus_bloom') {
    drawAnimatedPetals(context, frameProgress)
  }

  if (card.animationSet === 'fireflies' || card.animationSet === 'full') {
    drawAnimatedFireflies(context, card.accentColor, frameProgress)
  }
}

function drawAnimatedLanterns(context: CanvasRenderingContext2D, accentColor: string, frameProgress: number) {
  const startX = [165, 405, 760, 1030]

  startX.forEach((baseX, index) => {
    const localProgress = (frameProgress + index * 0.21) % 1
    const sway = Math.sin(localProgress * Math.PI * 2 + index) * 26
    const x = baseX + sway
    const y = 850 - localProgress * 960
    const opacity = fadeLoopOpacity(localProgress)

    context.save()
    context.globalAlpha = opacity
    context.shadowColor = hexToRgba(accentColor, 0.45)
    context.shadowBlur = 22
    context.strokeStyle = hexToRgba(accentColor, 0.72)
    context.lineWidth = 3
    context.beginPath()
    context.moveTo(x, y - 42)
    context.lineTo(x, y - 16)
    context.stroke()

    context.fillStyle = hexToRgba(accentColor, 0.72)
    roundedRect(context, x - 26, y - 16, 52, 68, 24)
    context.fill()

    context.fillStyle = 'rgba(255, 244, 186, 0.56)'
    drawCircle(context, x, y + 62, 13)
    context.restore()
  })
}

function drawAnimatedPetals(context: CanvasRenderingContext2D, frameProgress: number) {
  const colors = ['rgba(249,168,212,0.82)', 'rgba(254,249,238,0.88)']

  for (let index = 0; index < 10; index += 1) {
    const localProgress = (frameProgress + index * 0.097) % 1
    const x = 80 + ((index * 137) % 1040) - localProgress * 130 + Math.sin(localProgress * Math.PI * 2) * 18
    const y = -40 + localProgress * 900
    const rotation = localProgress * Math.PI * 2 + index

    context.save()
    context.globalAlpha = fadeLoopOpacity(localProgress)
    context.fillStyle = colors[index % colors.length]
    drawPetal(context, x, y, 8 + (index % 4) * 2, 17 + (index % 3) * 3, rotation)
    context.restore()
  }
}

function drawAnimatedFireflies(context: CanvasRenderingContext2D, accentColor: string, frameProgress: number) {
  for (let index = 0; index < 13; index += 1) {
    const phase = frameProgress * Math.PI * 2 + index * 0.74
    const x = 130 + ((index * 89) % 940) + Math.sin(phase) * 18
    const y = 135 + ((index * 61) % 500) + Math.cos(phase * 0.8) * 24
    const opacity = 0.22 + Math.max(0, Math.sin(phase)) * 0.54

    context.save()
    context.globalAlpha = opacity
    context.shadowColor = hexToRgba(accentColor, 0.65)
    context.shadowBlur = 18
    context.fillStyle = hexToRgba(accentColor, 0.72)
    drawCircle(context, x, y, 4 + (index % 3))
    context.restore()
  }
}

function fadeLoopOpacity(progress: number) {
  if (progress < 0.12) {
    return progress / 0.12
  }

  if (progress > 0.88) {
    return (1 - progress) / 0.12
  }

  return 1
}

function drawCoverImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const ratio = Math.max(width / image.naturalWidth, height / image.naturalHeight)
  const drawWidth = image.naturalWidth * ratio
  const drawHeight = image.naturalHeight * ratio
  context.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight)
}

function drawContainImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const ratio = Math.min(width / image.naturalWidth, height / image.naturalHeight)
  const drawWidth = image.naturalWidth * ratio
  const drawHeight = image.naturalHeight * ratio
  context.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight)
}

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number, font: string) {
  context.font = font
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ''

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word
    if (context.measureText(candidate).width <= maxWidth) {
      line = candidate
      return
    }

    if (line) {
      lines.push(line)
    }
    line = word
  })

  if (line) {
    lines.push(line)
  }

  return lines
}

function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  context.beginPath()
  context.moveTo(x + radius, y)
  context.lineTo(x + width - radius, y)
  context.quadraticCurveTo(x + width, y, x + width, y + radius)
  context.lineTo(x + width, y + height - radius)
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  context.lineTo(x + radius, y + height)
  context.quadraticCurveTo(x, y + height, x, y + height - radius)
  context.lineTo(x, y + radius)
  context.quadraticCurveTo(x, y, x + radius, y)
}

function drawCircle(context: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  context.beginPath()
  context.arc(x, y, radius, 0, Math.PI * 2)
  context.fill()
}

function drawPetal(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number
) {
  context.save()
  context.translate(x, y)
  context.rotate(rotation)
  context.beginPath()
  context.ellipse(0, 0, width, height, 0, 0, Math.PI * 2)
  context.fill()
  context.restore()
}

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace('#', '')
  const red = Number.parseInt(normalized.slice(0, 2), 16)
  const green = Number.parseInt(normalized.slice(2, 4), 16)
  const blue = Number.parseInt(normalized.slice(4, 6), 16)
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

const imageCache = new Map<string, Promise<HTMLImageElement>>()

function loadImage(src: string) {
  const cachedImage = imageCache.get(src)

  if (cachedImage) {
    return cachedImage
  }

  const imagePromise = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Unable to load image: ${src}`))
    image.src = src
  })

  imageCache.set(src, imagePromise)
  return imagePromise
}

function safeFilename(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'vesak-card'
}

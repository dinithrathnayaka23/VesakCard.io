type IndexedFrame = {
  indexedPixels: Uint8Array
  palette: Uint8Array
}

export class GifEncoder {
  private bytes: number[] = []

  constructor(
    private readonly width: number,
    private readonly height: number
  ) {}

  writeHeader() {
    this.writeAscii('GIF89a')
    this.writeShort(this.width)
    this.writeShort(this.height)
    this.writeByte(0)
    this.writeByte(0)
    this.writeByte(0)
  }

  setRepeat(repeatCount = 0) {
    this.writeByte(0x21)
    this.writeByte(0xff)
    this.writeByte(0x0b)
    this.writeAscii('NETSCAPE2.0')
    this.writeByte(0x03)
    this.writeByte(0x01)
    this.writeShort(repeatCount)
    this.writeByte(0x00)
  }

  addFrame(frame: IndexedFrame, delayCentiseconds: number) {
    this.writeByte(0x21)
    this.writeByte(0xf9)
    this.writeByte(0x04)
    this.writeByte(0x00)
    this.writeShort(delayCentiseconds)
    this.writeByte(0x00)
    this.writeByte(0x00)

    this.writeByte(0x2c)
    this.writeShort(0)
    this.writeShort(0)
    this.writeShort(this.width)
    this.writeShort(this.height)
    this.writeByte(0x87)
    this.writeBytes(frame.palette)
    this.writeByte(8)
    this.writeSubBlocks(lzwEncode(frame.indexedPixels, 8))
  }

  finish() {
    this.writeByte(0x3b)
    return new Uint8Array(this.bytes)
  }

  private writeByte(value: number) {
    this.bytes.push(value & 0xff)
  }

  private writeShort(value: number) {
    this.writeByte(value)
    this.writeByte(value >> 8)
  }

  private writeAscii(value: string) {
    for (let index = 0; index < value.length; index += 1) {
      this.writeByte(value.charCodeAt(index))
    }
  }

  private writeBytes(values: Uint8Array) {
    for (let index = 0; index < values.length; index += 1) {
      this.writeByte(values[index])
    }
  }

  private writeSubBlocks(values: Uint8Array) {
    for (let offset = 0; offset < values.length; offset += 255) {
      const chunk = values.slice(offset, offset + 255)
      this.writeByte(chunk.length)
      this.writeBytes(chunk)
    }
    this.writeByte(0)
  }
}

export function quantizeToPalette(imageData: ImageData): IndexedFrame {
  const palette = createRgb332Palette()
  const indexedPixels = new Uint8Array(imageData.width * imageData.height)
  const data = imageData.data

  for (let offset = 0, pixel = 0; offset < data.length; offset += 4, pixel += 1) {
    const red = data[offset]
    const green = data[offset + 1]
    const blue = data[offset + 2]
    indexedPixels[pixel] = ((red >> 5) << 5) | ((green >> 5) << 2) | (blue >> 6)
  }

  return { indexedPixels, palette }
}

function createRgb332Palette() {
  const palette = new Uint8Array(256 * 3)

  for (let red = 0; red < 8; red += 1) {
    for (let green = 0; green < 8; green += 1) {
      for (let blue = 0; blue < 4; blue += 1) {
        const index = (red << 5) | (green << 2) | blue
        palette[index * 3] = Math.round((red * 255) / 7)
        palette[index * 3 + 1] = Math.round((green * 255) / 7)
        palette[index * 3 + 2] = Math.round((blue * 255) / 3)
      }
    }
  }

  return palette
}

function lzwEncode(indices: Uint8Array, minimumCodeSize: number) {
  const clearCode = 1 << minimumCodeSize
  const endCode = clearCode + 1
  const codeSize = minimumCodeSize + 1
  const maxLiteralCodesBeforeClear = 240
  const writer = new BitWriter()

  writer.write(clearCode, codeSize)
  let literalCodesSinceClear = 0

  indices.forEach((pixel) => {
    if (literalCodesSinceClear >= maxLiteralCodesBeforeClear) {
      writer.write(clearCode, codeSize)
      literalCodesSinceClear = 0
    }

    writer.write(pixel, codeSize)
    literalCodesSinceClear += 1
  })

  writer.write(endCode, codeSize)
  return writer.finish()
}

class BitWriter {
  private bytes: number[] = []
  private bitBuffer = 0
  private bitCount = 0

  write(code: number, size: number) {
    this.bitBuffer |= code << this.bitCount
    this.bitCount += size

    while (this.bitCount >= 8) {
      this.bytes.push(this.bitBuffer & 0xff)
      this.bitBuffer >>= 8
      this.bitCount -= 8
    }
  }

  finish() {
    if (this.bitCount > 0) {
      this.bytes.push(this.bitBuffer & 0xff)
    }

    return new Uint8Array(this.bytes)
  }
}

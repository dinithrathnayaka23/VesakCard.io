import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CardCanvas } from '@/components/card/CardCanvas'
import { getCardForServer, isCardNotFoundError } from '@/lib/server-api'

type CardPageProps = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CardPageProps): Promise<Metadata> {
  try {
    const card = await getCardForServer(params.slug)
    const title = `${card.senderName}ගේ වෙසක් ප්‍රාර්ථනාව`
    const description = card.wishText.slice(0, 150)
    const imageUrl = `/api/og/${params.slug}`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: 'වෙසක් කාඩ්පත'
          }
        ],
        type: 'website'
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl]
      }
    }
  } catch (error) {
    if (isCardNotFoundError(error)) {
      return {
        title: 'කාඩ්පත හමු නොවීය | Vesak Cards',
        description: 'මෙම කාඩ්පත ඉවත් කර ඇත හෝ වලංගු නොවේ'
      }
    }

    throw error
  }
}

export default async function CardPage({ params }: CardPageProps) {
  const card = await getCardOrNotFound(params.slug)

  return (
    <main className="min-h-screen bg-[#071413] text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-6 px-4 py-6 sm:px-6 lg:py-10">
        <div className="w-full max-w-5xl animate-cardEntrance">
          <CardCanvas {...card} mode="viewer" />
        </div>

        <Link
          href="/"
          className="inline-flex min-h-12 min-w-0 w-[calc(100vw-2rem)] max-w-full items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#D4AF37] px-5 py-3 text-center text-[0.78rem] font-bold leading-6 text-[#16120a] shadow-[0_14px_34px_rgba(212,175,55,0.22)] transition hover:-translate-y-0.5 hover:bg-[#edc94b] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#071413] sm:w-auto sm:max-w-none sm:text-sm"
        >
          <span className="block min-w-0 max-w-full whitespace-normal break-words">
            <span className="block sm:inline">ඔබේ වෙසක් කාඩ්පත</span>{' '}
            <span className="block sm:inline">නිර්මාණය කරන්න →</span>
          </span>
        </Link>
      </section>
    </main>
  )
}

async function getCardOrNotFound(slug: string) {
  try {
    return await getCardForServer(slug)
  } catch (error) {
    if (isCardNotFoundError(error)) {
      notFound()
    }

    throw error
  }
}

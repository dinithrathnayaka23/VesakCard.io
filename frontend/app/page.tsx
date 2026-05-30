'use client'

import { CardCanvas } from '@/components/card/CardCanvas'
import { DownloadCardButton } from '@/components/card/DownloadCardButton'
import { CustomizerPanel } from '@/components/creator/CustomizerPanel'
import { ShareModal } from '@/components/share/ShareModal'
import { useCardCreator } from '@/hooks/useCardCreator'
import { useWishGenerator } from '@/hooks/useWishGenerator'

export default function HomePage() {
  const {
    card,
    canCreate,
    createError,
    createdCard,
    isCreating,
    previewCard,
    updateCard,
    submitCard,
    closeShareModal
  } = useCardCreator()
  const { tone, setTone, isGenerating, wishError, requestWish } = useWishGenerator()

  async function handleGenerateWish() {
    const wish = await requestWish(card.recipientName)
    if (wish) {
      updateCard('wishText', wish.sinhala)
    }
  }

  return (
    <main className="min-h-screen max-w-full overflow-hidden px-4 py-5 sm:px-6 lg:px-8">
      <section className="mx-auto grid w-full max-w-full gap-6 lg:max-w-7xl lg:grid-cols-[minmax(0,1.04fr)_minmax(360px,0.96fr)] lg:items-start">
        <div className="min-w-0 max-w-full lg:sticky lg:top-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0 max-w-full">
              <p className="text-sm font-semibold text-[#176d5b]">Vesak Cards</p>
              <h1 className="mt-1 max-w-full break-words text-[1.7rem] font-bold leading-tight text-[#251a12] sm:text-3xl">
                <span className="block sm:inline">ඔබේ Vesak Card එක</span>{' '}
                <span className="block sm:inline">සාදන්න</span>
              </h1>
            </div>
          </div>

          <div
            className="mx-auto min-w-0 overflow-hidden lg:max-w-none"
            style={{ width: 'min(100%, calc(100vw - 2rem))' }}
          >
            <CardCanvas {...previewCard} mode="creator" />
          </div>

          <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <DownloadCardButton card={previewCard} className="w-full sm:w-auto" />
            <DownloadCardButton card={previewCard} format="gif" className="w-full sm:w-auto" />
          </div>
        </div>

        <div
          className="min-w-0 max-w-full overflow-hidden rounded-lg border border-[#d8cbb7] bg-[#fffaf1]/82 p-4 shadow-[0_20px_60px_rgba(54,42,27,0.12)] backdrop-blur sm:p-5 lg:p-6"
          style={{ width: 'min(100%, calc(100vw - 2rem))' }}
        >
          <CustomizerPanel
            card={card}
            canCreate={canCreate}
            createError={createError}
            isCreating={isCreating}
            wishTone={tone}
            isGeneratingWish={isGenerating}
            wishError={wishError}
            onChange={updateCard}
            onSubmit={submitCard}
            onWishToneChange={setTone}
            onGenerateWish={handleGenerateWish}
          />
        </div>
      </section>

      {createdCard ? (
        <ShareModal
          card={{
            ...previewCard,
            slug: createdCard.slug
          }}
          shareUrl={createdCard.shareUrl}
          onClose={closeShareModal}
        />
      ) : null}
    </main>
  )
}

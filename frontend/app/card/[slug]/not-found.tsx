import Link from 'next/link'

export default function CardNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#071413] px-4 text-white">
      <section className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-[#D4AF37] sm:text-4xl">Card එක හමු නොවීය</h1>
        <p className="mt-4 text-base leading-8 text-white/72">
          මෙම share link එක වලංගු නැහැ, නැතිනම් Card එක ඉවත් කරලා.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 min-w-0 w-[calc(100vw-2rem)] max-w-full items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#D4AF37] px-5 py-3 text-center text-[0.78rem] font-bold leading-6 text-[#16120a] shadow-[0_14px_34px_rgba(212,175,55,0.22)] transition hover:-translate-y-0.5 hover:bg-[#edc94b] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#071413] sm:w-auto sm:max-w-none sm:text-sm"
        >
          <span className="block min-w-0 max-w-full whitespace-normal break-words">
            අලුත් Card එකක් සාදන්න
          </span>
        </Link>
      </section>
    </main>
  )
}

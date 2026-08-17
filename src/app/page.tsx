import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09090B] text-white">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-cyan-500/10 blur-[140px]" />
      </div>

      {/* Navbar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <h1 className="text-2xl font-bold tracking-wide">
          Supreme <span className="text-blue-500">Labs</span>
        </h1>

        <div className="hidden items-center gap-8 text-gray-300 md:flex">
          <a href="#" className="transition hover:text-white">
            Features
          </a>
          <a href="#" className="transition hover:text-white">
            Tools
          </a>
          <a href="#" className="transition hover:text-white">
            Pricing
          </a>
          <a href="#" className="transition hover:text-white">
            About
          </a>
        </div>

        <Link
  href="/login"
  className="rounded-xl border border-blue-500 px-5 py-2 transition hover:bg-blue-600"
>
  Login
</Link>
</nav>

{/* Hero Section */}

      {/* Hero Section */}
      <section className="mx-auto flex min-h-[75vh] max-w-5xl flex-col items-center justify-center px-6 text-center">

        <span className="rounded-full border border-blue-500/40 bg-blue-500/10 px-5 py-2 text-sm text-blue-400 backdrop-blur">
          🚀 Welcome to Supreme Labs
        </span>

        <h1 className="mt-8 text-5xl font-extrabold leading-tight md:text-7xl">
          The Future of
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Intelligent Work
          </span>
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-400">
          One powerful AI workspace for writing, productivity, documents,
          automation, and intelligent tools — designed to help professionals,
          freelancers, and businesses work smarter every day.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">

          <button className="rounded-xl bg-blue-600 px-8 py-3 font-semibold transition hover:scale-105 hover:bg-blue-700">
            Start Building
          </button>

          <button className="rounded-xl border border-gray-700 px-8 py-3 font-semibold transition hover:border-blue-500 hover:bg-zinc-900">
            Explore Platform
          </button>

        </div>

      </section>

      {/* AI Tools Showcase */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">

        <h2 className="text-4xl font-bold md:text-5xl">
          Powerful AI Tools
          <br />
          <span className="text-blue-500">
            Built for Modern Work
          </span>
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-gray-400">
          Explore intelligent tools designed to help you create, automate,
          analyze, and work faster with AI.
        </p>


        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {/* AI Chat Assistant - Clickable */}
          <Link href="/ai-chat">
            <div className="cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-left transition hover:-translate-y-2 hover:border-blue-500">
              <div className="text-4xl">🤖</div>

              <h3 className="mt-4 text-xl font-semibold">
                AI Chat Assistant
              </h3>

              <p className="mt-3 text-gray-400">
                Ask questions, brainstorm ideas, and get intelligent answers instantly.
              </p>
            </div>
          </Link>


          <Link href="/ai-image">
  <div className="cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-left transition hover:-translate-y-2 hover:border-blue-500">
    <div className="text-4xl">🎨</div>

    <h3 className="mt-4 text-xl font-semibold">
      AI Image Creation
    </h3>

    <p className="mt-3 text-gray-400">
      Create stunning visuals and creative designs powered by AI.
    </p>
  </div>
</Link>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-left transition hover:-translate-y-2 hover:border-blue-500">
            <div className="text-4xl">✍️</div>

            <h3 className="mt-4 text-xl font-semibold">
              AI Writer
            </h3>

            <p className="mt-3 text-gray-400">
              Generate blogs, emails, documents, and professional content faster.
            </p>
          </div>


          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-left transition hover:-translate-y-2 hover:border-blue-500">
            <div className="text-4xl">📄</div>

            <h3 className="mt-4 text-xl font-semibold">
              PDF Intelligence
            </h3>

            <p className="mt-3 text-gray-400">
              Analyze documents and extract useful information with AI.
            </p>
          </div>


          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-left transition hover:-translate-y-2 hover:border-blue-500">
            <div className="text-4xl">💻</div>

            <h3 className="mt-4 text-xl font-semibold">
              AI Code Assistant
            </h3>

            <p className="mt-3 text-gray-400">
              Build, debug, and improve code with intelligent assistance.
            </p>
          </div>


          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-left transition hover:-translate-y-2 hover:border-blue-500">
            <div className="text-4xl">🎙️</div>

            <h3 className="mt-4 text-xl font-semibold">
              Voice AI
            </h3>

            <p className="mt-3 text-gray-400">
              Convert ideas into actions with intelligent voice experiences.
            </p>
          </div>

        </div>

      </section>


      {/* Features */}
      <section className="mx-auto mb-20 grid max-w-6xl gap-6 px-6 md:grid-cols-3">

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition hover:-translate-y-2 hover:border-blue-500">
          <div className="text-3xl">⚡</div>

          <h3 className="mt-4 text-xl font-semibold">
            Fast Productivity
          </h3>

          <p className="mt-3 text-gray-400">
            Generate business content, proposals, emails, reports, and
            professional documents in seconds.
          </p>
        </div>


        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition hover:-translate-y-2 hover:border-blue-500">
          <div className="text-3xl">🤖</div>

          <h3 className="mt-4 text-xl font-semibold">
            Smart AI Tools
          </h3>

          <p className="mt-3 text-gray-400">
            Access intelligent AI tools from one simple and modern workspace
            built for daily productivity.
          </p>
        </div>


        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition hover:-translate-y-2 hover:border-blue-500">
          <div className="text-3xl">🔒</div>

          <h3 className="mt-4 text-xl font-semibold">
            Secure Workspace
          </h3>

          <p className="mt-3 text-gray-400">
            Built with performance, privacy, reliability, and scalability for
            professionals and teams.
          </p>
        </div>

      </section>


      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 text-center text-gray-500">
        © 2026 Supreme Labs. All rights reserved.
      </footer>

    </main>
  );
}
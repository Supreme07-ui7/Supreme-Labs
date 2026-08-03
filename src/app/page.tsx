export default function Home() {
  return (
    <main className="min-h-screen bg-[#09090B] text-white flex items-center justify-center">
      <div className="max-w-4xl px-6 text-center">
        <span className="inline-block rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
          🚀 Welcome to Supreme Labs
        </span>

        <h1 className="mt-8 text-5xl font-extrabold leading-tight md:text-7xl">
          AI Workspace for
          <span className="text-blue-500"> Professionals</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
          Create proposals, emails, resumes, meeting notes and AI-powered
          business content from one modern workspace.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <button className="rounded-xl bg-blue-600 px-8 py-3 font-semibold transition hover:bg-blue-700">
            Get Started
          </button>

          <button className="rounded-xl border border-gray-700 px-8 py-3 font-semibold transition hover:bg-gray-900">
            Learn More
          </button>
        </div>
      </div>
    </main>
  );
}
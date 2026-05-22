import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* 🌐 নেভিগেশন বার */}
      <nav className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center border-b border-slate-900">
        <div className="text-xl font-bold text-white tracking-tight">
          Eco<span className="text-emerald-500">Route</span> AI
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-400 hover:text-white transition duration-200"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition duration-200 shadow-lg shadow-emerald-600/10 active:scale-[0.98]"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* 🚀 হিরো সেকশন (Hero Section) */}
      <header className="max-w-4xl mx-auto text-center px-6 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-1.5 rounded-full font-medium mb-6 animate-pulse">
          🌱 Powered by AI Carbon Estimation
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6 leading-[1.15]">
          Track Your Travel <br />
          <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            Reduce Your Carbon Footprint
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
          EcoRoute AI helps you monitor emissions from your daily commute,
          validate data with smart Mongoose tracking, and suggest greener routes
          for a sustainable future.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/signup"
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-3.5 rounded-xl transition duration-200 shadow-xl shadow-emerald-600/20 active:scale-[0.98] text-center"
          >
            Start Tracking Free
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-850 text-slate-300 font-semibold px-8 py-3.5 rounded-xl border border-slate-800 transition duration-200 text-center"
          >
            Go to Dashboard
          </Link>
        </div>
      </header>

      {/* ✨ ফিচার সেকশন (Features Section) */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* কার্ড ১ */}
          <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl hover:border-emerald-500/30 transition duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-400 font-bold text-xl group-hover:scale-110 transition duration-200">
              🚗
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Smart Logging
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Log your driving, transit, bicycling, or walking distance
              instantly. Custom-tuned factors calculate exact emission rates.
            </p>
          </div>

          {/* কার্ড ২ */}
          <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl hover:border-emerald-500/30 transition duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mb-4 text-teal-400 font-bold text-xl group-hover:scale-110 transition duration-200">
              🔒
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Secure Cloud Sync
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Seamlessly synced with Firebase Authentication and MongoDB Atlas
              database to guard your logs with precise schema validation.
            </p>
          </div>

          {/* কার্ড ৩ */}
          <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl hover:border-emerald-500/30 transition duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 text-cyan-400 font-bold text-xl group-hover:scale-110 transition duration-200">
              📈
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Real-time Analytics
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Analyze historical tracking trends dynamically and check automated
              emission levels directly from your beautiful interface.
            </p>
          </div>
        </div>
      </section>

      {/* 👣 ফুটার (Footer) */}
      <footer className="max-w-7xl mx-auto px-6 py-8 mt-20 border-t border-slate-900 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} EcoRoute AI. Built with MERN & Next.js. All
        rights reserved.
      </footer>
    </div>
  );
}

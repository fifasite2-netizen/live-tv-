import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center text-center px-6 py-24">
      {/* Soft Glow Background Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#E61944]/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto space-y-6">
        {/* Giant Status Code */}
        <h1 className="text-8xl md:text-9xl font-extrabold tracking-widest text-[#E61944] select-none animate-pulse">
          404
        </h1>

        {/* Title and details */}
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Page Missed the Goal!
          </h2>
          <p className="text-xs text-zinc-450 max-w-xs mx-auto leading-relaxed">
            The page you are looking for doesn&apos;t exist, was removed, or is temporarily out of play.
          </p>
        </div>

        {/* Back Home CTA Button */}
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#E61944] px-6 py-3.5 text-xs font-bold text-white hover:bg-red-700 shadow-lg shadow-[#E61944]/15 hover:shadow-[#E61944]/25 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer transition-all duration-300"
          >
            <Home size={15} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

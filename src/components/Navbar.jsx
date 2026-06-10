import { Menu, Trophy } from 'lucide-react';
import Link from 'next/link';
import React from 'react'


const navLinks = [
  { href: "/live", label: "Live Now" },
  { href: "/schedule", label: "Schedule" },
  { href: "/highlights", label: "Highlights" },
]

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50  border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between text-white">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        <Link href={'/'} className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E61944] text-neutral-950 shadow-sm">
            <Trophy size={20} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Ajker Kheala
            <span className="text-zinc-500 font-medium ml-2 text-sm uppercase tracking-wider dark:text-zinc-400">
              LIVE
            </span>
          </span>
        </Link>

        <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors lg:hidden">
          <Menu size={24} />
        </button>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map(nav => (
            <Link
              key={nav.href}
              href={nav.href}
              className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-[#E61944] transition-colors"
            >
              {nav.label}
            </Link>
          ))}
          <button className="rounded-full bg-[#E61944] px-5 py-2 text-sm font-semibold text-white hover:scale-105 transition-transform">
            Sign In
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar

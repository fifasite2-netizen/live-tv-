'use client';

import { useState } from 'react';
import { Menu, X, Trophy } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: "/live", label: "Live Now" },
  { href: "/schedule", label: "Schedule" },
  { href: "/highlights", label: "Highlights" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/70 backdrop-blur-xl px-6 py-4 text-white">
      <div className="max-w-7xl w-full mx-auto">
        <div className="flex items-center justify-between">
          <Link href={'/'} className="flex items-center gap-2.5 group" onClick={() => setIsOpen(false)}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E61944] text-white shadow-lg shadow-[#E61944]/20 group-hover:scale-105 transition-all duration-300">
              <Trophy size={20} strokeWidth={2.5} className="group-hover:rotate-6 transition-transform" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Ajker Khela
              <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-500 ring-1 ring-inset ring-red-500/20">
                LIVE
              </span>
            </span>
          </Link>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900/60 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-all lg:hidden text-white"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(nav => (
              <Link
                key={nav.href}
                href={nav.href}
                className="text-sm font-semibold text-zinc-400 hover:text-[#E61944] transition-colors relative py-1"
              >
                {nav.label}
              </Link>
            ))}
            <button className="rounded-xl bg-[#E61944] px-5 py-2 text-sm font-bold text-white hover:bg-red-700 shadow-md shadow-[#E61944]/15 hover:shadow-[#E61944]/25 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer transition-all">
              Sign In
            </button>
          </nav>
        </div>

        {/* Mobile navigation menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-4 pt-4 border-t border-zinc-800/80 flex flex-col gap-3 overflow-hidden"
            >
              {navLinks.map(nav => (
                <Link
                  key={nav.href}
                  href={nav.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900/60 px-3 py-2.5 rounded-xl border border-transparent hover:border-zinc-800/50 transition-all"
                >
                  {nav.label}
                </Link>
              ))}
              <button className="w-full rounded-xl bg-[#E61944] py-3 text-sm font-bold text-white hover:bg-red-700 transition-all mt-2 shadow-lg shadow-[#E61944]/15 cursor-pointer">
                Sign In
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;

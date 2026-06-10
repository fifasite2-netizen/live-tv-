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
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md px-6 py-4 text-white">
      <div className="max-w-7xl w-full mx-auto">
        <div className="flex items-center justify-between">
          <Link href={'/'} className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
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

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-zinc-800 transition-colors lg:hidden text-white animate-fade-in"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
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

        {/* Mobile navigation menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 pt-4 border-t border-neutral-800 flex flex-col gap-4 overflow-hidden"
            >
              {navLinks.map(nav => (
                <Link
                  key={nav.href}
                  href={nav.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-[#E61944] transition-colors py-2"
                >
                  {nav.label}
                </Link>
              ))}
              <button className="w-full rounded-full bg-[#E61944] py-3 text-sm font-semibold text-white hover:scale-[1.02] transition-transform mt-2">
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

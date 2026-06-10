'use client';

import { useState } from 'react';
import { Menu, X, Trophy } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';


const navLinks = [
  { href: '/live', label: 'Live Now' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/highlights', label: 'Highlights' },
];

const Navbar = () => {

  const pathName = usePathname()
  console.log(pathName);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/70 backdrop-blur-xl px-6 py-4 text-white">
      <div className="max-w-7xl w-full mx-auto">
        <div className="flex items-center justify-between">
          <Link
            href={'/'}
            className="flex items-center gap-2.5 group"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E61944] text-white shadow-lg shadow-[#E61944]/20 group-hover:scale-105 transition-all duration-300">
              <Trophy
                size={20}
                strokeWidth={2.5}
                className="group-hover:rotate-6 transition-transform"
              />
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
            {navLinks.map(nav => {
              const isActive = pathName.startsWith(nav.href);
              return (
                <Link
                  key={nav.href}
                  href={nav.href}
                  className={`text-sm font-semibold transition-colors relative py-1 flex items-center gap-1.5 ${
                    isActive ? 'text-[#E61944]' : 'text-zinc-400 hover:text-[#E61944]'
                  }`}
                >
                  {nav.label}
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E61944]" />
                  )}
                </Link>
              );
            })}

            {/* Button will be here */}
            
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
              {navLinks.map(nav => {
                const isActive = pathName.startsWith(nav.href);
                return (
                  <Link
                    key={nav.href}
                    href={nav.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-semibold px-3 py-2.5 rounded-xl border transition-all flex items-center justify-between ${
                      isActive 
                        ? 'text-white bg-[#E61944]/10 border-[#E61944]/20' 
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60 border-transparent hover:border-zinc-800/50'
                    }`}
                  >
                    <span>{nav.label}</span>
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#E61944]" />
                    )}
                  </Link>
                );
              })}

              {/* Button will be here */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;

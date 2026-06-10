"use client";

import { Calendar, Share2, BarChart3, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

function HighlightsList() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center text-zinc-500">
      <p className="font-semibold text-lg text-zinc-400">Match Highlights</p>
      <p className="text-sm mt-1">Video highlights will appear here soon.</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <div className="lg:col-span-8 space-y-8">


        <div className="px-6 lg:px-0 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                FIFA World Cup 2026: Group Stage
              </h1>
              <p className="mt-1 text-zinc-500 dark:text-zinc-400">
                Live from MetLife Stadium, East Rutherford
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-2 text-sm font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                <Share2 size={16} />
                Share
              </button>
              <button className="flex items-center gap-2 rounded-full bg-[#E61944] px-6 py-2 text-sm font-semibold text-white hover:scale-105 transition-transform">
                Follow Channel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-white dark:bg-zinc-900 p-4 border border-zinc-100 dark:border-zinc-800/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E61944]/10 text-[#E61944]">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Next Match
                </p>
                <p className="text-sm font-bold">ARG vs FRA &bull; 20:00</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white dark:bg-zinc-900 p-4 border border-zinc-100 dark:border-zinc-800/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                <Zap size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Live Score
                </p>
                <p className="text-sm font-bold">ARG 2 - 1 FRA (72&apos;)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white dark:bg-zinc-900 p-4 border border-zinc-100 dark:border-zinc-800/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                <BarChart3 size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Possession
                </p>
                <p className="text-sm font-bold">54% - 46%</p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <HighlightsList />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Tv, ChevronRight, Activity } from 'lucide-react';

const ChannelList = ({ channels, activeChannelId, onChannelSelect }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
          <Tv size={20} className="text-[#E61944]" />
          Live Channels
        </h2>
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          {channels.length} Available
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {channels.map(channel => {
          const isActive = activeChannelId === channel.id;
          return (
            <motion.button
              key={channel.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChannelSelect(channel)}
              className={`group relative flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-300 ${
                isActive
                  ? 'border-[#E61944] bg-[#E61944]/5 shadow-md'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg font-black text-lg transition-colors ${
                  isActive
                    ? 'bg-[#E61944] text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700'
                }`}
              >
                {channel.name.charAt(0)}
              </div>

              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h3
                    className={`font-bold truncate ${isActive ? 'text-[#E61944]' : 'text-zinc-900 dark:text-zinc-100'}`}
                  >
                    {channel.name}
                  </h3>
                  {isActive && (
                    <Activity
                      size={14}
                      className="text-[#E61944] animate-pulse"
                    />
                  )}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                  {channel.description}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    {channel.viewers} watching
                  </span>
                </div>
              </div>

              <ChevronRight
                size={18}
                className={`transition-transform duration-300 ${
                  isActive
                    ? 'translate-x-0 text-[#E61944]'
                    : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                }`}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default ChannelList;

'use client';

import { motion } from 'framer-motion';
import { Tv, ChevronRight, Activity } from 'lucide-react';

const ChannelList = ({ channels, activeChannelId, onChannelSelect }) => {
  return (
    <div className="flex flex-col gap-4">
      {/* List Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-extrabold tracking-tight flex items-center gap-2 text-white">
          <Tv size={20} className="text-[#E61944]" />
          Live Channels
        </h2>
        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
          {channels.length} Online
        </span>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 gap-3">
        {channels.map(channel => {
          const isActive = activeChannelId === channel.id;
          return (
            <motion.button
              key={channel.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChannelSelect(channel)}
              className={`group relative flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'border-red-500 bg-red-950/10 shadow-[0_0_15px_rgba(230,25,68,0.08)]'
                  : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-800/40'
              }`}
            >
              {/* Channel Logo / Placeholder */}
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-extrabold text-lg overflow-hidden transition-all duration-300 ${
                  isActive
                    ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                    : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 border border-transparent'
                }`}
              >
                {channel.logo ? (
                  <img
                    src={channel.logo}
                    alt=""
                    className="h-full w-full object-contain p-1.5 transition-transform group-hover:scale-105"
                    onError={e => {
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      if (parent) {
                        parent.textContent = channel.name.charAt(0);
                      }
                    }}
                  />
                ) : (
                  channel.name.charAt(0)
                )}
              </div>

              {/* Text Info */}
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h3
                    className={`font-bold text-sm truncate ${isActive ? 'text-red-500' : 'text-zinc-100'}`}
                  >
                    {channel.name}
                  </h3>
                  {isActive && (
                    <Activity
                      size={13}
                      className="text-red-500 animate-pulse shrink-0 ml-2"
                    />
                  )}
                </div>
                <p className="text-xs text-zinc-400 truncate mt-0.5">
                  {channel.description}
                </p>
                
                {/* Live indicators */}
                <div className="mt-2.5 flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                  </span>
                  <span className="text-[10px] font-bold text-zinc-450 uppercase tracking-wider">
                    {channel.viewers} watching
                  </span>
                </div>
              </div>

              {/* Action Chevron */}
              <ChevronRight
                size={18}
                className={`transition-all duration-300 shrink-0 ${
                  isActive
                    ? 'translate-x-0 text-red-500 opacity-100'
                    : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-zinc-550'
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

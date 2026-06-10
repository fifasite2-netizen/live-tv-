'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ChannelList from '@/components/ChannelList';
import VideoPlayer from '@/components/VideoPlayer';
import MatchSchedule from '@/components/MatchSchedule';
import HighlightsList from '@/components/HighlightsList';
import StreamHeader from '@/components/StreamHeader';
import MatchStats from '@/components/MatchStats';
import PremiumPromo from '@/components/PremiumPromo';

export default function Home() {
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('channels');

  useEffect(() => {
    fetch('/api/channels')
      .then(res => {
        if (!res.ok) throw new Error('Playlist fetch failed');
        return res.json();
      })
      .then(data => {
        setChannels(data);
        if (data.length > 0) {
          setActiveChannel(data[0]);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch M3U playlist:', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-7xl lg:px-8 py-4 lg:py-8 w-full">
      <div className="grid grid-cols-1 gap-6 lg:gap-8 lg:grid-cols-12">
        {/* Left Main Content Column */}
        <div className="lg:col-span-8 space-y-6 lg:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full scrollbar-none"
          >
            {activeChannel ? (
              <VideoPlayer
                channelName={activeChannel.name}
                videoUrl={activeChannel.videoUrl}
              />
            ) : (
              <div className="aspect-video w-full rounded-2xl bg-zinc-950 flex flex-col items-center justify-center text-zinc-550 font-medium">
                {isLoading ? (
                  <div className="flex flex-col items-center gap-3">
                    <span className="h-8 w-8 animate-spin rounded-full border-4 border-red-650 border-t-transparent" />
                    <span>Loading channels...</span>
                  </div>
                ) : (
                  <span>No channels found</span>
                )}
              </div>
            )}
          </motion.div>

          {/* Stream Info Header */}
          <div className="px-6 lg:px-0">
            <StreamHeader
              title={activeChannel ? activeChannel.name : 'Live Stream'}
              location={
                activeChannel
                  ? `Category: ${activeChannel.group}`
                  : 'Loading...'
              }
            />
          </div>

          <div className="lg:hidden sticky top-[72px] z-30 bg-zinc-950/80 backdrop-blur-md px-6 py-3 border-b border-zinc-800/60 mb-2">
            <div className="flex bg-zinc-900/60 p-1 rounded-xl border border-zinc-800/80">
              {[
                { id: 'channels', label: 'Channels' },
                { id: 'schedule', label: 'Schedule' },
                { id: 'stats', label: 'Stats & Clips' },
              ].map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#E61944] text-white shadow-md shadow-[#E61944]/15'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Area Content Panel */}
          <div className="px-6 lg:px-0">
            {/* Match Stats & Highlights (Always visible on desktop, tabbed on mobile) */}
            <div
              className={`space-y-6 lg:space-y-8 ${activeTab === 'stats' ? 'block' : 'hidden lg:block'}`}
            >
              <MatchStats />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <HighlightsList />
              </motion.div>
            </div>

            {/* Mobile Viewports (Only visible on mobile) */}
            <div className="lg:hidden mt-2">
              {activeTab === 'channels' &&
                (isLoading ? (
                  <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-8 flex flex-col items-center justify-center gap-3 text-zinc-500 min-h-[200px]">
                    <span className="h-6 w-6 animate-spin rounded-full border-3 border-red-600 border-t-transparent" />
                    <span className="text-sm">Fetching playlist...</span>
                  </div>
                ) : (
                  <ChannelList
                    channels={channels}
                    activeChannelId={activeChannel ? activeChannel.id : ''}
                    onChannelSelect={setActiveChannel}
                  />
                ))}

              {activeTab === 'schedule' && <MatchSchedule />}
            </div>
          </div>
        </div>

        {/* Right Sidebar Column (Always visible on Desktop, hidden on Mobile) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:flex lg:col-span-4 flex-col gap-8"
        >
          {isLoading ? (
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-8 flex flex-col items-center justify-center gap-3 text-zinc-500 min-h-[300px]">
              <span className="h-6 w-6 animate-spin rounded-full border-3 border-red-650 border-t-transparent" />
              <span className="text-sm">Fetching playlist...</span>
            </div>
          ) : (
            <ChannelList
              channels={channels}
              activeChannelId={activeChannel ? activeChannel.id : ''}
              onChannelSelect={setActiveChannel}
            />
          )}

          <MatchSchedule />

          <PremiumPromo />
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import ChannelList from '@/components/ChannelList';
import VideoPlayer from '@/components/VideoPlayer';
import MatchSchedule from '@/components/MatchSchedule';
import HighlightsList from '@/components/HighlightsList';
import StreamHeader from '@/components/StreamHeader';
import MatchStats from '@/components/MatchStats';
import PremiumPromo from '@/components/PremiumPromo';
import { useEffect } from 'react';

export default function Home() {
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="mx-auto max-w-7xl lg:px-8 py-8 w-full">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Main Content Column */}
        <div className="lg:col-span-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden lg:rounded-2xl"
          >
            {activeChannel ? (
              <VideoPlayer
                channelName={activeChannel.name}
                videoUrl={activeChannel.videoUrl}
              />
            ) : (
              <div className="aspect-video w-full rounded-2xl bg-zinc-950 flex flex-col items-center justify-center text-zinc-500 font-medium">
                {isLoading ? (
                  <div className="flex flex-col items-center gap-3">
                    <span className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
                    <span>Loading channels...</span>
                  </div>
                ) : (
                  <span>No channels found</span>
                )}
              </div>
            )}
          </motion.div>

          <div className="px-6 lg:px-0 space-y-8">
            <StreamHeader
              title={activeChannel ? activeChannel.name : 'Live Stream'}
              location={activeChannel ? `Category: ${activeChannel.group}` : 'Loading...'}
            />
            <MatchStats />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <HighlightsList />
            </motion.div>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-4 px-6 lg:px-0 space-y-8"
        >
          {isLoading ? (
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-8 flex flex-col items-center justify-center gap-3 text-zinc-500 min-h-[300px]">
              <span className="h-6 w-6 animate-spin rounded-full border-3 border-red-600 border-t-transparent" />
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

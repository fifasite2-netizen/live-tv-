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
import { CHANNELS } from '@/components/lib/data';

export default function Home() {
  const [activeChannel, setActiveChannel] = useState(CHANNELS[0]);

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
            <VideoPlayer
              channelName={activeChannel.name}
              videoUrl={activeChannel.videoUrl}
            />
          </motion.div>

          <div className="px-6 lg:px-0 space-y-8">
            <StreamHeader />
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
          <ChannelList
            channels={CHANNELS}
            activeChannelId={activeChannel.id}
            onChannelSelect={setActiveChannel}
          />

          <MatchSchedule />

          <PremiumPromo />
        </motion.div>
      </div>
    </div>
  );
}

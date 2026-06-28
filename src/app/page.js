// src/app/page.js - Server Component
export const metadata = {
  title: 'Ajker Khela - Live Sports Streaming & Highlights',
  description: 'Watch live sports streams, football match highlights, and upcoming match schedules.',
};

import HomeClient from './HomeClient';

export default function Home() {
  return <HomeClient />;
}

// src/app/page.js - Server Component
export const metadata = {
  title: 'Home - Ajker Khela',
  description: 'Watch live FIFA World Cup streams and highlights.'
};

import HomeClient from './HomeClient';

export default function Home() {
  return <HomeClient />;
}

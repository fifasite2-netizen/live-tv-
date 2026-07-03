# Ajker Khela (আজকের খেলা) ⚽🏆

**Live URL**: [https://ajker-khela.vercel.app](https://ajker-khela.vercel.app)

Ajker Khela is a high-performance, live sports streaming dashboard and match schedule tracker. Built with **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS v4**, it integrates HTTP Live Streaming (HLS) playback with live match schedules pulled dynamically from the ESPN scoreboard API.

---

## ⚡ Key Architecture & Features

### 1. Next.js Catch-All Server-Side Proxy
* **API Proxy Router**: Dynamic catch-all route handler at `src/app/api/[...path]/route.js` proxies requests (like `/api/channels` and `/api/schedule`) to the server endpoint defined by `SERVER_URL` in `.env`.
* **Server-Side API Collection Schema**: Live channels are served dynamically from the backend using this structure:
  ```json
  {
    "_id": "6a35cd8076b95836d36fb597",
    "name": "Being Sports 1",
    "channelsNumber": "CH 4",
    "logo": "https://i.ibb.co.com/wNjJ6trt/1781362521446-removebg-preview.png",
    "groupTitle": "Sports",
    "channelUrl": "https://ua102.online24.pm:8443/1101/video.m3u8?token=350B326FB34F4B8"
  }
  ```
* **Data Mapping Layer**: Client-side API layer at `src/lib/api/channels.js` maps database fields (`_id` → `id`, `channelsNumber` → `channelCount`, `channelUrl` → `videoUrl`, `groupTitle` → `group`) for UI consumption.

### 2. Fully-Custom HLS Media Player
* **HLS Integration**: Leverages `hls.js` with fine-tuned buffering thresholds (`maxMaxBufferLength`, `liveSyncDuration`, `liveMaxLatencyDuration`) for high-fidelity live stream decoding.
* **Responsive UI Overlay**: A complete custom media interface styled with Tailwind CSS v4 and animated using Framer Motion.
* **Advanced Player Features**:
  * Play / Pause, Mute / Unmute, and custom range-based volume slider controls.
  * Manifest-level quality selector (Auto, 1080p, 720p, etc.) dynamically updated from the loaded stream levels.
  * Hardware-accelerated Fullscreen API integration.

### 3. Live Scoreboard Integration
* **Real-time Fixtures**: Connects to the ESPN Live Scoreboard API through the server-side proxy, fetching FIFA World Cup 2026 match schedules (June 11 to July 19, 2026).
* **Data Revalidation**: Utilizes caching and revalidation policies to serve fresh scores.
* **Match State Orchestration**: Decodes pre-game schedules, live score updates (with flashing ping indicators), and post-match (`FT`) scorecards.

### 4. Layout & Design Systems
* **Aesthetics**: Sleek premium dark mode design using deep zinc colors and vibrant crimson (`#E61944`) accents.
* **Layout Integrity**: Built with standard layouts preventing horizontal layout leaks (`overflow-x-hidden`) and featuring a sticky footer setup (`min-h-screen flex flex-col`).
* **Mobile Responsiveness**: Adaptive tab navigation for mobile viewports, allowing users to toggle between live channel feeds, fixtures schedule, and highlights panels.

---

## 🛠️ Technology Stack

* **Framework**: Next.js 16.2.9 (App Router)
* **Frontend**: React 19.2.4
* **Styling**: Tailwind CSS v4 (with `@tailwindcss/postcss`)
* **Motion & Animation**: Framer Motion 12.40.0
* **Icons**: Lucide React 1.17.0
* **Streaming Client**: hls.js 1.6.16

---

## 📂 Codebase Structure

```text
├── public/                  # Static assets & public media files
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── [...path]/   # API Route: Catch-all server-side API proxy handler
│   │   ├── globals.css      # Core tailwind directives and baseline overflow configurations
│   │   ├── layout.js        # Global layout container with navbar and footer wrappers
│   │   ├── not-found.jsx    # Custom 404 page ("Page Missed the Goal!")
│   │   ├── page.js          # Next.js page routing container
│   │   └── HomeClient.jsx   # Core dashboard client layout, responsive grid and mobile tab switcher
│   ├── components/
│   │   ├── ChannelList.jsx  # Interactive vertical channel roster with active states
│   │   ├── Footer.jsx       # Footer block featuring developer credits
│   │   ├── HighlightsList.jsx # Responsive grid showcasing match highlight cards
│   │   ├── MatchSchedule.jsx # Match list grouped by date with horizontal tab-scrolling
│   │   ├── MatchStats.jsx   # Top-bar summary stats for the current matchday
│   │   ├── Navbar.jsx       # Desktop & mobile navigation header
│   │   ├── StreamHeader.jsx # Stream info details, share buttons, and social triggers
│   │   └── VideoPlayer.jsx  # HTML5 video element with custom HLS controls
│   └── lib/
│       └── api/
│           ├── channels.js  # API handler: Fetches & normalizes channels from proxy
│           ├── highlights.js# API handler: Fetches YouTube highlights
│           └── schedule.js  # API handler: Fetches scoreboard matches from proxy
├── .env                     # Environment variables configuration
├── package.json             # Core dependencies and scripts configurations
└── next.config.mjs          # Next.js configurations
```

---

## ⚡ Development & Execution

### Installation
Install project dependencies:
```bash
npm install
```

### Run Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build and Deploy
Prepare a production build:
```bash
npm run build
```

Run the built production bundle:
```bash
npm run start
```

### Linting
Check for code style and syntax warnings:
```bash
npm run lint
```

---

## 🔗 Sources & Resources

* **IPTV Github**: [https://github.com/iptv-org/iptv](https://github.com/iptv-org/iptv)
* **IPTV Website**: [https://iptv-org.github.io/](https://iptv-org.github.io/)
* **Mrgify-BDIX-IPTV GitHub**: [https://github.com/abusaeeidx/Mrgify-BDIX-IPTV](https://github.com/abusaeeidx/Mrgify-BDIX-IPTV)

---

Developed with ⚽ by  


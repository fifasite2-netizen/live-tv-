# Ajker Khela (আজকের খেলা) ⚽🏆

Ajker Khela is a high-performance, live sports streaming dashboard and match schedule tracker. Built with **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS v4**, it integrates HTTP Live Streaming (HLS) playback with live match schedules pulled dynamically from the ESPN scoreboard API.

---

## ⚡ Key Architecture & Features

### 1. Custom M3U Playlist Parser Engine
* **Source Parser**: Dynamically parses the local `playlist.m3u` file at `src/components/lib/m3uParser.js`.
* **Metadata Extraction**: Reads and maps `#EXTINF` metadata attributes including `tvg-id`, `tvg-logo`, and `group-title` (categories).
* **Stable Stat Generation**: Employs a deterministic name-based hashing seed to generate realistic and stable live viewer counts (e.g. `150K`, `2.4M`) for every parsed stream.

### 2. Fully-Custom HLS Media Player
* **HLS Integration**: Leverages `hls.js` with fine-tuned buffering thresholds (`maxMaxBufferLength`, `liveSyncDuration`, `liveMaxLatencyDuration`) for high-fidelity live stream decoding.
* **Responsive UI Overlay**: A complete custom media interface styled with Tailwind CSS v4 and animated using Framer Motion.
* **Advanced Player Features**:
  * Play / Pause, Mute / Unmute, and custom range-based volume slider controls.
  * Manifest-level quality selector (Auto, 1080p, 720p, etc.) dynamically updated from the loaded stream levels.
  * Hardware-accelerated Fullscreen API integration.

### 3. ESPN Scoreboard API Integration
* **Real-time Fixtures**: Connects to the ESPN Live Scoreboard API fetching FIFA World Cup 2026 match schedules (June 11 to July 19, 2026).
* **Data Revalidation**: Utilizes Next.js fetch revalidation policies to cache API responses for 60 seconds.
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
│   │   │   ├── channels/    # API Route: Parses and serves playlist.m3u channels
│   │   │   └── schedule/    # API Route: Fetch & sort World Cup ESPN scoreboard matches
│   │   ├── globals.css      # Core tailwind directives and baseline overflow configurations
│   │   ├── layout.js        # Global layout container with navbar and footer wrappers
│   │   ├── not-found.jsx    # Custom 404 page ("Page Missed the Goal!")
│   │   └── page.js          # Core dashboard layout, responsive grid and mobile tab switcher
│   └── components/
│       ├── lib/
│       │   ├── data.js      # Mock streams and fallback database
│       │   └── m3uParser.js # M3U playlist text parser engine
│       ├── ChannelList.jsx  # Interactive vertical channel roster with active states
│       ├── Footer.jsx       # Footer block featuring developer credits
│       ├── HighlightsList.jsx # Responsive grid showcasing match highlight cards
│       ├── MatchSchedule.jsx # Match list grouped by date with horizontal tab-scrolling
│       ├── MatchStats.jsx   # Top-bar summary stats for the current matchday
│       ├── Navbar.jsx       # Desktop & mobile navigation header
│       ├── PremiumPromo.jsx # Promotional card components
│       ├── StreamHeader.jsx # Stream info details, share buttons, and social triggers
│       └── VideoPlayer.jsx  # HTML5 video element with custom HLS controls
├── playlist.m3u             # Local M3U live stream configuration source
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

## 📻 Stream Configuration
Live channels are controlled using `playlist.m3u` in the project root. To add new streams, append `#EXTINF` details with the stream URI:
```text
#EXTINF:-1 tvg-id="UniqueId" tvg-logo="https://url-to-logo.png" group-title="Sports",Channel Name
https://domain-to-stream.com/stream/index.m3u8
```

---

Developed with ⚽ by [Mahmudul Hasan](https://linkedin.com/in/mahmudulhasanzb).

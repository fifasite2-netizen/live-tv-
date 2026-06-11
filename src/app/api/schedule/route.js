import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch FIFA World Cup 2026 matches (June 11 to July 19, 2026)
    const res = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260611-20260719&limit=100', {
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    if (!res.ok) throw new Error('ESPN World Cup fetch failed');
    
    const data = await res.json();
    
    if (!data || !data.events) {
      return NextResponse.json([]);
    }

    const matches = data.events.map(event => {
      const comp = event?.competitions?.[0];
      const competitors = comp?.competitors || [];
      
      // ESPN usually lists home team as index 0 or index 1, let's find them explicitly
      const homeTeam = competitors.find(c => c.homeAway === 'home') || competitors[0];
      const awayTeam = competitors.find(c => c.homeAway === 'away') || competitors[1];
      
      const teamA = homeTeam?.team?.displayName || 'TBD';
      const teamB = awayTeam?.team?.displayName || 'TBD';
      const teamALogo = homeTeam?.team?.logo || '';
      const teamBLogo = awayTeam?.team?.logo || '';
      
      const scoreA = homeTeam?.score || '0';
      const scoreB = awayTeam?.score || '0';
      
      const state = event?.status?.type?.state || 'pre'; // 'pre' (scheduled), 'in' (live), 'post' (completed)
      const statusText = event?.status?.type?.shortDetail || 'Scheduled';
      
      let timeStr = 'TBD';
      let dateStr = 'TBD';
      
      if (event.date) {
        const dateObj = new Date(event.date);
        
        // Format time in Bangladesh time zone (Asia/Dhaka)
        timeStr = dateObj.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Dhaka',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        
        // Format date in Bangladesh time zone (Asia/Dhaka)
        const monthDay = dateObj.toLocaleDateString('en-US', {
          timeZone: 'Asia/Dhaka',
          month: 'short',
          day: 'numeric'
        });
        const weekday = dateObj.toLocaleDateString('en-US', {
          timeZone: 'Asia/Dhaka',
          weekday: 'long'
        });
        dateStr = `${monthDay}, ${weekday}`;
      }
      
      return {
        id: event.id || Math.random().toString(),
        teamA,
        teamB,
        teamALogo,
        teamBLogo,
        scoreA,
        scoreB,
        state,
        statusText,
        rawDate: event.date,
        time: timeStr,
        date: dateStr,
        group: event.season?.slug === 'group-stage' ? 'Group Stage' : (event.season?.slug || 'FIFA World Cup'),
      };
    });

    // Sort chronologically (earliest first)
    matches.sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));

    return NextResponse.json(matches);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 });
  }
}

export function parseM3U(text) {
  if (!text) return [];

  const lines = text.split(/\r?\n/);
  const channels = [];
  let currentChannel = null;

  const getStableStats = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const viewersNum = Math.abs(hash % 950) + 50; // Between 50K and 1000K
    const viewers = viewersNum >= 1000 
      ? `${(viewersNum / 1000).toFixed(1)}M` 
      : `${viewersNum}K`;
    return { viewers };
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('#EXTINF:')) {
      // Extract tvg-id
      const idMatch = line.match(/tvg-id="([^"]+)"/i);
      // Extract tvg-logo
      const logoMatch = line.match(/tvg-logo="([^"]+)"/i);
      // Extract group-title
      const groupMatch = line.match(/group-title="([^"]+)"/i);
      
      // Find first comma outside quotes to separate metadata from name
      let commaIndex = -1;
      let inQuotes = false;
      for (let j = 0; j < line.length; j++) {
        if (line[j] === '"') {
          inQuotes = !inQuotes;
        } else if (line[j] === ',' && !inQuotes) {
          commaIndex = j;
          break;
        }
      }

      const namePart = commaIndex !== -1 ? line.substring(commaIndex + 1).trim() : 'Unknown Channel';
      
      let name = namePart;
      let channelCount = '';
      
      const lastCommaInName = namePart.lastIndexOf(',');
      if (lastCommaInName !== -1) {
        name = namePart.substring(0, lastCommaInName).trim();
        channelCount = namePart.substring(lastCommaInName + 1).trim();
      }
      
      const tvgId = idMatch ? idMatch[1] : '';
      const cleanNameKey = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const cleanCountKey = channelCount ? `-${channelCount.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : '';
      const uniqueId = tvgId ? `${tvgId}-${cleanNameKey}${cleanCountKey}` : `${cleanNameKey}${cleanCountKey}`;
      const group = groupMatch ? groupMatch[1] : 'General';
      const stats = getStableStats(name);

      currentChannel = {
        id: uniqueId,
        name: name,
        logo: logoMatch ? logoMatch[1] : '',
        group: group,
        description: `Live stream from category ${group || 'General'}.`,
        viewers: stats.viewers,
        videoUrl: '',
        channelCount: channelCount
      };
    } else if (line.startsWith('#')) {
      // Ignore comments or other directives like #EXTVLCOPT
      continue;
    } else if (line.length > 0) {
      if (currentChannel) {
        currentChannel.videoUrl = line;
        channels.push(currentChannel);
        currentChannel = null;
      }
    }
  }

  return channels;
}

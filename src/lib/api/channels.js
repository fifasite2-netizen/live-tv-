const baseUrl = "/api";

export const getChannels = async () => {
  const res = await fetch(`${baseUrl}/channels`);
  if (!res.ok) throw new Error('Failed to fetch channels');
  const data = await res.json();
  return data.map(channel => ({
    ...channel,
    id: channel._id,
    channelCount: channel.channelsNumber,
    videoUrl: channel.channelUrl,
    group: channel.groupTitle
  }));
};

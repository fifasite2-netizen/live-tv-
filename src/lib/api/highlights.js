const baseUrl = "/api";

export const getHighlights = async () => {
  const res = await fetch(`${baseUrl}/highlights`);
  if (!res.ok) throw new Error('Failed to fetch highlights');
  const data = await res.json();
  return data.map(video => ({
    ...video,
    id: video._id
  }));
};

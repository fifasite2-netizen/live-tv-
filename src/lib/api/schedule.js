const baseUrl = "/api";

export const getSchedule = async () => {
  const res = await fetch(`${baseUrl}/schedule`);
  if (!res.ok) throw new Error('Failed to fetch schedule');
  return res.json();
};

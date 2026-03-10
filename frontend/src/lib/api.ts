const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = {
  async getLoadAnalysis(userId: string) {
    const res = await fetch(`${API_URL}/analytics/load/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch load analysis');
    return res.json();
  },

  async syncActivities(userId: string) {
    const res = await fetch(`${API_URL}/activities/sync?userId=${userId}`);
    if (!res.ok) throw new Error('Failed to sync activities');
    return res.json();
  },

  getStravaAuthUrl(userId: string) {
    const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
    const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI || '');
    return `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=read,activity:read_all&state=${userId}`;
  }
};

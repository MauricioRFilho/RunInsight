const API_URL = '/api';

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

  async getActivities(userId: string) {
    const res = await fetch(`${API_URL}/activities/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch activities');
    return res.json();
  },

  async getGamificationData(userId: string) {
    const res = await fetch(`${API_URL}/analytics/gamification/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch gamification data');
    return res.json();
  },

  async getPlans(userId: string) {
    const res = await fetch(`${API_URL}/plans/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch training plans');
    return res.json();
  },

  async getAdherenceScore(userId: string) {
    const res = await fetch(`${API_URL}/plans/adherence/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch adherence score');
    return res.json();
  },

  async createPlan(userId: string, data: any) {
    const res = await fetch(`${API_URL}/plans/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create plan');
    return res.json();
  },

  async getCoachFeedback(userId: string) {
    const res = await fetch(`${API_URL}/coach/feedback/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch coach feedback');
    return res.json();
  },

  async getYearlyStats(userId: string) {
    const res = await fetch(`${API_URL}/analytics/stats/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch yearly stats');
    return res.json();
  },

  async getPersonalRecords(userId: string) {
    const res = await fetch(`${API_URL}/analytics/records/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch personal records');
    return res.json();
  },

  getStravaAuthUrl(userId: string) {
    const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
    const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI || '');
    return `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=read,activity:read_all&state=${userId}`;
  }
};

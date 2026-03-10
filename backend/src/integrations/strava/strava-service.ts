import axios from 'axios';
import prisma from '@/models/prisma';

interface StravaTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export class StravaService {
  private static clientId = process.env.STRAVA_CLIENT_ID;
  private static clientSecret = process.env.STRAVA_CLIENT_SECRET;

  /**
   * Exchanges authorization code for access and refresh tokens.
   */
  static async exchangeToken(code: string, userId: string) {
    const response = await axios.post<StravaTokenResponse>('https://www.strava.com/oauth/token', {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      grant_type: 'authorization_code',
    });

    const { access_token, refresh_token, expires_at } = response.data;

    await prisma.user.update({
      where: { id: userId },
      data: {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: expires_at,
      },
    });

    return response.data;
  }

  /**
   * Refreshes the access token if expired.
   */
  static async refreshAccessToken(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) throw new Error('User or refresh token not found');

    const currentTime = Math.floor(Date.now() / 1000);
    if (user.expiresAt && user.expiresAt > currentTime + 300) {
      return user.accessToken;
    }

    const response = await axios.post<StravaTokenResponse>('https://www.strava.com/oauth/token', {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: user.refreshToken,
      grant_type: 'refresh_token',
    });

    const { access_token, refresh_token, expires_at } = response.data;

    await prisma.user.update({
      where: { id: userId },
      data: {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: expires_at,
      },
    });

    return access_token;
  }

  /**
   * Fetches activities from Strava for a given user.
   */
  static async fetchActivities(userId: string, after?: number) {
    const token = await this.refreshAccessToken(userId);

    const response = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
      headers: { Authorization: `Bearer ${token}` },
      params: { after, per_page: 30 },
    });

    return response.data;
  }
}

import { Request, Response } from 'express';
import { StravaService } from '@/integrations/strava/strava-service';
import { ActivityService } from '@/services/activity-service';
import { GamificationService } from '@/services/gamification-service';

export class StravaController {
  /**
   * GET /auth/strava/callback
   */
  static async callback(req: Request, res: Response) {
    const { code, state } = req.query; // state usually contains the userId or a nonce
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is missing' });
    }

    try {
      // For MVP, we might pass userId via state or session. 
      // Assuming state is the userId for now for simplicity of the flow demonstration.
      const userId = state as string || 'default-user-id'; 
      
      const tokens = await StravaService.exchangeToken(code as string, userId);
      
      res.json({
        message: 'Strava authentication successful',
        tokens: {
          expires_at: tokens.expires_at,
        }
      });
    } catch (error: any) {
      console.error('[StravaController] Error exchanging token:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to authenticate with Strava' });
    }
  }

  /**
   * GET /activities/sync
   */
  static async sync(req: Request, res: Response) {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing' });
    }

    try {
      const stravaActivities = await StravaService.fetchActivities(userId as string);
      const savedCount = await ActivityService.saveStravaActivities(userId as string, stravaActivities);
      
      // Update Gamification
      await GamificationService.checkAndAward(userId as string);

      res.json({
        message: 'Activities synced successfully',
        count: savedCount,
      });
    } catch (error: any) {
      console.error('[StravaController] Error syncing activities:', error.message);
      res.status(500).json({ error: 'Failed to sync activities' });
    }
  }
}

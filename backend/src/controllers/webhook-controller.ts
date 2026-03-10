import { Request, Response } from 'express';
import { StravaService } from '@/integrations/strava/strava-service';
import { ActivityService } from '@/services/activity-service';
import { GamificationService } from '@/services/gamification-service';

export class WebhookController {
  /**
   * GET /api/webhook/strava
   * Subscription Validation
   */
  static async stravaValidation(req: Request, res: Response) {
    const challenge = req.query['hub.challenge'];
    const verifyToken = req.query['hub.verify_token'];
    const mode = req.query['hub.mode'];

    // For production, you'd compare verifyToken with a stored secret
    if (mode === 'subscribe' && challenge) {
      console.log('[WebhookController] Validating webhook challenge...');
      return res.status(200).json({ 'hub.challenge': challenge });
    }

    return res.status(403).json({ error: 'Verification failed' });
  }

  /**
   * POST /api/webhook/strava
   * Event Handling
   */
  static async stravaEvent(req: Request, res: Response) {
    const event = req.body;

    console.log('[WebhookController] Received event:', event);

    // We only care about new activities for now
    if (event.object_type === 'activity' && event.aspect_type === 'create') {
      const { owner_id, object_id } = event;

      try {
        console.log(`[WebhookController] New activity created for owner ${owner_id}. Starting sync...`);
        
        const stravaActivities = await StravaService.fetchActivitiesByStravaId(owner_id.toString());
        await ActivityService.saveStravaActivitiesByStravaId(owner_id.toString(), stravaActivities);
        
        res.status(200).json({ message: 'Event acknowledged' });
      } catch (error: any) {
        console.error('[WebhookController] Error processing event:', error.message);
        res.status(500).json({ error: 'Failed to process webhook event' });
      }
    } else {
      res.status(200).json({ message: 'Event ignored' });
    }
  }
}

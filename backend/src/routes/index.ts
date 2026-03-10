import { Router } from 'express';
import { StravaController } from '@/controllers/strava-controller';
import { AnalyticsController } from '@/controllers/analytics-controller';

const router = Router();

// Strava Routes
router.get('/auth/strava/callback', StravaController.callback);
router.get('/activities/sync', StravaController.sync);

// Analytics Routes
router.get('/analytics/load/:userId', AnalyticsController.getLoadAnalysis);

export default router;

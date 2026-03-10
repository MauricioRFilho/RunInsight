import { Router } from 'express';
import { StravaController } from '@/controllers/strava-controller';
import { AnalyticsController } from '@/controllers/analytics-controller';
import { WebhookController } from '@/controllers/webhook-controller';
import { PlanController } from '@/controllers/plan-controller';
import { CoachController } from '@/controllers/coach-controller';

const router = Router();

// Strava Routes
router.get('/auth/strava/callback', StravaController.callback);
router.get('/activities/sync', StravaController.sync);

// Strava Webhook
router.get('/webhook/strava', WebhookController.stravaValidation);
router.post('/webhook/strava', WebhookController.stravaEvent);

// Analytics Routes
router.get('/analytics/load/:userId', AnalyticsController.getLoadAnalysis);
router.get('/analytics/gamification/:userId', AnalyticsController.getGamificationData);
router.get('/analytics/stats/:userId', AnalyticsController.getYearlyStats);
router.get('/analytics/records/:userId', AnalyticsController.getPersonalRecords);

// Training Plan Routes
router.get('/plans/:userId', PlanController.getPlans);
router.post('/plans/:userId', PlanController.createPlan);
router.get('/plans/adherence/:userId', PlanController.getAdherence);

// AI Coach Routes
router.get('/coach/feedback/:userId', CoachController.getFeedback);

export default router;

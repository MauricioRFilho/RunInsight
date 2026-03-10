import { Request, Response } from 'express';
import { LoadAnalyzer } from '@/analytics/load-analyzer';

export class AnalyticsController {
  /**
   * GET /analytics/load/:userId
   */
  static async getLoadAnalysis(req: Request, res: Response) {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing' });
    }

    try {
      const analysis = await LoadAnalyzer.analyzeWeeklyLoad(userId as string);
      res.json(analysis);
    } catch (error: any) {
      console.error('[AnalyticsController] Error analyzing load:', error.message);
      res.status(500).json({ error: 'Failed to analyze training load' });
    }
  }
}

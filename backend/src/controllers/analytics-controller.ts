import { Request, Response } from 'express';
import { LoadAnalyzer } from '@/analytics/load-analyzer';
import { GamificationService } from '@/services/gamification-service';
import { StatsService } from '@/services/stats-service';
import prisma from '@/models/prisma';

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

  /**
   * GET /analytics/gamification/:userId
   */
  static async getGamificationData(req: Request, res: Response) {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing' });
    }

    try {
      const streak = await GamificationService.calculateStreak(userId as string);
      const achievements = await prisma.achievement.findMany({
        where: { userId },
      });

      res.json({ streak, achievements });
    } catch (error: any) {
      console.error('[AnalyticsController] Error fetching gamification:', error.message);
      res.status(500).json({ error: 'Failed to fetch gamification data' });
    }
  }

  /**
   * GET /analytics/stats/:userId
   */
  static async getYearlyStats(req: Request, res: Response) {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing' });
    }

    try {
      const stats = await StatsService.getYearlyStats(userId as string);
      res.json(stats);
    } catch (error: any) {
      console.error('[AnalyticsController] Error fetching stats:', error.message);
      res.status(500).json({ error: 'Failed to fetch yearly stats' });
    }
  }

  /**
   * GET /analytics/records/:userId
   */
  static async getPersonalRecords(req: Request, res: Response) {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing' });
    }

    try {
      const records = await StatsService.getPersonalRecords(userId as string);
      res.json(records);
    } catch (error: any) {
      console.error('[AnalyticsController] Error fetching records:', error.message);
      res.status(500).json({ error: 'Failed to fetch personal records' });
    }
  }
}

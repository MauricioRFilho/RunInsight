import { Request, Response } from 'express';
import { PlanService } from '@/services/plan-service';

export class PlanController {
  static async getPlans(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const plans = await PlanService.getUpcomingPlans(userId);
      res.json(plans);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createPlan(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const plan = await PlanService.createPlan(userId, req.body);
      res.status(201).json(plan);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAdherence(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const score = await PlanService.calculateAdherenceScore(userId);
      res.json({ score });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

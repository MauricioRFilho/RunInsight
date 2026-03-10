import { Request, Response } from 'express';
import { CoachService } from '@/services/coach-service';

export class CoachController {
  static async getFeedback(req: Request, res: Response) {
    const userId = req.params.userId as string;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing' });
    }

    try {
      const feedback = await CoachService.generateFeedback(userId);
      res.json({ feedback });
    } catch (error: any) {
      console.error('[CoachController] Error generating feedback:', error.message);
      res.status(500).json({ error: 'Failed to generate coach feedback' });
    }
  }
}

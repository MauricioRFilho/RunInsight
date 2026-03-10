import { WebhookController } from '@/controllers/webhook-controller';
import { Request, Response } from 'express';

describe('WebhookController - Strava Validation', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  it('should return challenge when verification is successful', async () => {
    req = {
      query: {
        'hub.mode': 'subscribe',
        'hub.challenge': 'test_challenge',
        'hub.verify_token': 'any_token'
      }
    };

    await WebhookController.stravaValidation(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({ 'hub.challenge': 'test_challenge' });
  });

  it('should return 403 when mode is not subscribe', async () => {
    req = {
      query: {
        'hub.mode': 'other',
        'hub.challenge': 'test_challenge'
      }
    };

    await WebhookController.stravaValidation(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(403);
  });
});

# Production Environment Variables Template

## Backend (.env)
```env
PORT=3001
DATABASE_URL="postgresql://user:password@hostname:5432/runinsight?schema=public"
STRAVA_CLIENT_ID="your_strava_client_id"
STRAVA_CLIENT_SECRET="your_strava_client_secret"
STRAVA_WEBHOOK_VERIFY_TOKEN="your_custom_verify_token"
```

## Frontend (.env.local)
```env
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your_generated_random_secret"
STRAVA_CLIENT_ID="your_strava_client_id"
STRAVA_CLIENT_SECRET="your_strava_client_secret"
NEXT_PUBLIC_API_URL="https://api.your-domain.com"
```

## Strava Webhook Registration Script (Bash)
```bash
curl -X POST https://www.strava.com/api/v3/push_subscriptions \
  -F client_id=YOUR_CLIENT_ID \
  -F client_secret=YOUR_CLIENT_SECRET \
  -F callback_url=https://api.your-domain.com/api/webhook/strava \
  -F verify_token=YOUR_VERIFY_TOKEN
```

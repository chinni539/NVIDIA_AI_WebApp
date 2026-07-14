# Quick Start - Cloudflare Deployment

## TL;DR - Deploy in 5 Steps

### 1. Install Tools
```bash
npm install -g wrangler
npm install
```

### 2. Authenticate
```bash
wrangler login
```

### 3. Create Cloudflare Pages Project
```bash
# First time: create the project
wrangler pages project create nvidia-ai-webapp

# You'll see: https://nvidia-ai-webapp.pages.dev
```

### 4. Set Secrets
After project creation, add your secrets:

```bash
wrangler secret put NVIDIA_API_KEY --env production
# Paste your NVIDIA API key

wrangler secret put NVIDIA_MODEL --env production
# nvidia/ising-calibration-1-35b-a3b

wrangler secret put NVIDIA_API_URL --env production
# https://integrate.api.nvidia.com/v1/chat/completions
```

### 5. Deploy
```bash
npm run deploy
```

✅ **Your app is now live!**  
Access it at: `https://nvidia-ai-webapp.pages.dev`

---

## Test Locally First (Recommended)

```bash
npm run dev
# Visit: http://localhost:8787
```

---

## Important: Update Account ID

Edit `wrangler.toml` and replace:
```toml
account_id = "YOUR_ACCOUNT_ID"  # Get from https://dash.cloudflare.com/
```

To find your Account ID:
1. Go to https://dash.cloudflare.com/
2. Scroll to bottom right → Copy Account ID
3. Paste in `wrangler.toml`

---

## Access Your App

After deployment:
- **Frontend**: `https://nvidia-ai-webapp.pages.dev/`
- **API - Analyze**: `POST https://nvidia-ai-webapp.pages.dev/api/analyze`
- **API - Rejection**: `POST https://nvidia-ai-webapp.pages.dev/api/rejection-analysis`

---

## File Upload for Rejection Analysis

Excel files are:
1. Selected from browser
2. Read **client-side** using JavaScript
3. Converted to JSON
4. Sent to `/api/rejection-analysis`

**No file storage needed!**

---

## Pricing

- **Free Tier**: 100,000 requests/day
- **Pro**: $5/month
- **Overage**: $0.50 per million requests

---

## Troubleshooting

### Project not found
```bash
# List your projects
wrangler pages project list

# Create if missing
wrangler pages project create nvidia-ai-webapp
```

### Secrets not loading
```bash
# Check secrets
wrangler secret list --env production

# Add missing secrets
wrangler secret put NVIDIA_API_KEY --env production
```

### Local dev not working
```bash
npm install
npm run dev
```

### API returns 404
- Ensure functions are in `/functions/api/`
- Check `/public/_routes.json` exists
- Run `wrangler pages deploy public` (not `wrangler deploy`)

---

## Monitoring

View logs and analytics:
1. Go to https://dash.cloudflare.com/
2. Find "Pages" → "nvidia-ai-webapp"
3. Check "Analytics Engine" or view Function logs

---

## Need Help?

- Full guide: See `CLOUDFLARE_DEPLOYMENT.md`
- Cloudflare Docs: https://developers.cloudflare.com/pages/
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/

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

### 3. Set Secrets
```bash
wrangler secret put NVIDIA_API_KEY
# Paste your NVIDIA API key

wrangler secret put NVIDIA_MODEL
# nvidia/ising-calibration-1-35b-a3b

wrangler secret put NVIDIA_API_URL
# https://integrate.api.nvidia.com/v1/chat/completions
```

### 4. Test Locally (Optional)
```bash
npm run dev
# Visit: http://localhost:8787
```

### 5. Deploy
```bash
npm run deploy
```

✅ **Your app is now live!**  
Access it at: `https://<project>.pages.dev`

---

## Important: Update `wrangler.toml`

Edit the file and replace:
```toml
account_id = "YOUR_ACCOUNT_ID"  # Get from https://dash.cloudflare.com/
```

---

## Access Your App

After deployment, you can access:
- **Frontend**: `https://<project>.pages.dev/`
- **API**: `https://<project>.pages.dev/api/analyze`

---

## File Upload for Rejection Analysis

Since Cloudflare is serverless, the Excel file is:
1. Selected from browser
2. Read client-side with JavaScript
3. Converted to JSON
4. Sent to `/api/rejection-analysis`

**No file storage needed!**

---

## Pricing

- **Free Tier**: 100,000 requests/day
- **Pro**: $5/month + overage
- Each function execution counted as 1 request
- First 100,000 requests free per month

---

## Monitoring

View logs and analytics:
1. Go to https://dash.cloudflare.com/
2. Find your Pages project
3. Check "Analytics" or "Logs"

---

## Need Help?

- Full guide: See `CLOUDFLARE_DEPLOYMENT.md`
- Cloudflare Docs: https://developers.cloudflare.com/pages/
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/

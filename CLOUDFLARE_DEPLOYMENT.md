# Cloudflare Deployment Guide

This Flask application has been converted to Cloudflare Pages + Functions for serverless deployment.

## Architecture Changes

**Original Flask App** → **Cloudflare Pages + Functions**

- Frontend: HTML/CSS/JavaScript (static files in `/public`)
- Backend API: JavaScript/Node.js Functions (in `/functions/api/`)
- Hosting: Cloudflare Pages (global edge network)
- APIs: Cloudflare Functions

## Key Components

### 1. `/functions/api/` - Backend Functions
- `analyze.js` - POST endpoint for AI text analysis
- `rejection-analysis.js` - POST endpoint for rejection data analysis

### 2. `/public/` - Static Frontend Files
- `index.html` - Main AI content generator page
- `rejection-analysis.html` - Rejection analysis dashboard
- Client-side API calls using Fetch API

### 3. Configuration Files
- `wrangler.toml` - Cloudflare Workers configuration
- `package.json` - Node.js dependencies

## Prerequisites

1. **Install Node.js** (LTS version)
   - Download from https://nodejs.org/

2. **Install Wrangler CLI**
   ```bash
   npm install -g wrangler
   ```

3. **Cloudflare Account**
   - Sign up at https://dash.cloudflare.com/

4. **Your Domain** (optional, can use .pages.dev domain)

## Setup Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Install Wrangler CLI (if not already installed)
```bash
npm install -g wrangler
```

### Step 3: Authenticate with Cloudflare
```bash
wrangler login
```

This will open a browser window to authenticate with your Cloudflare account.

### Step 4: Find Your Account ID

1. Go to https://dash.cloudflare.com/
2. Scroll to the bottom-right corner
3. Copy your **Account ID**
4. Update `wrangler.toml`:
   ```toml
   account_id = "YOUR_ACCOUNT_ID"
   ```

### Step 5: Create Cloudflare Pages Project
```bash
wrangler pages project create nvidia-ai-webapp
```

This creates your project and returns the URL: `https://nvidia-ai-webapp.pages.dev`

### Step 6: Set Environment Variables (Secrets)

```bash
# Set NVIDIA API Key
wrangler secret put NVIDIA_API_KEY --env production
# Paste your NVIDIA API key when prompted

# Set NVIDIA Model (optional)
wrangler secret put NVIDIA_MODEL --env production
# nvidia/ising-calibration-1-35b-a3b

# Set NVIDIA API URL (optional)
wrangler secret put NVIDIA_API_URL --env production
# https://integrate.api.nvidia.com/v1/chat/completions
```

### Step 7: Test Locally (Recommended)

```bash
npm run dev
```

Visit `http://localhost:8787` to test the application locally.

### Step 8: Deploy to Cloudflare

```bash
npm run deploy
```

Your app will be live at: `https://nvidia-ai-webapp.pages.dev`

---

## File Structure

```
NVIDIA_AI_WebApp/
├── public/                    # Static files (served by Pages)
│   ├── index.html            # Main app
│   ├── rejection-analysis.html
│   ├── style.css
│   └── _routes.json          # Route configuration
├── functions/                # Backend functions
│   └── api/
│       ├── analyze.js        # /api/analyze endpoint
│       └── rejection-analysis.js  # /api/rejection-analysis endpoint
├── wrangler.toml             # Cloudflare Pages config
├── package.json              # Dependencies
├── CLOUDFLARE_DEPLOYMENT.md  # This file
├── QUICKSTART.md             # Quick start guide
└── README.md                 # Project overview
```

## API Endpoints

After deployment, your APIs are available at:

### 1. Text Analysis
**POST** `/api/analyze`

Request:
```json
{
  "prompt": "Your prompt text here"
}
```

Response:
```json
{
  "success": true,
  "content": "AI generated response..."
}
```

### 2. Rejection Analysis
**POST** `/api/rejection-analysis`

Request:
```json
{
  "excelData": [
    {
      "STATE": "CA",
      "County": "Los Angeles",
      "Event Description for EOF": "reason text"
    }
  ]
}
```

Response:
```json
{
  "success": true,
  "topStates": [["CA", 100], ...],
  "topCounties": [["Los Angeles", 50], ...],
  "topReasons": [["reason", 25], ...],
  "aiAnalysis": "AI analysis text..."
}
```

## Differences from Original Flask App

| Feature | Flask | Cloudflare |
|---------|-------|-----------|
| Runtime | Python | Node.js/JavaScript |
| Hosting | Local/Traditional Server | Global Edge Network |
| Framework | Flask | Cloudflare Functions |
| Database | File-based (Excel) | Can use Cloudflare D1/KV |
| Scaling | Manual | Automatic (Serverless) |
| Cost | Infrastructure | Pay-per-request |

## Important Notes

1. **Excel File Handling**: The rejection analysis now expects Excel data as JSON. You need to:
   - Upload the file from the browser
   - It's read client-side using XLSX.js
   - Sent as JSON to the API

2. **NVIDIA API Key**: Store securely as a secret, never in code

3. **Limits**: Cloudflare Functions have execution limits (typical: 10-30 seconds)

4. **Cost**: Free tier includes 100,000 requests/day

## Troubleshooting

### API Not found error
Make sure the function files are in `/functions/api/` and named correctly.

### CORS errors
Add CORS headers to functions if calling from different domains:
```javascript
return new Response(data, {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  }
});
```

### Environment variables not loaded
Ensure secrets are set:
```bash
wrangler secret list
```

## Next Steps

1. Deploy to Cloudflare Pages
2. Test all endpoints
3. Monitor performance in Cloudflare Dashboard
4. Set up custom domain (optional)
5. Configure additional services (KV, D1 database, etc.)

## Support

- Cloudflare Docs: https://developers.cloudflare.com/
- Wrangler Docs: https://developers.cloudflare.com/workers/wrangler/
- NVIDIA API: https://developer.nvidia.com/

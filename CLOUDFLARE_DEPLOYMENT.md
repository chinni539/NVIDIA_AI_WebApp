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

### Step 2: Configure Cloudflare Account

Get your Account ID and API Token:

1. Go to https://dash.cloudflare.com/
2. In the sidebar, click on your profile
3. Go to "API Tokens" or "API Keys"
4. Create a new API token or copy your Account ID

### Step 3: Login to Wrangler
```bash
wrangler login
```

This will open a browser window to authenticate.

### Step 4: Update `wrangler.toml`

Replace placeholders:
```toml
account_id = "YOUR_ACCOUNT_ID"  # From Step 2
```

If using a custom domain:
```toml
[env.production]
routes = [
  { pattern = "yourdomain.com/*", zone_id = "YOUR_ZONE_ID" }
]
```

### Step 5: Set Environment Variables

Create a `.env` file or set them in Cloudflare Workers:

```bash
wrangler secret put NVIDIA_API_KEY
# Paste your NVIDIA API key when prompted

wrangler secret put NVIDIA_API_URL
# https://integrate.api.nvidia.com/v1/chat/completions

wrangler secret put NVIDIA_MODEL
# nvidia/ising-calibration-1-35b-a3b
```

Or edit `wrangler.toml` with env variables:

```toml
[env.production]
vars = { NVIDIA_MODEL = "nvidia/ising-calibration-1-35b-a3b" }

[env.production.secrets]
NVIDIA_API_KEY = "your-key-here"
```

### Step 6: Test Locally

```bash
npm run dev
```

Visit http://localhost:8787 to test.

### Step 7: Deploy to Cloudflare

```bash
npm run deploy
```

Or manually:
```bash
wrangler pages deploy public
```

Your app will be live at: `https://<project-name>.pages.dev`

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

## File Structure

```
NVIDIA_AI_WebApp/
├── public/                    # Static files served by Pages
│   ├── index.html            # Main app
│   ├── rejection-analysis.html
│   └── style.css
├── functions/                # Backend functions
│   └── api/
│       ├── analyze.js        # Text analysis endpoint
│       └── rejection-analysis.js  # Rejection analysis endpoint
├── wrangler.toml             # Cloudflare config
├── package.json              # Node.js config
└── README.md                 # This file
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

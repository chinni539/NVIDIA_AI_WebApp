# NVIDIA AI WebApp - Cloudflare Edition

A modern serverless application built with **Cloudflare Pages + Functions** for analyzing data using NVIDIA AI APIs.

## 🚀 Features

- **AI-Powered Analysis**: Uses NVIDIA's latest AI models for text generation and analysis
- **Rejection Analysis Dashboard**: Analyze Excel data for patterns and insights
- **Serverless Architecture**: Global edge deployment with Cloudflare Pages
- **Zero Infrastructure**: No server management required
- **Pay-Per-Request**: Only pay for what you use ($0.50 per million requests)

## 📋 What Changed from Flask to Cloudflare

This application has been converted from a Flask (Python) app to a **Cloudflare Pages + Functions** (JavaScript) app:

| Aspect | Flask | Cloudflare |
|--------|-------|-----------|
| **Runtime** | Python | Node.js |
| **Hosting** | Traditional server | Global edge network |
| **Backend** | Flask routes | Functions in `/functions/api/` |
| **Frontend** | Jinja templates | Static HTML/CSS/JS in `/public/` |
| **File Structure** | Server-side | Client-side + API |
| **Deployment** | Manual/Docker | Git push or CLI |
| **Scaling** | Manual | Automatic |

## 📁 Project Structure

```
├── public/                        # Static files (served globally)
│   ├── index.html                # Main UI
│   ├── rejection-analysis.html    # Analysis dashboard
│   └── style.css                 # Styling
├── functions/                     # Serverless functions
│   └── api/
│       ├── analyze.js            # /api/analyze endpoint
│       └── rejection-analysis.js  # /api/rejection-analysis endpoint
├── wrangler.toml                 # Cloudflare config
├── package.json                  # Dependencies
├── setup.js                       # Setup helper script
├── CLOUDFLARE_DEPLOYMENT.md      # Full deployment guide
└── QUICKSTART.md                 # Quick start guide
```

## 🎯 Quick Start

### Prerequisites
- Node.js 16+ installed
- Cloudflare account (free)
- NVIDIA API key (from integrate.api.nvidia.com)

### Deploy in 3 Minutes

```bash
# 1. Install dependencies
npm install

# 2. Login to Cloudflare
npx wrangler login

# 3. Set environment variables
npx wrangler secret put NVIDIA_API_KEY
# Paste your NVIDIA API key

# 4. Deploy
npm run deploy
```

**Your app is now live at**: `https://<project-name>.pages.dev`

## 🔧 Configuration

### Environment Variables

Set these secrets in Cloudflare:

```bash
# Required
wrangler secret put NVIDIA_API_KEY

# Optional (defaults provided)
wrangler secret put NVIDIA_API_URL
wrangler secret put NVIDIA_MODEL
```

**Update `wrangler.toml`:**

Replace `YOUR_ACCOUNT_ID` with your Cloudflare Account ID:
1. Go to https://dash.cloudflare.com/
2. Scroll to bottom right to find Account ID
3. Update in `wrangler.toml`

## 🧪 Local Testing

```bash
npm run dev
```

Visit `http://localhost:8787`

## 📚 API Endpoints

### 1. Text Analysis
```
POST /api/analyze
Content-Type: application/json

{
  "prompt": "Your question or prompt"
}

Response:
{
  "success": true,
  "content": "AI-generated response..."
}
```

### 2. Rejection Analysis
```
POST /api/rejection-analysis
Content-Type: application/json

{
  "excelData": [
    {
      "STATE": "CA",
      "County": "Los Angeles",
      "Event Description for EOF": "rejection reason"
    }
  ]
}

Response:
{
  "success": true,
  "topStates": [["CA", 100], ...],
  "topCounties": [["LA", 50], ...],
  "topReasons": [["reason", 25], ...],
  "aiAnalysis": "Detailed analysis..."
}
```

## 💰 Pricing

- **Free Tier**: 100,000 requests/day
- **Pro**: $5/month for unlimited requests
- **Overage**: $0.50 per million additional requests

## 🌍 Global Deployment

Your app automatically deploys to Cloudflare's global network:
- 300+ data centers worldwide
- Auto-scaling
- DDoS protection included
- No cold starts (instant responses)

## 📖 Full Documentation

- **[CLOUDFLARE_DEPLOYMENT.md](CLOUDFLARE_DEPLOYMENT.md)** - Complete deployment guide
- **[QUICKSTART.md](QUICKSTART.md)** - Quick reference
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)

## 🐛 Troubleshooting

### 404 on API endpoints
- Ensure functions are in `/functions/api/` with correct names
- Check `wrangler.toml` configuration

### Environment variables not loading
```bash
wrangler secret list
wrangler secret put NVIDIA_API_KEY
```

### Local dev issues
```bash
npm install
npm run dev
```

## 🚀 Deployment Options

### Option 1: Git (Recommended)
1. Push to GitHub
2. Connect repository to Cloudflare Pages
3. Auto-deploy on every push

### Option 2: CLI
```bash
npm run deploy
```

### Option 3: Dashboard
- Upload directly via [dash.cloudflare.com](https://dash.cloudflare.com/)

## 📊 Monitoring

Track your app's performance:
1. Visit [dash.cloudflare.com](https://dash.cloudflare.com/)
2. Select your Pages project
3. View **Analytics** and **Logs**

## 🔐 Security

- API keys stored as secrets (encrypted)
- HTTPS by default
- Built-in DDoS protection
- Origin shielding available

## 🤝 Support

- [Cloudflare Community](https://community.cloudflare.com/)
- [Discord Support](https://discord.gg/cloudflaredev)
- [GitHub Issues](https://github.com/cloudflare/workers-sdk/issues)

## 📝 License

MIT

---

**Ready to deploy?** Start with [QUICKSTART.md](QUICKSTART.md)

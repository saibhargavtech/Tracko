# 🚀 Vercel Deployment - Quick Start

## One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)

## Manual Deployment Steps

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Meeting Tracker"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js framework ✅

### 3. Add Environment Variables

In Vercel project settings → Environment Variables, add:

| Variable Name | Value |
|--------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ahjmjxpijvsuyaijhrbj.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoam1qeHBpanZzdXlhaWpocmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMDY3ODQsImV4cCI6MjA3OTg4Mjc4NH0.XU6J-MyS4-UMzEIg8Z4Z1XnMFP_tZm7Rrtn_UBevL9g` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoam1qeHBpanZzdXlhaWpocmJqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDMwNjc4NCwiZXhwIjoyMDc5ODgyNzg0fQ.RpeusRgXWs5xmtDBDMPaD4kuQ5DxPp3eHNvXPi52lZI` |

**Important:** 
- Make sure to add these to **Production**, **Preview**, and **Development** environments
- Click **"Save"** after adding each variable

### 4. Deploy!

Click **"Deploy"** and wait ~2 minutes. Your app will be live! 🎉

## Post-Deployment

- ✅ Your app will have a URL like: `https://your-app.vercel.app`
- ✅ Every push to `main` branch auto-deploys
- ✅ Preview deployments for every PR

## Troubleshooting

**Build fails?**
- Check environment variables are set correctly
- Ensure Supabase URL doesn't have trailing slash
- Check Vercel build logs for errors

**Database connection issues?**
- Verify RLS policies allow all operations (as per your schema)
- Check Supabase dashboard for connection status

## Build Status

✅ **Build tested locally** - All checks passed!
- TypeScript compilation: ✅
- Linting: ✅
- Static generation: ✅
- Production build: ✅

---

**Ready to deploy!** 🚀


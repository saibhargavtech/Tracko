# 🚀 Quick Vercel Deployment - 3 Steps

## Step 1: Go to Vercel
Visit: https://vercel.com/new

## Step 2: Import Your GitHub Repository
1. Click **"Import Git Repository"**
2. Select your `persona` repository
3. Click **"Import"**

## Step 3: Add Environment Variables
In the **Environment Variables** section, add these 3 variables:

### Variable 1:
- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://ahjmjxpijvsuyaijhrbj.supabase.co`
- ✅ Check: Production, Preview, Development

### Variable 2:
- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoam1qeHBpanZzdXlhaWpocmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMDY3ODQsImV4cCI6MjA3OTg4Mjc4NH0.XU6J-MyS4-UMzEIg8Z4Z1XnMFP_tZm7Rrtn_UBevL9g`
- ✅ Check: Production, Preview, Development

### Variable 3:
- **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoam1qeHBpanZzdXlhaWpocmJqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDMwNjc4NCwiZXhwIjoyMDc5ODgyNzg0fQ.RpeusRgXWs5xmtDBDMPaD4kuQ5DxPp3eHNvXPi52lZI`
- ✅ Check: Production, Preview, Development

## Step 4: Deploy!
Click **"Deploy"** button and wait ~2 minutes! 🎉

---

## What Happens Next?
- ✅ Vercel auto-detects Next.js
- ✅ Builds your app automatically
- ✅ Deploys to a live URL (like `your-app.vercel.app`)
- ✅ Every push to `main` = auto-deploy!

## After Deployment
1. Visit your live URL
2. Test all three tabs (Meetings, Todos, Learnings)
3. Add some test data to verify database connection

**That's it! Your app will be live! 🚀**


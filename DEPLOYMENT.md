# Deployment Guide

## Quick Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`: `https://ahjmjxpijvsuyaijhrbj.supabase.co`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your anon key
     - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (optional, for API routes)
   - Click "Deploy"

3. **That's it!** Your app will be live in minutes.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. The `.env.local` file is already configured with your Supabase credentials.

3. Run the dev server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Architecture

The app uses:
- **Next.js 14** with App Router
- **Supabase Client** directly from the frontend (since RLS allows all operations)
- **TypeScript** for type safety
- **React** for UI components

All CRUD operations are handled directly through the Supabase client, making the app simple and fast.


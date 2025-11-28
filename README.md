# Meeting Tracker App

A simple and beautiful app for tracking meetings, todos, and learnings built with Next.js, React, and Supabase.

## Features

- 📅 **Meetings**: Track meeting details, attendees, notes, and duration
- ✅ **Todos**: Manage tasks with priorities, categories, and due dates
- 📚 **Learnings**: Track articles, books, videos, courses, and other learning resources

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account with database set up

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Update with your Supabase credentials

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (if needed)
4. Deploy!

## Database Schema

The app uses the following tables:
- `meetings` - Meeting records
- `todos` - Todo items
- `learnings` - Learning resources

See the SQL schema in the database setup for details.

## License

MIT


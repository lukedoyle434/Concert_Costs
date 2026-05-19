# Concert Cost Tracker

Track concert spending, fun ratings, and value per dollar — built with Next.js, Tailwind CSS, daisyUI, Supabase, and Recharts.

## Local setup

1. Copy `.env.local.example` to `.env.local` and add your Supabase URL and anon/publishable key.
2. Run `npm install`
3. Run `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

After changing `.env.local`, stop the dev server (Ctrl+C) and run `npm run dev` again.

## Deploy on Vercel

1. Import the GitHub repo and use **Framework Preset: Next.js** (not “Other”).
2. Leave **Output Directory** empty (do not type `public`).
3. Add environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy.

If you still see “No Output Directory named public”, open **Project Settings → Build & Development Settings**, clear the Output Directory field, save, and redeploy.

# GreenPass (Hackathon MVP)

AI-powered sustainability rewards demo for the Sustainability Award concept.

This project is intentionally built as a **frontend-first, hardcoded MVP** for hackathon speed.

## What This MVP Covers

- Login / signup flow
- User identification fields (role, suburb, team)
- Snap-to-Verify activity logging (AI supervisor flow)
- Points + badge progression
- Portfolio + leaderboard demo views

## Important Scope Decision

We are **not** building a real backend for this stage.

- Data is stored in `localStorage`
- Demo users / activities are seeded in frontend state
- Verification flow is optimized for demo reliability
- API calls are best-effort only and not required for core UX

This keeps the build fast, predictable, and pitch-ready.

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Motion + Lucide icons
- Gemini verification helper (demo mode supported)

## Run Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Demo Notes

- Default seeded account:
	- Email: `student@example.com`
	- Password: `demo1234`
- New accounts are created locally and persisted in browser storage.
- To reset demo data quickly, clear browser `localStorage` for the app origin.

## AI Verification Mode

The app supports a stable demo mode for hackathon presentations.

Suggested `.env` values:

```env
VITE_AI_DEMO_MODE=true
VITE_AI_FALLBACK_TO_DEMO=true
```

If you want live vision verification later, set `VITE_AI_DEMO_MODE=false` and provide `VITE_GEMINI_API_KEY`.

## Project Goal

GreenPass turns sustainability actions into a loop:

`Learn -> Act -> Verify -> Earn -> Redeem -> Repeat`

This repo currently prioritizes the **Citizen App demo** and core award gamification experience.
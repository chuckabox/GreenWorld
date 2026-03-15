# GreenWorld (Library Hackathon 2026)

GreenWorld is a community hub designed to help people turn sustainability intentions into real action.

Our platform connects people, guides them toward meaningful environmental activities, and rewards their impact through a sustainability points system called **GreenPass**.

Built as a **frontend-first MVP in 48 hours for the Library Hackathon 2026**. Learn more about the event [here](https://web.library.uq.edu.au/stories/team-hackaithon-13-15-march-2026).

🏆 **Achievements**
- **Top 5 Team** at the Library Hackathon 2026
- **Judges’ Choice Award**

## Problem

Many people care about sustainability, but they struggle with three things:

- Knowing **where to start**
- Finding **opportunities to help**
- Seeing whether their actions **actually make an impact**

There is a clear gap between **caring about the environment** and **taking real action**.

GreenWorld aims to close that gap.

## Solution

GreenWorld motivates environmental action through three core ideas:

- **Community**
- **Guidance**
- **Rewards**

Users learn what to do, take action, verify their impact, and earn recognition.

## Core Features

### Community Hub

GreenWorld connects people who want to make a difference.

Users can:

- Create or join discussion boards
- Add friends
- Collaborate on environmental projects
- Build relationships with people who share sustainability goals

The goal is to create a global community working together for environmental change.

### GreenPass Sustainability Points

GreenPass is a sustainability reward system.

Users earn points by:

- Volunteering
- Participating in environmental events
- Using sustainable products
- Completing eco-friendly activities

Users can also earn:

- **Digital badges**
- **Sustainability certificates**

These achievements can contribute to a user's professional identity, such as showcasing sustainability engagement on platforms like LinkedIn.

### AI Sustainability Advisor

Many people want to help but do not know what actions to take.

GreenWorld includes a **personalised AI advisor**.

After completing a short quiz and granting permission to use that information, the AI suggests:

- Relevant sustainability activities
- Volunteer opportunities
- Personalised tasks to earn GreenPass points

Users can log activities directly in the platform.

### Rewards, Learning, and Competition

GreenPass points are designed to create real value.

Users can redeem points for:

- Discounts at partner businesses
- Free products
- Merchandise

The platform also includes:

**Green Hub**
- Bite-sized sustainability learning resources
- Helps users understand their environmental impact

**Leaderboard**
- Tracks volunteer hours
- Shows the most active community members
- Encourages friendly competition

## Impact

GreenWorld creates value at multiple levels.

**For individuals**

- Rewards motivate people to take environmental action
- Examples include vouchers for coffee, groceries, or restaurants

**For businesses**

- Businesses attract customers by supporting sustainability initiatives
- Partnerships increase visibility and community engagement

**For communities**

- People connect with others who care about sustainability
- Collective action leads to real environmental change

## Hackathon MVP Scope

This repository focuses on the **a live demo**.

To keep the build fast and reliable for the hackathon:

- No backend is used
- Data is stored in `localStorage`
- Demo users and activities are seeded in the frontend
- Verification flows are designed for presentation reliability

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Motion
- Lucide Icons

## Run Locally

```bash
npm install
npm run dev
```

Open:

```
http://localhost:3000
```

## Demo Account

Email:
```
student@example.com
```

Password:
```
demo1234
```

New accounts are stored locally in browser storage.

To reset demo data, clear `localStorage`.

## AI Verification Mode

For stable hackathon demos, enable AI demo mode.

Example `.env`:

```
VITE_AI_DEMO_MODE=true
VITE_AI_FALLBACK_TO_DEMO=true
```

For live AI verification, disable demo mode and provide a Gemini API key.

```
VITE_AI_DEMO_MODE=false
VITE_GEMINI_API_KEY=your_key_here
```

## Project Goal

GreenWorld creates a loop that turns learning into action:

```
Learn → Act → Verify → Earn → Redeem → Repeat
```

The long-term vision is a global sustainability community where people, businesses, and organisations work together to create measurable environmental impact.

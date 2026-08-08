# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 19 + Vite 8 client (`Client/`), Express 5 + Mongoose server (`Server/`). Tailwind CSS v4 (CSS-first) + Google Fonts (Plus Jakarta Sans, Space Grotesk, JetBrains Mono). GSAP, Phosphor icons. Theme via `ThemeContext`.

## Users

Engineering students and early-career developers preparing for campus placement / competitive programming interviews. Primary user is the logged-in developer viewing their own profile.

## Product Purpose

LeetCore turns interview preparation into a structured practice system: a DSA roadmap, an online judge with C++/Java/Python, submission analytics, a daily activity/streak ledger, and a developer profile that turns that practice into a readable performance record.

## Positioning

Instead of generic "activity-on-a-dashboard", the profile reads like a competitive-programmer identity card: who you are, how much you solved (by difficulty), how active and consistent you are, how you perform per topic/contest, and how ready you are for placement.

## Operating Context

Developer profiles are reachable at `/dashboard/profile`. Data is assembled client-side in `Client/src/features/profile/profileData.js` from: the `/api/v1/activity/summary` endpoint (solved/streak/readiness/contest rank, last 7 days), localStorage (`leetcore_solved_questions`, `leetcore_local_activity`, `leetcore_submission_history`), and bundled DSA data (`DSA/data/questions.json`, `DSA/data/topics.json`). The page refreshes on a `leetcore_activity_updated` window event. 75 questions across 17 topics are tracked; difficulty counts derive from solved ids, not the server.

## Capabilities and Constraints

- Real user identity: name, username, avatar, bio, email, GitHub profileUrl, joined date from AuthContext `user`.
- Real solves: per-topic solved/total (17 topics), per-difficulty solved/total, total submissions, acceptance (avg of solved questions' acceptanceRate), current + longest streak, 52-week activity heatmap, last 12 activity days.
- Real per-problem submission history in `leetcore_submission_history` (accepted/attempted, verdicts, firstAcceptedAt) — enables problem-level recent activity.
- Placement readiness: weighted composite score + per-category scores + 6-month history, all computed from real inputs.
- NOT available: real contest-rating history/graph (only a rank percentile exists), fixed CS-subject scores (Database, OS, Networks, OOP, System Design, LLD) have no per-topic stored score. These must be shown as honest unavailable/empty states — never fabricated.
- Contest "rating" was previously a synthetic readiness alias; must not be presented as a real rating.

## Brand Commitments

- LeetCore, orange brand accent `#F2A640` reserved for brand/active/progress/emphasis.
- Difficulty is semantic: Easy green/teal, Medium yellow/gold, Hard red/coral. Muted/professional, not neon.
- Component surfaces subtle: `rgba(255,255,255,0.08)` bg + border on the existing dark page background. No neon, no gradients, no glassmorphism, no invented achievements/counters.
- Token model `--pf-*` in `Client/src/index.css` must define the visible language of this surface (dark-only, theme-invariant), independent of the `--dash-*` and `--lc-*` systems.

## Evidence on Hand

- `Client/src/features/profile/profileData.js` — data assembly for the whole profile.
- `Client/src/features/profile/Profile.jsx` + `components/` — incumbent implementation (to be replaced visually, data contract preserved).
- `Client/src/index.css:865-965` — existing `--pf-*` tokens (to be re-authored).
- `Client/src/features/DSA/data/questions.json`, `topics.json` — real question/topic universe.
- `Client/src/features/DSA/Components/DSAQuestionPage.jsx` — writes `leetcore_submission_history`.
- `Server/src/controllers/activity.controller.js` — `/api/v1/activity/summary` shape.

## Product Principles

1. Data-driven, never fabricated: every metric traces to a real storage source or an explicitly-marked unavailable state.
2. Information density and hierarchy over decoration; no big hero, no oversized dashboard cards, no sparklines-for-content.
3. Semantic color communicates difficulty and status; brand orange stays an accent, not a blanket wash.
4. The profile reads like a competitive-programmer identity, not a generic SaaS user card.
5. Precise, subtle interactions (150–250ms, no bounce/glow); accessible states that never rely on color alone.

## Accessibility & Inclusion

Web and/or keyboard navigation. Status must never be communicated by color alone (icons + text alongside color). Heatmap readable with hover tooltip and accessible labels; controlled horizontal scrolling allowed rather than shrinking cells to unreadable size.
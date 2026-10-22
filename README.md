<div align="center">

# 🎯 PrepX

**AI-powered placement preparation for engineering students.**

One platform for aptitude practice, proctored exams, a coding arena, resume ATS scoring, and mock interviews, with a readiness dashboard that ties it all together.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)
![Status](https://img.shields.io/badge/status-prototype-orange)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Pages](#pages)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Database Schema](#database-schema)
- [Security Notes](#security-notes)
- [Current Limitations](#current-limitations)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Campus placements test more than one skill: aptitude, coding, a resume that gets past ATS filters, and interview communication. PrepX brings these into a single, dark-themed web app where students can practice each module, take timed and proctored assessments, and track their overall **Placement Readiness Score**.

It is a front-end-first project (plain HTML, CSS, and JavaScript) that uses **Supabase** for authentication and data, with a recruiter view for candidate pipelines.

## Features

### 🔐 Authentication
- Email and password sign-up and login via Supabase Auth
- Google OAuth sign-in
- Email OTP verification during sign-up (via EmailJS)
- Protected pages that redirect to login when no session exists
- Profile editing, password change, and "sign out of all devices"

### ⚡ Aptitude Module
- Seven engineering domains: CS & Software, Data Science & AI, Electrical & Electronics, Mechanical & Automation, Civil & Structural, Physics & Aerospace, Biotechnology & Life Sciences
- Three difficulty levels (Easy, Medium, Hard)
- **Flashcard mode:** 50 flip cards per session with answers and explanations
- **Practice arena:** 50 questions with instant solution feedback

### 🔒 Proctored Exams
- 30-minute, 50-question aptitude test with an auto-submit timer
- Anti-cheat rules: full-screen enforcement, tab-switch and ESC detection, a 3-strike limit with automatic submission
- Exam Hub listing the Aptitude Test, Code Arena, AI Interview, and Group Discussion modules

### ⌨️ Coding Arena
- Domain tracks: Frontend, DSA & Algorithms, Backend & Databases, Data Science & AI
- 25-minute timed assessment with a limit of 3 question switches and 2 wrong attempts
- Previously seen questions are tracked so they are not repeated

### 📄 Resume ATS Checker
- Upload a PDF or DOCX (up to 5 MB), parsed **entirely in the browser** (pdf.js and mammoth.js)
- Add a job description to get an ATS score, section audit, and matched, missing, and suggested keywords

### 🎤 Mock Interview
- Interview session UI with a transcript, a recording timer, and STAR-method feedback grades (Situation, Task, Action, Result)

### 📊 Dashboard and Recruiter Portal
- Readiness score, streak, ATS score, coding rank, module progress, weekly focus tasks, and upcoming events
- Recruiter pipeline view with filters (score range, domain, availability, campus) and CSV export / interview invite actions

### 🤖 Extras
- **Echo Assistant:** an embedded chatbot widget on the dashboard
- Light and dark theme toggle, saved in `localStorage`
- Animated splash screen with logo transition

## Pages

| Page | File | Purpose |
| --- | --- | --- |
| Landing | `index.html` | Animated splash and marketing page |
| Login / Sign-up | `login.html` | Auth with OTP and Google sign-in |
| Mode Select | `mode-select.html` | Choose between practice and exam mode |
| Dashboard | `dashboard.html` | Readiness overview and weekly plan |
| Aptitude | `aptitude.html` | Flashcards and practice arena |
| Exam Hub | `exam-hub.html` | Entry point for proctored modules |
| Proctored Test | `proctored-test.html` | Timed aptitude exam with anti-cheat |
| Coding Arena | `coding.html` | Timed coding assessment |
| Resume ATS | `resume.html` | Resume parsing and scoring |
| Mock Interview | `interview.html` | AI interview session UI |
| Recruiter Portal | `recruiter.html` | Candidate pipeline view |
| Profile / Settings | `profile.html`, `settings.html` | Account management |

## Tech Stack

| Area | Technology |
| --- | --- |
| Front end | HTML5, CSS3, Vanilla JavaScript |
| Backend as a service | [Supabase](https://supabase.com) (Auth and Postgres) |
| Email OTP | [EmailJS](https://www.emailjs.com) |
| Resume parsing | [pdf.js](https://mozilla.github.io/pdf.js/), [mammoth.js](https://github.com/mwilliamson/mammoth.js) |
| Fonts | Space Grotesk, Inter (Google Fonts) |
| Chatbot | Echo Assistant (embedded via iframe) |

All libraries are loaded from CDNs, so there is no build step.

## Project Structure

```
PrepX/
├── index.html             # Landing page with splash animation
├── login.html             # Sign-up / login
├── mode-select.html       # Practice vs. exam mode
├── dashboard.html         # Main dashboard
├── aptitude.html          # Flashcards and practice
├── exam-hub.html          # Proctored module launcher
├── proctored-test.html    # Proctored aptitude exam
├── coding.html            # Coding assessment
├── resume.html            # ATS resume checker
├── interview.html         # Mock interview
├── recruiter.html         # Recruiter dashboard
├── profile.html           # User profile
├── settings.html          # Account settings
├── script.js              # Shared logic (theme, question generation, proctoring)
├── supabase-client.js     # Supabase connection and helper functions
├── chatbot-widget.js      # Echo chatbot widget behavior
├── chatbot-widget.css
├── styles.css             # Main styles
├── auth-styles.css        # Login page styles
└── logo.png
```

## Getting Started

### Prerequisites

- A modern web browser
- A free [Supabase](https://supabase.com) project
- (Optional) An [EmailJS](https://www.emailjs.com) account for sign-up OTP emails

### Installation

```bash
# Clone the repository
git clone https://github.com/dg-dew/PrepX.git
cd PrepX
```

### Configuration

1. **Supabase:** open `supabase-client.js` and replace the URL and anon key with your own from **Project Settings → API**.

   ```js
   const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
   const SUPABASE_ANON_KEY = "YOUR-ANON-KEY";
   ```

2. **Auth providers:** in the Supabase dashboard, enable **Email** and (optionally) **Google** under *Authentication → Providers*, and add your site URL to the redirect list.
3. **EmailJS:** in `login.html`, set your EmailJS public key, service ID, and template ID.
4. **Database:** create the tables listed in [Database Schema](#database-schema).

### Running Locally

Serve the folder over HTTP (some features, such as OAuth redirects, don't work from `file://`):

```bash
# Python 3
python -m http.server 8000

# or Node.js
npx serve .
```

Then open `http://localhost:8000/index.html`.

## Database Schema

`supabase-client.js` includes helper functions that expect these tables. Each references the authenticated user via `user_id`.

| Table | Columns |
| --- | --- |
| `profiles` | `id` (user id), `full_name`, … |
| `aptitude_results` | `user_id`, `score_percentage`, `correct_count`, `total_questions`, `time_taken`, `warnings_count`, `status` |
| `coding_submissions` | `user_id`, `problem_id`, `problem_title`, `language`, `code`, `verdict`, `runtime_ms` |
| `resume_scans` | `user_id`, `file_name`, `ats_score`, `matched_keywords`, `missing_keywords`, `feedback` |
| `interview_sessions` | `user_id`, `role_target`, `question`, `answer_transcript`, `confidence_score`, `clarity_score`, `overall_grade`, `feedback` |

Enable **Row Level Security** on every table so users can only read and write their own rows.

## Security Notes

- The Supabase **anon key** is designed to be public, but it only stays safe if Row Level Security is enabled on all tables. Never commit a `service_role` key.
- The sign-up OTP is generated and checked in the browser, so it is a convenience check rather than a secure verification. For production, use Supabase's built-in email confirmation or OTP.
- Move credentials into environment variables if you adopt a build tool (Vite, Next.js, etc.).

## Current Limitations

PrepX is an early-stage prototype:

- **Dashboard, Mock Interview, and Recruiter pages show static demo data** and are not yet connected to the database.
- The `save*` helper functions in `supabase-client.js` are not wired into the test flows yet, so results are not stored.
- Aptitude questions are generated client-side from templates, with a CS-focused question bank.
- The Mock Interview page is a UI mockup without live speech analysis.
- The project uses two names ("PrepX" and "CareerPrepX") across pages.
- `.vscode/launch.json` contains a local XAMPP path that should be removed or updated.

## Roadmap

- [ ] Wire module results into Supabase and drive the dashboard from real data
- [ ] Real speech-to-text and AI feedback for mock interviews
- [ ] Server-side OTP and verification
- [ ] Expand question banks beyond CS domains
- [ ] Code execution sandbox for the Coding Arena
- [ ] Recruiter accounts with role-based access
- [ ] Unify branding and shared page layout
- [ ] Deploy to Vercel, Netlify, or GitHub Pages

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a Pull Request.

## License

No license has been specified yet. Add a `LICENSE` file (for example, [MIT](https://choosealicense.com/licenses/mit/)) to define how others may use this project.

---

<div align="center">

Built to help students land their dream placements. 🚀

</div>

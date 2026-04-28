# Paul's Portfolio — Data Science Showcase — Learning Log

> A public-facing portfolio designed to go beyond a traditional CV.  
> Built for recruiters, hiring managers, and the data science community.  
> *Data Scientist Junior - Finance · ML · Data Engineering*

---

## 🎯 Project Purpose

This site is the public extension of my CV. It is not a standard portfolio.  
It is a **living knowledge base**, a **project showcase**, and a **signal of technical ambition**, all in one.

Target audience:
- Recruiters in the tech/data field
- Hiring managers evaluating junior Data Science candidates
- Anyone who wants to understand what technologies I use, how i think, or what I am building

Core message to convey:
- I come from a business school background and have an **auto-didact technical depth**
- I'm a **self-driven learner** who documents and shares what i am learning
- I'm building my technical depth in public. Every keyword I learn ends up in this site's Knowledge Library.

---

## 🚀 Quickstart (run locally)

Prerequisites: **Node.js** (LTS recommended) and **npm**.

```bash
npm install
npm run dev
```

Build + preview (production-like):

```bash
npm run build
npm run preview
```

---

## 🗂️ Site Sections

### 1. Hero / Landing
- Full-screen immersive intro
- Name, title ("Data Scientist — Junior, ambitious, always learning")
- Animated background: word cloud or network graph of all known keywords (decorative/live)
- Subtle scroll indicator

### 2. KPI Strip
A horizontal band of animated counters, e.g.:
- Number of Data Science projects completed
- Total DataCamp XP
- Number of certifications
- Months of professional experience

### 3. Projects — Card Gallery
Large, clickable cards. Each card contains:
- Project title
- Short description (1–2 lines)
- Tags: stack used, methodology, application domain
- On click: modal or dedicated page with full project detail
- Optional: GitHub link, demo link, thumbnail/visual

Projects are driven by `src/data/projects.json` (easy to update and versioned in Git).

### 4. Certifications — Card Grid
One card per certification. Each card:
- Certification name
- Issuing platform (DataCamp, Coursera, etc.)
- Date obtained
- Badge image if available
- Link to credential

### 5. DataCamp Stats
- XP total
- Courses completed count
- Skill assessments passed
- Career tracks completed
- Visual: progress bars or radar chart per domain (ML, Python, SQL, etc.)

### 6. 🔑 Knowledge Library (KEY FEATURE)
**The living feed of everything Paul learns.**

**Concept:**
- A searchable, filterable database of data-related keywords Paul has personally learned
- Each keyword has: name, category (library / framework / methodology / tool / language / concept), date added, and Paul's own plain-language explanation + analogy
- The most recently added keywords appear at the top — this is the "learning feed"
- Behind or around the feed: an animated **word cloud or network graph** renders all keywords as a visual backdrop

**Search bar:**
- Placeholder: *"Recherchez si Paul en a connaissance…"*  
- Filters by keyword, fuzzy search, optional category filter chips

**Example keyword entry:**
```
Tailscale
Category: Tool / Networking
Added: 2026-04-15
Paul's note: "Un VPN mesh peer-to-peer. Au lieu d'un serveur central, chaque machine se connecte directement aux autres. C'est comme si on donnais une adresse privée à chaque appareil dans le monde."
```

**Admin-only:** Paul can add/edit/delete keywords via a password-protected admin dashboard (same site, `/admin` route).

### 7. Footer
- Links: GitHub, LinkedIn, DataCamp profile
- Email contact
- "Last updated" timestamp
- Optional: light dark mode toggle

---

## ⚙️ Technical Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | **React + Vite** | Fast, lightweight, no SSR overhead needed |
| Styling | **Tailwind CSS** | Utility-first, rapid UI iteration |
| Animations | **Framer Motion** | Production-grade React animations |
| Word Cloud | **d3-cloud** (+ SVG) | Decorative keyword background generated from the library |
| Routing | **React Router v6** | SPA routing (main site + /admin) |
| Data storage | **JSON files** (local, versioned in Git) | Simple, no backend needed for MVP |
| Admin auth | **Simple password hash in env var** | Lightweight, sufficient for personal site |
| Hosting | **Vercel** | Free tier, automatic deploys from GitHub, perfect for Vite/React |
| Domain | **To be purchased** (e.g. paulxxx.com via Namecheap or Porkbun) | ~10€/year |

> **No database for MVP.** Everything under `src/data/` is bundled at build time for the **public site**.  
> The `/admin` route is meant for personal use and stores edits in the browser (`localStorage`). To publish changes, update the JSON files in Git and redeploy.

---

## 📁 Project Structure

```
portfolio/
├── public/
│   └── assets/          # Images, logos, podcast files
├── src/
│   ├── components/
│   │   ├── layout/      # Navbar, Footer, Layout wrapper
│   │   ├── sections/    # Hero, KPIs, Projects, Certs, DataCamp, Library
│   │   ├── cards/       # ProjectCard, CertCard, KeywordCard
│   │   ├── admin/       # AdminLogin, AdminDashboard, onglets (projets, certs, DataCamp…), AdminJsonTab
│   │   └── ui/          # Button, Modal, SearchBar, Tag, Badge
│   ├── data/
│   │   ├── projects.json
│   │   ├── certifications.json
│   │   ├── datacamp.json
│   │   └── keywords.json        # The knowledge library
│   ├── hooks/           # useSiteData: useRepoSlice / useAdminSlice (+ wrappers par fichier)
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── Admin.jsx
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── .env                 # VITE_ADMIN_PASSWORD (never commit)
├── .env.example
├── README.md
└── vite.config.js
```

---

## 🎨 Design Direction

**Aesthetic**: Dark, editorial, data-native. Think terminal meets magazine.

**Palette:**
- Background: near-black (`#0a0a0f`)
- Surface: dark navy (`#0f1117`)
- Accent 1: electric cyan (`#00f5d4`) — for highlights, CTAs, tags
- Accent 2: warm amber (`#f5a623`) — for dates, secondary emphasis
- Text: off-white (`#e8e8f0`), muted gray (`#8888a8`)

**Typography:**
- Display/Hero: `Space Mono` or `JetBrains Mono` — technical, raw, distinctive
- Body: `Söhne` or `DM Sans` — readable, modern, not generic

**Key visual signatures:**
- Animated network graph / word cloud in hero background (D3, low opacity)
- Card hover: subtle glow + lift (box-shadow + translateY transition)
- KPI counters: count-up animation on scroll
- Keyword feed: new entries slide in from top
- Subtle scanline or grain texture overlay on hero

**DO NOT use:** purple gradients, Inter font, white backgrounds, generic SaaS templates.

---

## 🔐 Admin Authentication

Simple approach for MVP:
- Password stored as `VITE_ADMIN_PASSWORD` in `.env` (never committed)
- On login, hash the input and compare — no backend needed
- Session stored in `sessionStorage` (expires on tab close)
- Route guarded by `<PrivateRoute>` component

> ⚠️ This is a personal site — this level of security is sufficient. Do not store sensitive data behind this admin.

---

## 🚀 Deployment

1. Push code to **GitHub** (public repo)
2. Connect to **Vercel** (free tier, import from GitHub)
3. Set env var `VITE_ADMIN_PASSWORD` in Vercel dashboard
4. Buy domain on **Porkbun** (~10€/year for `.com` or `.dev`)
5. Configure custom domain in Vercel (automatic HTTPS)
6. Every `git push main` = automatic deploy 

---

## 👤 About Paul

- Background: Business school & passionate about sciences
- Current: Junior Data Scientist, recently completed 6-month internship at **Engie**
- Stack: Python, SQL, ML, Tableau/PowerBI, Spec driven Development, DataCamp courses ecosystem 
- Goals: Land a CDI as Data Scientist, keep learning, stay ambitious, enlarge my capabilities in tech, and get some experiences working on real-world data problems.
- Long-term vision : Land a VIE and get some more experience around the world.

---

*Last updated: 28-04-2026*

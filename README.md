# Paul's Portfolio — Recruiter-Grade Data Science Showcase

> A public-facing, visually striking portfolio site designed to go far beyond a traditional CV.  
> Built for recruiters, hiring managers, and the data science community.  
> *"Junior in experience. Senior in mindset."*

---

## 🎯 Project Purpose

This site is the public extension of Paul's CV. It is not a standard portfolio.  
It is a **living knowledge base**, a **project showcase**, and a **signal of technical ambition** — all in one.

Target audience:
- Recruiters at tech/data companies
- Hiring managers evaluating junior Data Science candidates
- Anyone who wants to understand what Paul knows, how he thinks, and what he's building

Core message to convey:
- Paul comes from a business school background but has **real technical depth**
- He is a **self-driven learner** who documents and shares what he learns
- He is **not the average junior candidate**

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

Projects to include (to be completed by Paul):
- [ ] VisionPatrimoine (video presentation embed)
- [ ] Stage Engie — 6-month internship (podcast or summary)
- [ ] [Other projects TBD]

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
Added: 2025-06-10
Paul's note: "Un VPN mesh peer-to-peer. Au lieu d'un serveur central, chaque machine se connecte directement aux autres. C'est comme si tu donnais une adresse privée à chaque appareil dans le monde."
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
| Word Cloud / Graph | **D3.js** or `react-wordcloud` | For the keyword background visual |
| Routing | **React Router v6** | SPA routing (main site + /admin) |
| Data storage | **JSON files** (local, versioned in Git) | Simple, no backend needed for MVP |
| Admin auth | **Simple password hash in env var** | Lightweight, sufficient for personal site |
| Hosting | **Vercel** | Free tier, automatic deploys from GitHub, perfect for Vite/React |
| Domain | **To be purchased** (e.g. paulxxx.com via Namecheap or Porkbun) | ~10€/year |

> **No database for MVP.** Everything under `/src/data/` is bundled at build time for the **public site**. **`/admin`** edits copies in `localStorage` (tabs per JSON + formulaire mots-clés). **Télécharger `openpaul-data.zip`** exports all six files; replace `src/data/*.json` in Git and push so Vercel redeploys.

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

## 🗺️ Development Roadmap

### Phase 0 — Setup (Day 1)
- [ ] `npm create vite@latest portfolio -- --template react`
- [ ] Install: Tailwind CSS, Framer Motion, React Router, D3
- [ ] Configure Tailwind with custom theme (colors, fonts)
- [ ] Set up folder structure as defined above
- [ ] Create placeholder JSON data files
- [ ] Push to GitHub repo (public)
- [ ] Connect repo to Vercel (auto-deploy on push)

### Phase 1 — Core Layout & Hero (Day 1–2)
- [ ] Navbar (name left, links right, minimal)
- [ ] Hero section: name, title, subtitle, scroll CTA
- [ ] Animated word cloud background (D3 or `react-wordcloud`)
- [ ] Smooth scroll between sections

### Phase 2 — KPI Strip (Day 2)
- [ ] 4–5 animated counters
- [ ] Scroll-triggered count-up (Intersection Observer or Framer Motion)
- [ ] Icons per KPI

### Phase 3 — Projects Section (Day 2–3)
- [ ] ProjectCard component
- [ ] Grid layout (2–3 columns responsive)
- [ ] Modal on click with full detail + tags
- [ ] Populate `projects.json` with real data

### Phase 4 — Certifications & DataCamp (Day 3)
- [ ] CertCard component with badge image + credential link
- [ ] DataCamp stats section (XP, courses, radar chart)
- [ ] Populate JSON files with real data

### Phase 5 — Knowledge Library (Day 3–5) ⭐
- [ ] KeywordCard component
- [ ] Search bar with live fuzzy filtering
- [ ] Category filter chips (Library / Framework / Tool / Language / Methodology)
- [ ] "Recently added" sorted feed at top
- [ ] Word cloud / network graph background (D3)
- [ ] Seed `keywords.json` with ~20 initial entries

### Phase 6 — Admin Dashboard (Day 5–6)
- [ ] `/admin` route (protected by password via env var)
- [ ] Login screen
- [ ] Dashboard: list all keywords, add new, edit, delete
- [ ] Form: name, category, date, Paul's note / analogy
- [ ] Writes to `keywords.json` (via local API or GitHub commit)

### Phase 7 — Polish & Deploy (Day 6–7)
- [ ] Responsive design audit (mobile first)
- [ ] Page load animations (staggered reveals)
- [ ] SEO meta tags (title, description, og:image)
- [ ] Favicon + og:image
- [ ] Performance audit (Lighthouse)
- [ ] Purchase domain + configure on Vercel
- [ ] Final review

---

## 📄 Data Schemas

### `projects.json`
```json
[
  {
    "id": "vision-patrimoine",
    "title": "VisionPatrimoine",
    "shortDescription": "Application de visualisation du patrimoine immobilier.",
    "fullDescription": "...",
    "tags": ["Python", "Streamlit", "Real Estate", "Data Viz"],
    "methodology": ["EDA", "Clustering"],
    "githubUrl": "https://github.com/...",
    "demoUrl": null,
    "videoUrl": "https://youtube.com/...",
    "thumbnail": "/assets/projects/vision-patrimoine.png",
    "featured": true
  }
]
```

### `keywords.json`
```json
[
  {
    "id": "tailscale",
    "name": "Tailscale",
    "category": "Tool",
    "subcategory": "Networking",
    "dateAdded": "2025-06-10",
    "note": "Un VPN mesh peer-to-peer. Chaque machine se connecte directement aux autres, sans serveur central.",
    "analogy": "C'est comme donner une adresse privée à chaque appareil dans le monde, et les faire se parler directement."
  }
]
```

### `certifications.json`
```json
[
  {
    "id": "dc-data-scientist",
    "name": "Data Scientist Professional",
    "issuer": "DataCamp",
    "dateObtained": "2024-12",
    "credentialUrl": "https://...",
    "badgeUrl": "/assets/certs/datacamp-ds.png"
  }
]
```

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
6. Every `git push main` = automatic deploy ✅

---

## ✅ Claude Code Instructions

When implementing this project, Claude Code must:

1. **Always follow the design system** defined in this README (colors, fonts, aesthetic)
2. **Never use Inter, Roboto, or system fonts** — use the specified typography
3. **All data lives in `/src/data/*.json`** — no hardcoded content in components
4. **Components must be modular** — one responsibility per component
5. **Admin route `/admin` must be fully protected** — never render without auth
6. **Use Framer Motion** for all animations — no raw CSS transitions for interactive elements
7. **Mobile-first responsive design** — Tailwind breakpoints `sm`, `md`, `lg`
8. **All text content in French or English** — Paul will fill in real content
9. **Use placeholder data** from the schemas above until real data is provided
10. **Commit-friendly JSON files** — any admin edit should produce clean, readable JSON

---

## 👤 About Paul

- Background: Business school (École de Commerce)
- Current: Junior Data Scientist, recently completed 6-month internship at **Engie**
- Stack: Python, SQL, ML libraries (scikit-learn, etc.), DataCamp ecosystem
- Goals: Land a CDI as Data Scientist, keep learning, document everything
- This site proves: technical depth, self-direction, and ambition beyond the CV

---

*README generated as project brief for Claude Code agent context.*  
*Last updated: 2025*

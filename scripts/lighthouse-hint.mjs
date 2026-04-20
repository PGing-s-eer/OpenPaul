console.log(`
Lighthouse (audit perf / a11y / SEO) — phase 7

  1. Build + preview :
     npm run build && npm run preview

  2. Dans un autre terminal (Chrome requis) :
     npx lighthouse http://localhost:4173 --view

  Variante (catégories ciblées) :
     npx lighthouse http://localhost:4173 --only-categories=performance,accessibility,best-practices,seo --view

  Tester aussi /admin après connexion si besoin.
`)

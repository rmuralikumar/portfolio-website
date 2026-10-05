# Murali Kumar R — Portfolio

Personal portfolio of **Murali Kumar R**, Web Developer & WordPress Developer.
Live at **https://rmuralikumar.vercel.app**.

Built with **Next.js 16 (App Router)**, **React 19** and **TypeScript**. There is no database:
all content lives in typed data files, and the contact form sends email over SMTP.

## Features

- **Selected Projects**: category filter (All, Web Apps, Websites, WordPress), project cards with
  live-site links, and an in-place detail view with shareable links (`/?project=<slug>`), browser
  Back/Esc support and Previous/Next navigation. Projects can show an optional demo video.
- **Contact form**: shared client/server validation, honeypot, timing and rate-limit checks, and
  Cloudflare Turnstile verified on the server. Turnstile only loads when the form is near the viewport.
- **Performance**: static prerendering, self-hosted fonts (`next/font`), optimized responsive images
  (`next/image`, WebP with blur placeholders), lazy third-party scripts.
- **SEO**: metadata, canonical URL, generated Open Graph image, JSON-LD (Person, WebSite, projects),
  `sitemap.xml` and `robots.txt`.
- **Accessibility**: WCAG 2.2 AA checked: keyboard support everywhere, visible focus, skip link,
  focus-trapped mobile menu, AA colour contrast, 44px touch targets, reduced-motion support.

## Getting started

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env   # then fill in real values
npm run dev            # http://localhost:3000
```

| Script              | What it does                          |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Development server (Turbopack)        |
| `npm run build`     | Production build                      |
| `npm start`         | Serve the production build            |
| `npm run lint`      | ESLint (Next.js + accessibility rules) |
| `npm run typecheck` | TypeScript check                      |

## Environment variables

See [.env.example](.env.example). Set the same names in Vercel (Production and Preview) and redeploy.

| Name                   | Used for                                              |
| ---------------------- | ----------------------------------------------------- |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD` | Gmail SMTP (use a Google App Password) |
| `CONTACT_EMAIL`        | Inbox that receives contact messages                  |
| `TURNSTILE_SITE_KEY`   | Public Turnstile key, embedded at build time          |
| `TURNSTILE_SECRET_KEY` | Server-side Turnstile verification                    |
| `ALLOWED_HOSTNAMES`    | Optional extra domains for the Turnstile hostname check |

## Editing content

| What                                     | Where                     |
| ---------------------------------------- | ------------------------- |
| Projects (order, text, tags, links)      | `src/data/projects.ts`    |
| Project screenshots                      | `src/assets/projects/`    |
| Skills, services, learning, education    | `src/data/content.ts`     |
| Name, email, phone, social links         | `src/data/site.ts`        |
| Styles                                   | `src/app/globals.css`     |

### Adding a project demo video

1. Put the file in `public/videos/`, for example `public/videos/timebus.mp4`
   (H.264 MP4, about 1280px wide, under 5 MB, 10–20 seconds, no audio needed).
2. Add `video: "/videos/timebus.mp4"` to that project in `src/data/projects.ts`.

The video plays muted and looped in the project's detail view, only while visible, with pause and
mute buttons. Without a `video` entry the screenshot is shown.

## Project structure

```text
src/
├── app/            # layout, page, API route, metadata files (OG image, sitemap, robots, icon)
├── components/     # layout (header, footer), sections, projects, contact
├── data/           # site, projects and section content
├── lib/            # shared contact-form validation
└── assets/         # project screenshots (optimized by next/image)
```

## Deployment

Deployed on Vercel (framework preset: Next.js, set in `vercel.json`). Pushing to the production
branch deploys automatically once the environment variables above are set.

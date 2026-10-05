import type { StaticImageData } from "next/image";

import timebusImage from "@/assets/projects/timebus.png";
import entranceCafeImage from "@/assets/projects/the-entrance-cafe.png";
import genzAiImage from "@/assets/projects/genz-ai.png";
import showaraImage from "@/assets/projects/showara.png";
import cafeParisienneImage from "@/assets/projects/cafe-parisienne.png";
import poweronImage from "@/assets/projects/poweron.png";
import h2oTattooImage from "@/assets/projects/h2o-tattoo-studio.png";
import rareMomentsImage from "@/assets/projects/rare-moments-photography.png";
import bangaloreSmilesImage from "@/assets/projects/bangalore-smiles-dental-care.png";
import gridformImage from "@/assets/projects/gridform-studio.png";
import graficImage from "@/assets/projects/grafic.png";
import magnificoImage from "@/assets/projects/magnifico.png";

export type ProjectCategory = "web-app" | "website" | "wordpress";

export type Project = {
  /** URL-safe id, used in `?project=<slug>` deep links */
  slug: string;
  name: string;
  type: string;
  category: ProjectCategory;
  year: string;
  status: string;
  /** One line shown on the project card */
  summary: string;
  description: string;
  tags: string[];
  /** Public demo. Leave out when the project is not publicly hosted. */
  liveUrl?: string;
  image: StaticImageData;
  imageAlt: string;
  featured?: boolean;
  /**
   * Optional demo video served from /public, for example "/videos/timebus.mp4".
   * Only set it once the file exists; until then the screenshot is shown.
   */
  video?: string;
};

export const projectCategories: { id: ProjectCategory; label: string }[] = [
  { id: "web-app", label: "Web Apps" },
  { id: "website", label: "Websites" },
  { id: "wordpress", label: "WordPress" },
];

// Display order on the site
export const projects: Project[] = [
  {
    slug: "timebus",
    name: "TimeBus",
    type: "Online Bus Ticket Booking Platform",
    category: "web-app",
    year: "2026",
    status: "Completed",
    summary: "Bus ticket booking with route search, seat selection, QR tickets and live tracking.",
    description:
      "A modern responsive bus ticket booking and tracking frontend application featuring route search, advanced bus filtering, interactive seat selection, passenger details, promotional coupons, simulated payments, digital tickets with QR codes, booking management, and live bus tracking.",
    tags: ["HTML5", "CSS3", "Tailwind CSS", "Vanilla JavaScript", "LocalStorage"],
    liveUrl: "https://timebus-web.vercel.app/",
    image: timebusImage,
    imageAlt: "TimeBus online bus ticket booking platform home page",
  },
  {
    slug: "the-entrance-cafe",
    name: "The Entrance Cafe",
    type: "Cafe Website",
    category: "website",
    year: "2026",
    status: "Completed",
    summary: "Image-led cafe website with a hero slider, menu, gallery, reviews and click-to-call.",
    description:
      "A warm, image-led website for a cafe on Taylors Road, Kilpauk, Chennai. Features a full-screen hero slider, menu, gallery, reviews, opening hours, price range, map location and a click-to-call button.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Responsive Design"],
    liveUrl: "https://the-entrance-cafe-gray.vercel.app/",
    image: entranceCafeImage,
    imageAlt: "The Entrance Cafe website hero with the cafe building at dusk",
  },
  {
    slug: "genz-ai",
    name: "GENZ-AI",
    type: "Conversational AI Web App",
    category: "web-app",
    year: "2026",
    status: "Completed",
    summary: "AI chat app with real-time streaming, web search, image generation and voice.",
    description:
      "A conversational AI web app with real-time AI streaming, web search, image generation, multimodal document and image analysis, voice interaction, and an autonomous AI tool execution system.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "AI"],
    liveUrl: "https://genzai-web.vercel.app/",
    image: genzAiImage,
    imageAlt: "GENZ-AI conversational AI workspace landing page",
  },
  {
    slug: "showara",
    name: "Showara",
    type: "Movie Ticket Booking Platform",
    category: "web-app",
    year: "2026",
    status: "Completed",
    summary: "Movie discovery and ticket booking with TMDB listings, showtimes and seat holds.",
    description:
      "A cinematic movie discovery and ticket booking platform with TMDB-powered listings, language, genre and format filters, cinema showtimes, interactive seat selection with a timed hold, Google sign-in, and booking history.",
    tags: ["Next.js", "React", "TMDB API", "Google Sign-In", "Responsive UI"],
    liveUrl: "https://showara-web.vercel.app/",
    image: showaraImage,
    imageAlt: "Showara movie ticket booking platform with featured film listings",
  },
  {
    slug: "cafe-parisienne",
    name: "Cafe Parisienne",
    type: "Cafe Website Concept",
    category: "website",
    year: "2026",
    status: "Concept / Preview",
    summary: "Website concept for a London cafe with ordering calls to action and review ratings.",
    description:
      "A website concept for a family-run cafe in Battersea, London. Features a playful awning-style header, menu and services dropdowns, photo collage hero, online ordering and delivery calls to action, and Google and Tripadvisor ratings.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Responsive Design"],
    liveUrl: "https://cafeparisienneuk.vercel.app",
    image: cafeParisienneImage,
    imageAlt: "Cafe Parisienne website concept with an awning-style header and photo collage",
  },
  {
    slug: "poweron",
    name: "PowerOn",
    type: "Gym & Fitness Website / WordPress",
    category: "wordpress",
    year: "2026",
    status: "Completed",
    summary: "High-energy gym website with training programs, membership tiers and consultations.",
    description:
      "A high-energy gym and fitness club website designed to showcase training programs, interactive fitness tickers, dynamic membership tiers, and visitor consultation with modern responsive layouts.",
    tags: ["WordPress", "Elementor", "CSS3", "Jeg Elementor Kit", "Responsive Design"],
    liveUrl: "https://muralikumar-poweron.wasmer.app/",
    image: poweronImage,
    imageAlt: "PowerOn gym and fitness club WordPress website hero",
  },
  {
    slug: "h2o-tattoo-studio",
    name: "H2O Tattoo Studio",
    type: "Tattoo Studio Website",
    category: "website",
    year: "2026",
    status: "Completed",
    summary: "Dark, editorial studio website with a work showcase, reviews and appointment booking.",
    description:
      "A dark, editorial-style website for a tattoo studio in Aminjikarai, Chennai. Features bold typography, a work and styles showcase, reviews, location, studio hours and appointment booking.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Responsive Design"],
    liveUrl: "https://h2o-tattoo-studio.vercel.app/",
    image: h2oTattooImage,
    imageAlt: "H2O Tattoo Studio website with bold editorial typography",
  },
  {
    slug: "rare-moments-photography",
    name: "Rare Moments Photography",
    type: "Photography Studio Website",
    category: "website",
    year: "2026",
    status: "Completed",
    summary: "Photography studio website with a gallery, testimonials and session booking.",
    description:
      "An elegant photography studio website for baby, themed and family photography in Krishnarajapuram, Bengaluru. Features a gallery showcase, testimonials, services, studio tour, location and a session booking flow, with floating WhatsApp, Instagram and call buttons.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Responsive Design"],
    liveUrl: "https://rare-moments-photography.vercel.app/",
    image: rareMomentsImage,
    imageAlt: "Rare Moments Photography studio website home page",
  },
  {
    slug: "bangalore-smiles-dental-care",
    name: "Bangalore Smiles Dental Care",
    type: "Dental Clinic Website",
    category: "website",
    year: "2026",
    status: "Completed",
    summary: "Trust-focused clinic website with services, a smile gallery and consultation booking.",
    description:
      "A professional dental clinic website for a Hegde Nagar, Bengaluru practice. Features a trust-focused hero, services dropdown, smile gallery, patient information, consultation booking and WhatsApp contact, in a dark green and gold theme.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Responsive Design"],
    liveUrl: "https://bangalore-smiles-dental-care-beige.vercel.app/",
    image: bangaloreSmilesImage,
    imageAlt: "Bangalore Smiles Dental Care clinic website in a dark green and gold theme",
  },
  {
    slug: "gridform-studio",
    name: "Gridform Studio",
    type: "Digital Studio / WordPress",
    category: "wordpress",
    year: "2026",
    status: "Completed",
    summary: "Digital studio website built on modular typography and precise responsive layouts.",
    description:
      "Gridform Studio is a responsive digital studio website focused on web design, brand systems, and digital products. Designed and built with a strong emphasis on clean structure, modular typography, and responsive layout fidelity.",
    tags: ["HTML5", "CSS3", "JavaScript", "WordPress", "Responsive Design"],
    image: gridformImage,
    imageAlt: "Gridform Studio website with the headline about sites that hold their shape",
    featured: true,
  },
  {
    slug: "grafic",
    name: "Grafic",
    type: "Agency Website / WordPress",
    category: "wordpress",
    year: "2026",
    status: "Completed",
    summary: "Creative agency website with custom Elementor layouts and a clear content hierarchy.",
    description:
      "A creative design agency website focused on presenting services, visual content, and conversion-oriented sections through a modern WordPress interface. Features custom layouts, organized content hierarchy, and Elementor integration.",
    tags: ["WordPress", "Elementor", "Theme Customization", "CSS3"],
    image: graficImage,
    imageAlt: "Grafic creative agency WordPress website hero",
  },
  {
    slug: "magnifico",
    name: "Magnifico",
    type: "SaaS Landing Page",
    category: "website",
    year: "2026",
    status: "Completed",
    summary: "SaaS landing page presenting product features, integrations and social proof.",
    description:
      "A SaaS-style project management and team collaboration landing page designed to present product features, integrations, and social proof through a responsive interface with crisp visual elements and accessible UI components.",
    tags: ["HTML5", "CSS3", "JavaScript", "Responsive Layouts"],
    image: magnificoImage,
    imageAlt: "Magnifico team collaboration SaaS landing page",
  },
];

/** Host name shown in the mock browser bar, e.g. "timebus-web.vercel.app" */
export function projectHost(project: Project): string {
  if (!project.liveUrl) return project.name;
  try {
    return new URL(project.liveUrl).host;
  } catch {
    return project.name;
  }
}

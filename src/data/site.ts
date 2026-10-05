export const site = {
  name: "Murali Kumar R",
  brand: "MURALI",
  role: "Web Developer & WordPress Developer",
  url: "https://rmuralikumar.vercel.app",
  description:
    "Murali Kumar R is a Web Developer & WordPress Developer building fast, responsive Next.js web apps and custom WordPress websites.",
  email: "muralicodex@gmail.com",
  // Opens a Gmail compose window addressed to Murali
  emailComposeUrl: "https://mail.google.com/mail/?view=cm&fs=1&to=muralicodex@gmail.com",
  phone: {
    display: "+91 99433 21131",
    href: "tel:+919943321131",
  },
  github: "https://github.com/rmuralikumar",
  linkedin: "https://www.linkedin.com/in/rmuralikumar/",
  // Shown in the header clock, which always displays Murali's local time
  timeZone: "Asia/Kolkata",
  timeZoneLabel: "GMT+5:30",
} as const;

export type NavItem = { href: `#${string}`; label: string };

export const desktopNav: NavItem[] = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export const mobileNav: NavItem[] = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

export const footerNav: NavItem[] = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#services", label: "Services" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

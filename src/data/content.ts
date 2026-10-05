export type SkillIcon = "code" | "layers" | "layout" | "git" | "bolt";

export const skillGroups: { title: string; icon: SkillIcon; items: string[] }[] = [
  {
    title: "Frontend Development",
    icon: "code",
    items: [
      "HTML5 (Semantic Markup)",
      "CSS3 (Flexbox, Grid, Custom Properties)",
      "Custom CSS Styling",
      "JavaScript (ES6+, DOM Manipulation)",
      "Responsive Web Design",
      "Cross-Browser Compatibility",
      "Layout Troubleshooting",
    ],
  },
  {
    title: "Modern Web (Next.js)",
    icon: "layers",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "REST APIs & JSON"],
  },
  {
    title: "WordPress Development",
    icon: "layout",
    items: [
      "WordPress CMS Setup & Architecture",
      "Elementor Page Builder (Pixel-Accurate Layouts)",
      "Theme Customization & Child Themes",
      "Plugin Configuration",
      "Custom CSS for WordPress",
    ],
  },
  {
    title: "Development Tools",
    icon: "git",
    items: ["Git", "GitHub", "VS Code", "Chrome DevTools", "Vercel"],
  },
  {
    title: "AI Tools & Prompt Engineering",
    icon: "bolt",
    items: [
      "Prompt Engineering",
      "Generative AI Tools",
      "AI-Assisted Development",
      "Prototyping & Debugging",
    ],
  },
];

export const coreTechnologies = [
  "HTML5",
  "CSS3",
  "JavaScript",
  "Next.js",
  "React",
  "WordPress",
  "Elementor",
  "Git & GitHub",
];

export const services: { title: string; description: string }[] = [
  {
    title: "Website Development",
    description:
      "Building modern, responsive websites and web apps with Next.js, React and TypeScript, or with semantic HTML5, modern CSS3 and vanilla JavaScript, tested across browsers.",
  },
  {
    title: "WordPress Development",
    description:
      "Complete WordPress website development, Elementor template implementation, content structure organization, and CMS setup tailored to requirements.",
  },
  {
    title: "Website Customization",
    description:
      "Enhancing existing websites with layout improvements, responsive fixes, custom styling adjustments, and cross-browser troubleshooting.",
  },
  {
    title: "Frontend Development",
    description:
      "Transforming design concepts into fast, interactive, and user-friendly web interfaces with accessible markup, clear hierarchy, and smooth interactions.",
  },
];

export const learningAreas: { title: string; description: string; focus: string }[] = [
  {
    title: "Modern Frontend Architectures",
    description:
      "Deepening proficiency in modular JavaScript, DOM performance patterns, and responsive UI systems.",
    focus: "Next.js, JavaScript (ES6+), Web Performance & Accessibility",
  },
  {
    title: "WordPress & Elementor",
    description:
      "Advancing theme customization, template hierarchy, custom CSS, and pixel-accurate Elementor layouts.",
    focus: "Custom Themes, Elementor, Custom CSS",
  },
  {
    title: "AI-Assisted Developer Workflows",
    description:
      "Applying generative AI tools and structured prompt engineering to streamline debugging, testing, and prototyping.",
    focus: "Prompt Engineering, Rapid Prototyping",
  },
];

export const education = {
  years: "2023 – 2026",
  degree: "B.COM (COMPUTER APPLICATIONS)",
  institution: "Thanthai Hans Roever College (Autonomous)",
  university: "Bharathidasan University",
  notes:
    "Academic focus includes computer applications, programming fundamentals, web technologies, and database systems.",
};

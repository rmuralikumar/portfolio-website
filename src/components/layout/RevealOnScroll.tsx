"use client";

import { useEffect } from "react";

const PENDING = ".reveal-on-scroll:not([data-revealed])";

/**
 * Fades in every `.reveal-on-scroll` element the first time it scrolls into view.
 * `data-delay` (milliseconds) staggers neighbouring cards.
 *
 * Revealed elements get a `data-revealed` attribute rather than a class: React never touches
 * attributes it didn't render, so a re-render can't hide content again. Elements mounted later
 * (by client components) are picked up through a MutationObserver.
 */
export default function RevealOnScroll() {
  useEffect(() => {
    const timers = new Set<number>();
    const reveal = (element: HTMLElement) => {
      element.dataset.revealed = "";
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          observer.unobserve(element);
          const delay = Number.parseInt(element.dataset.delay ?? "0", 10);
          if (delay > 0) {
            const timer = window.setTimeout(() => {
              timers.delete(timer);
              reveal(element);
            }, delay);
            timers.add(timer);
          } else {
            reveal(element);
          }
        });
      },
      // Trigger once the element's top passes 88% of the viewport height. A ratio threshold would
      // never fire for elements taller than the viewport (like the project grid on phones).
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );

    const watch = (root: ParentNode) =>
      root.querySelectorAll<HTMLElement>(PENDING).forEach((element) => observer.observe(element));

    watch(document);

    const mutations = new MutationObserver((records) => {
      records.forEach((record) =>
        record.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches(PENDING)) observer.observe(node);
          watch(node);
        }),
      );
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return null;
}

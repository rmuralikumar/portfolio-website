"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * The static HTML carries the year the page was built; the browser swaps in the current
 * year, so the footer stays correct even if the site isn't redeployed after New Year.
 */
export default function CurrentYear({ buildYear }: { buildYear: number }) {
  const year = useSyncExternalStore(subscribe, () => new Date().getFullYear(), () => buildYear);
  return <>{year}</>;
}

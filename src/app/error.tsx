"use client";

import { useEffect } from "react";

import { site } from "@/data/site";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" className="status-page">
      <div className="container status-page-inner">
        <span className="section-subtitle">(SOMETHING WENT WRONG)</span>
        <h1 className="section-title">THIS PAGE HIT A SNAG</h1>
        <p className="status-page-text">
          Please try again. If it keeps happening, you can reach me at {site.email}.
        </p>
        <button type="button" className="btn btn-primary" onClick={() => retry()}>
          TRY AGAIN
        </button>
      </div>
    </main>
  );
}

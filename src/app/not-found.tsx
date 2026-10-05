import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="main-content" className="status-page">
      <div className="container status-page-inner">
        <span className="section-subtitle">(404)</span>
        <h1 className="section-title">PAGE NOT FOUND</h1>
        <p className="status-page-text">The page you are looking for does not exist or has moved.</p>
        <Link href="/" className="btn btn-primary">
          BACK TO HOME
        </Link>
      </div>
    </main>
  );
}

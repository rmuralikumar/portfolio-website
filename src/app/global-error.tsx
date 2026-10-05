"use client";

// Replaces the root layout when it fails, so it renders its own document and inline styles.
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#0a0a0c",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          textAlign: "center",
          padding: 24,
        }}
      >
        <title>Something went wrong | Murali Kumar R</title>
        <main>
          <h1 style={{ fontSize: "2rem", marginBottom: 12 }}>Something went wrong</h1>
          <p style={{ color: "#9e9ea7", marginBottom: 24 }}>
            Please try again. If it keeps happening, email muralicodex@gmail.com.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              background: "#ffffff",
              color: "#000000",
              border: 0,
              borderRadius: 9999,
              padding: "12px 24px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}

"use client";

// This boundary only fires if the root layout itself throws — kept
// intentionally dependency-free (no design-system imports) since the
// providers those depend on may be exactly what failed.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ background: "#090909", color: "#fff", fontFamily: "system-ui" }}>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>Caltrax hit a critical error</h2>
            <p style={{ marginTop: 8, color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
              Please refresh the page.
            </p>
            <button
              onClick={reset}
              style={{
                marginTop: 20,
                padding: "10px 20px",
                borderRadius: 14,
                background: "#fff",
                color: "#000",
                border: "none",
                fontWeight: 500,
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

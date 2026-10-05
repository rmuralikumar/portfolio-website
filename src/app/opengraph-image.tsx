import { ImageResponse } from "next/og";

import { projects } from "@/data/projects";
import { site } from "@/data/site";

export const alt = `${site.name} - ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const highlights = ["Next.js", "React", "WordPress"];

// Social preview card, generated once at build time
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#0a0a0c",
          backgroundImage:
            "radial-gradient(circle at 12% 8%, #26262e 0%, rgba(10,10,12,0) 45%), radial-gradient(circle at 100% 100%, rgba(255,59,29,0.35) 0%, rgba(10,10,12,0) 40%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, letterSpacing: 4, color: "#9e9ea7" }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: "#10b981" }} />
          AVAILABLE FOR PROJECTS
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 112, fontWeight: 800, lineHeight: 1, letterSpacing: -2 }}>{site.name.toUpperCase()}</div>
          <div style={{ fontSize: 42, marginTop: 24, color: "#ffffff" }}>{site.role}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, color: "#9e9ea7" }}>
          <div style={{ display: "flex", gap: 14 }}>
            {highlights.map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  padding: "8px 20px",
                  border: "1px solid rgba(255,255,255,0.22)",
                  borderRadius: 999,
                  color: "#ffffff",
                }}
              >
                {item}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexShrink: 0, whiteSpace: "nowrap" }}>
            {projects.length} projects · {new URL(site.url).host}
          </div>
        </div>
      </div>
    ),
    size,
  );
}

import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function socialImage(cloud = false) {
  const [font, logo] = await Promise.all([
    readFile(
      join(
        process.cwd(),
        "node_modules/@fontsource/manrope/files/manrope-latin-500-normal.woff",
      ),
    ),
    readFile(join(process.cwd(), "public/brand/logo-horizontal-primary.svg")),
  ]);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "55px 70px",
        background: "#f6f5f0",
        color: "#182d30",
        fontFamily: "Manrope",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -145,
          top: -100,
          width: 530,
          height: 800,
          border: "1px solid #c9d9c9",
          borderRadius: "50%",
          transform: "rotate(30deg)",
          background: "#e8eee2",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -120,
          top: -70,
          width: 450,
          height: 740,
          border: "1px solid #c4d6c6",
          borderRadius: "50%",
          transform: "rotate(30deg)",
        }}
      />
      <img
        src={`data:image/svg+xml;base64,${logo.toString("base64")}`}
        width={290}
        height={76}
        alt="OpenCadence"
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 47,
          maxWidth: 910,
          fontSize: 63,
          lineHeight: 1.17,
          letterSpacing: -2.7,
        }}
      >
        <span>{cloud ? "OpenCadence Cloud." : "Your work, together."}</span>
        <span style={{ color: "#287c73" }}>
          {cloud
            ? "Managed hosting. Coming soon."
            : "Open source. On your machine."}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 28,
          maxWidth: 860,
          fontSize: 25,
          lineHeight: 1.55,
          color: "#596b62",
        }}
      >
        {cloud
          ? "In development. Start with the free Community app."
          : "Projects, tasks, notes, and clients. A workspace for freelancers."}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: "auto",
          fontSize: 20,
          color: "#287c73",
        }}
      >
        opencadence.app
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Manrope", data: font, style: "normal", weight: 500 }],
    },
  );
}

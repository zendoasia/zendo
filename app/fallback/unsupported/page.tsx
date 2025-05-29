import React from "react";

export const metadata = {
  title: "Unsupported Browser or Device | Zendo",
  description: "Your browser or device is not supported.",
};

export default function UnsupportedPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fff", color: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: 480, width: "100%", border: "1px solid #888", background: "#fff", padding: 32, borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
        <h1 style={{ fontSize: 32, fontWeight: "bold", marginBottom: 16 }}>Unsupported Browser or Device</h1>
        <p style={{ fontSize: 18, marginBottom: 8 }}>
          Sorry, your browser or device is too old to view this site.
        </p>
        <p style={{ fontSize: 16 }}>
          Please upgrade to a modern browser or use a newer device.
        </p>
      </div>
    </main>
  );
}

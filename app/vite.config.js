import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// BB-13: normal multi-file build. JS/CSS/images get content-hashed names (cacheable for a year),
// files in public/ (manifest, service worker, icons, preview image) are copied as-is.
export default defineConfig({
  plugins: [react()],
  build: { outDir: "dist" },
});

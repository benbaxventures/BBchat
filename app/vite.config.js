import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// Builds ONE self-contained dist/index.html (JS, CSS and logos inlined),
// the same shape as the original deployed file, so existing hosting keeps working.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: { outDir: "dist", assetsInlineLimit: 100_000_000 },
});

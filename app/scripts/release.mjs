// Copies the single-file build to the repo root index.html, which the hosting configs serve.
import { copyFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

const from = fileURLToPath(new URL("../dist/index.html", import.meta.url));
const to = fileURLToPath(new URL("../../index.html", import.meta.url));
copyFileSync(from, to);
console.log(`Released ${statSync(to).size} bytes -> ${to}`);

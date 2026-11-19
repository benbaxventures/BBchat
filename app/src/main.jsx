import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
// BB-13: self-hosted variable fonts (same typefaces the app always used), no Google Fonts request.
import "@fontsource-variable/sora";
import "@fontsource-variable/plus-jakarta-sans";
import "./index.css";

// Log out (BB-07) remounts the app with a new key, so every piece of state starts fresh.
function Root() {
  const [session, setSession] = React.useState(0);
  return <App key={session} onReset={() => setSession((n) => n + 1)} />;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);

// BB-08: offline support and "install app" need a service worker (production builds only).
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      /* app still works without it */
    });
  });
}

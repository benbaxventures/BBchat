// BB-07: keep the signed-in user's chats and settings on this device (localStorage).
// Nothing leaves the device. Every access is wrapped because storage can be blocked
// (private mode, full disk); the app then simply behaves as before (in memory only).

const KEY = "bbchat:v1";

export function loadSaved() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveState(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable or full: keep working in memory */
  }
}

export function clearSaved() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

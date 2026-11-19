export function configureNotifications() {}

export async function getNotificationPermission() {
  return false;
}

export async function requestNotificationPermission() {
  return false;
}

export async function sendTestNotification() {
  throw new Error("On-device notifications are only available in native builds.");
}

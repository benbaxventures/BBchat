import * as Notifications from "expo-notifications";

export function configureNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export async function getNotificationPermission() {
  const permission = await Notifications.getPermissionsAsync();
  return permission.granted;
}

export async function requestNotificationPermission() {
  if (process.env.EXPO_OS === "android") {
    await Notifications.setNotificationChannelAsync("messages", {
      name: "Messages",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 180, 120, 180],
      lightColor: "#2EBC3B",
    });
  }
  const permission = await Notifications.requestPermissionsAsync();
  return permission.granted;
}

export function sendTestNotification() {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: "BBchat is ready",
      body: "On-device notifications are enabled.",
      data: { type: "test" },
    },
    trigger: null,
  });
}

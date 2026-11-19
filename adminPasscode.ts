import AsyncStorage from "@react-native-async-storage/async-storage";

const ADMIN_PASSCODE_KEY = "bbchat.admin-passcode.v1";

export async function getAdminPasscode(): Promise<string | null> {
  return AsyncStorage.getItem(ADMIN_PASSCODE_KEY);
}

export async function saveAdminPasscode(passcode: string): Promise<void> {
  await AsyncStorage.setItem(ADMIN_PASSCODE_KEY, passcode);
}

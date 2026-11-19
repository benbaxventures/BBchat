import * as SecureStore from "expo-secure-store";

const ADMIN_PASSCODE_KEY = "bbchat.admin-passcode.v1";

export async function getAdminPasscode(): Promise<string | null> {
  return SecureStore.getItemAsync(ADMIN_PASSCODE_KEY);
}

export async function saveAdminPasscode(passcode: string): Promise<void> {
  await SecureStore.setItemAsync(ADMIN_PASSCODE_KEY, passcode);
}

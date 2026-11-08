import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "solace_auth_token";
const USER_KEY = "solace_user";

export async function saveToken(token: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
}

export async function getToken() {
  if (Platform.OS === "web") {
    return localStorage.getItem(TOKEN_KEY);
  }

  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function removeToken() {
  if (Platform.OS === "web") {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}

export async function saveUser(user: {
  id: string;
  name: string;
  email: string;
}) {
  const value = JSON.stringify(user);

  if (Platform.OS === "web") {
    localStorage.setItem(USER_KEY, value);
  } else {
    await SecureStore.setItemAsync(USER_KEY, value);
  }
}

export async function getUser() {
  const value =
    Platform.OS === "web"
      ? localStorage.getItem(USER_KEY)
      : await SecureStore.getItemAsync(USER_KEY);

  return value ? JSON.parse(value) : null;
}

export async function removeUser() {
  if (Platform.OS === "web") {
    localStorage.removeItem(USER_KEY);
  } else {
    await SecureStore.deleteItemAsync(USER_KEY);
  }
}
import { useEffect } from "react";
import { BackHandler, Platform } from "react-native";
import { router } from "expo-router";

export function useAndroidBackHandler(
  fallback: "/onboarding" | "/login" | "/signup"
) {
  useEffect(() => {
    if (Platform.OS !== "android") return;

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace(fallback);
        }

        return true;
      }
    );

    return () => subscription.remove();
  }, [fallback]);
}
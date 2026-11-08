import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  View,
} from "react-native";

function RootNavigator() {
  const { loading, user } = useAuth();
  const { theme, isThemeLoading } = useTheme();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading || isThemeLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";

    const inHistory =
      segments[0] === "history" ||
      segments[0] === "mood-history";

    if (!user && (inTabsGroup || inHistory)) {
      router.replace("/(auth)/login");
      return;
    }

    if (user && inAuthGroup) {
      router.replace("/(tabs)/companion");
    }
  }, [
    user,
    loading,
    isThemeLoading,
    segments,
    router,
  ]);

  if (loading || isThemeLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator
          size="large"
          color={theme.primary}
        />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="history" />
      <Stack.Screen name="mood-history" />
      <Stack.Screen name="theme-settings" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
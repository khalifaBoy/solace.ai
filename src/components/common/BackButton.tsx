import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

import { useTheme } from "@/context/ThemeContext";

interface Props {
  fallback?: "/login" | "/signup" | "/onboarding";
}

export default function BackButton({ fallback = "/onboarding" }: Props) {
  const { theme } = useTheme();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallback);
    }
  };

  const styles = StyleSheet.create({
    button: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <Pressable
      style={styles.button}
      onPress={handleBack}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <Ionicons
        name="arrow-back"
        size={23}
        color={theme.text}
      />
    </Pressable>
  );
}
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HomeHeader() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  // Dynamic greeting based on the current time.
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 17
      ? "Good afternoon"
      : "Good evening";

  // Extract the user's first name.
  const firstName = user?.name?.trim().split(" ")[0] || "there";

  const initial = user?.name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <View style={styles.container}>
      {/* Greeting and heading */}
      <View style={styles.leftContent}>
        <Text style={[styles.greeting, { color: theme.muted }]}>
          {greeting}, {firstName} 👋
        </Text>

        <Text style={[styles.title, { color: theme.text }]}>
          How are you feeling today?
        </Text>

        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Take a moment for yourself.
        </Text>
      </View>

      {/* Header actions */}
      <View style={styles.actions}>
        {/* Profile button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={() => router.push("/(tabs)/profile")}
          style={({ pressed }) => [
            styles.avatar,
            {
              backgroundColor: theme.secondary,
              borderColor: theme.border,
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <Text style={[styles.avatarText, { color: theme.primary }]}>
            {initial}
          </Text>
        </Pressable>

        {/* Notification button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          onPress={() => {
            // Notification screen will be implemented later.
          }}
          style={({ pressed }) => [
            styles.notification,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <Ionicons
            name="notifications-outline"
            size={21}
            color={theme.text}
          />

          <View
            style={[
              styles.notificationDot,
              { backgroundColor: theme.danger },
            ]}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
  },

  leftContent: {
    flex: 1,
    paddingRight: 12,
  },

  greeting: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 9,
    letterSpacing: 0.2,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    lineHeight: 32,
    letterSpacing: -0.6,
    maxWidth: 270,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  avatarText: {
    fontSize: 17,
    fontWeight: "700",
  },

  notification: {
    width: 42,
    height: 42,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  notificationDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    top: 8,
    right: 8,
  },
});
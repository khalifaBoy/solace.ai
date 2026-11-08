import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.muted,

        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: theme.tabBar,
          borderTopColor: theme.border,
          borderTopWidth: 1,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
        },

        sceneStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={String(color ?? theme.primary)}
            />
          ),
        }}
      />

      {/* Mood */}
      <Tabs.Screen
        name="mood"
        options={{
          title: "Mood",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="heart-outline"
              size={size}
              color={String(color ?? theme.primary)}
            />
          ),
        }}
      />

      {/* Companion */}
      <Tabs.Screen
        name="companion"
        options={{
          title: "Companion",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbubbles-outline"
              size={size}
              color={String(color ?? theme.primary)}
            />
          ),
        }}
      />

      {/* Journal */}
      <Tabs.Screen
        name="journal"
        options={{
          title: "Journal",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="book-outline"
              size={size}
              color={String(color ?? theme.primary)}
            />
          ),
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="person-outline"
              size={size}
              color={String(color ?? theme.primary)}
            />
          ),
        }}
      />
    </Tabs>
  );
}
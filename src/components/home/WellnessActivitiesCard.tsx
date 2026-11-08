import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function WellnessActivities() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.card,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
        onPress={() => router.push("/wellness-activities")}
      >
        <View
          style={[
            styles.icon,
            { backgroundColor: theme.primary },
          ]}
        >
          <Ionicons
            name="sparkles-outline"
            size={26}
            color="#FFFFFF"
          />
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]}>
            Wellness Activities
          </Text>

          <Text style={[styles.subtitle, { color: theme.muted }]}>
            Take a mindful break. Small activities can make a big difference.
          </Text>

          <Text style={[styles.explore, { color: theme.primary }]}>
            Explore activities →
          </Text>
        </View>

        <Ionicons
          name="arrow-forward-circle-outline"
          size={25}
          color={theme.muted}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
  },

  card: {
    borderRadius: 18,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    minHeight: 110,
    borderWidth: 1,
  },

  icon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 12,
    marginTop: 6,
    lineHeight: 18,
  },

  explore: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 8,
  },
});
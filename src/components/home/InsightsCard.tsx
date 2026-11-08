import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";

export default function InsightsCard() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: theme.surface },
        ]}
      >
        <Ionicons
          name="analytics-outline"
          size={26}
          color={theme.primary}
        />
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>
          Your Emotional Wellbeing
        </Text>

        <Text style={[styles.description, { color: theme.muted }]}>
          Explore your mood patterns, emotional trends, and personal progress.
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: theme.primary },
          ]}
          onPress={() => router.push("/insights")}
        >
          <Text style={styles.buttonText}>View Insights</Text>

          <Ionicons
            name="arrow-forward"
            size={16}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  content: {
    gap: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  description: {
    fontSize: 13,
    lineHeight: 20,
  },

  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    marginTop: 5,
  },

  buttonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
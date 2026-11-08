import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function CompanionCard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  const firstName = user?.name?.trim().split(" ")[0] || "there";

  return (
    <LinearGradient
      colors={[theme.secondary, theme.card]}
      style={styles.container}
    >
      <View style={styles.top}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.surface },
          ]}
        >
          <Ionicons
            name="sparkles"
            size={27}
            color={theme.primary}
          />
        </View>

        <View
          style={[
            styles.badge,
            { backgroundColor: theme.surface },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: theme.primary },
            ]}
          >
            YOUR AI COMPANION
          </Text>
        </View>
      </View>

      <Text style={[styles.title, { color: theme.text }]}>
        Hey {firstName}, need someone to talk to?
      </Text>

      <Text style={[styles.description, { color: theme.muted }]}>
        I'm here to listen, understand and help you feel better.
      </Text>

      <Pressable
        style={[
          styles.button,
          { backgroundColor: theme.primary },
        ]}
        onPress={() => router.push("/companion")}
      >
        <Text style={styles.buttonText}>
          Talk to Solace
        </Text>

        <Ionicons
          name="arrow-forward"
          size={18}
          color="#FFFFFF"
        />
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 22,
    borderRadius: 22,
    marginBottom: 22,
  },

  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },

  badgeText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },

  title: {
    fontSize: 21,
    fontWeight: "700",
  },

  description: {
    fontSize: 13,
    lineHeight: 21,
    marginTop: 9,
    maxWidth: 280,
  },

  button: {
    marginTop: 20,
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function TypingIndicator() {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: 9,
      marginBottom: 18,
    },

    avatar: {
      width: 30,
      height: 30,
      borderRadius: 11,
      backgroundColor: theme.secondary,
      justifyContent: "center",
      alignItems: "center",
    },

    bubble: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: theme.surface,
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },

    text: {
      color: theme.muted,
      fontSize: 12,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Ionicons
          name="sparkles"
          size={16}
          color={theme.primary}
        />
      </View>

      <View style={styles.bubble}>
        <ActivityIndicator
          size="small"
          color={theme.primary}
        />

        <Text style={styles.text}>
          Solace is thinking...
        </Text>
      </View>
    </View>
  );
}
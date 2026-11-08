import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  onNewChat: () => void;
  onHistory: () => void;
}

export default function ChatHeader({
  onNewChat,
  onHistory,
}: Props) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: theme.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },

    left: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },

    avatar: {
      width: 48,
      height: 48,
      borderRadius: 17,
      backgroundColor: theme.secondary,
      justifyContent: "center",
      alignItems: "center",
    },

    onlineDot: {
      position: "absolute",
      width: 10,
      height: 10,
      backgroundColor: theme.success,
      borderRadius: 5,
      right: 0,
      bottom: 0,
      borderWidth: 2,
      borderColor: theme.surface,
    },

    name: {
      fontSize: 17,
      fontWeight: "700",
      color: theme.text,
    },

    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      marginTop: 4,
    },

    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.success,
    },

    status: {
      fontSize: 11,
      color: theme.muted,
    },

    actions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    actionButton: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor: theme.secondary,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.avatar}>
          <Ionicons
            name="sparkles"
            size={25}
            color={theme.primary}
          />

          <View style={styles.onlineDot} />
        </View>

        <View>
          <Text style={styles.name}>Solace</Text>

          <View style={styles.statusContainer}>
            <View style={styles.statusDot} />
            <Text style={styles.status}>
              Your AI companion
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.actionButton}
          onPress={onHistory}
        >
          <Ionicons
            name="time-outline"
            size={22}
            color={theme.primary}
          />
        </Pressable>

        <Pressable
          style={styles.actionButton}
          onPress={onNewChat}
        >
          <Ionicons
            name="create-outline"
            size={22}
            color={theme.primary}
          />
        </Pressable>
      </View>
    </View>
  );
}

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  time: string;
}

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const { theme } = useTheme();
  const isUser = message.sender === "user";

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "flex-end",
      marginBottom: 18,
      gap: 9,
    },

    aiContainer: {
      justifyContent: "flex-start",
    },

    userContainer: {
      justifyContent: "flex-end",
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
      maxWidth: "78%",
      padding: 14,
      borderRadius: 18,
    },

    aiBubble: {
      backgroundColor: theme.surface,
      borderTopLeftRadius: 4,
      borderWidth: 1,
      borderColor: theme.border,
    },

    userBubble: {
      backgroundColor: theme.primary,
      borderTopRightRadius: 4,
    },

    message: {
      fontSize: 14,
      lineHeight: 22,
    },

    aiText: {
      color: theme.text,
    },

    userText: {
      color: "#FFFFFF",
    },

    time: {
      fontSize: 9,
      marginTop: 7,
      textAlign: "right",
    },

    aiTime: {
      color: theme.muted,
    },

    userTime: {
      color: "#FFFFFF",
      opacity: 0.8,
    },
  });

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.aiContainer,
      ]}
    >
      {!isUser && (
        <View style={styles.avatar}>
          <Ionicons
            name="sparkles"
            size={16}
            color={theme.primary}
          />
        </View>
      )}

      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text
          style={[
            styles.message,
            isUser ? styles.userText : styles.aiText,
          ]}
        >
          {message.text}
        </Text>

        <Text
          style={[
            styles.time,
            isUser ? styles.userTime : styles.aiTime,
          ]}
        >
          {message.time}
        </Text>
      </View>
    </View>
  );
}
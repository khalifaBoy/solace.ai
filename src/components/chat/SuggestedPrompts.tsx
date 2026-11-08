
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";

const prompts = [
  "I'm feeling stressed",
  "Help me relax",
  "I need some motivation",
];

interface Props {
  onSelect: (prompt: string) => void;
}

export default function SuggestedPrompts({ onSelect }: Props) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginBottom: 20,
    },

    heading: {
      fontSize: 12,
      color: theme.muted,
      marginBottom: 12,
    },

    prompts: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },

    prompt: {
      paddingHorizontal: 13,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: theme.secondary,
      borderWidth: 1,
      borderColor: theme.border,
    },

    promptText: {
      fontSize: 11,
      color: theme.primary,
      fontWeight: "600",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        You can start by sharing...
      </Text>

      <View style={styles.prompts}>
        {prompts.map((prompt) => (
          <Pressable
            key={prompt}
            style={styles.prompt}
            onPress={() => onSelect(prompt)}
          >
            <Text style={styles.promptText}>
              {prompt}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
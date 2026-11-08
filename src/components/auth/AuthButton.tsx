
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
}

export default function AuthButton({
  title,
  onPress,
  loading = false,
}: Props) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    button: {
      height: 56,
      backgroundColor: theme.primary,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 12,
    },

    disabledButton: {
      opacity: 0.6,
    },

    text: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },
  });

  return (
    <Pressable
      style={[
        styles.button,
        loading && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: loading, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
}
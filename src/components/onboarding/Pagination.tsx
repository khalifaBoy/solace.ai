import { StyleSheet, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

interface Props {
  currentIndex: number;
  total: number;
}

export default function Pagination({
  currentIndex,
  total,
}: Props) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
    },

    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.border,
    },

    activeDot: {
      width: 25,
      backgroundColor: theme.primary,
    },
  });

  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            currentIndex === index && styles.activeDot,
          ]}
        />
      ))}
    </View>
  );
}
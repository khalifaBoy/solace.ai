import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

interface Props {
  title: string;
  description: string;
  icon: string;
  color: string;
}

export default function OnboardingSlide({
  title,
  description,
  icon,
  color,
}: Props) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 30,
    },

    illustration: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },

    circle: {
      width: 230,
      height: 230,
      maxWidth: "100%",
      borderRadius: 115,
      justifyContent: "center",
      alignItems: "center",
    },

    textContainer: {
      width: "100%",
      alignItems: "center",
      paddingBottom: 15,
    },

    title: {
      fontSize: 29,
      fontWeight: "700",
      color: theme.text,
      textAlign: "center",
      flexShrink: 1,
    },

    description: {
      fontSize: 15,
      lineHeight: 25,
      color: theme.muted,
      textAlign: "center",
      marginTop: 15,
      flexShrink: 1,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.illustration}>
        <View
          style={[
            styles.circle,
            { backgroundColor: `${color}25` },
          ]}
        >
          <Ionicons
            name={icon as any}
            size={85}
            color={color}
          />
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.description}>
          {description}
        </Text>
      </View>
    </View>
  );
}
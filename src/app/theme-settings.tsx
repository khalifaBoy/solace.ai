import { ThemeName, useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const themeOptions: {
  name: ThemeName;
  title: string;
  description: string;
  colors: string[];
}[] = [
  {
    name: "light",
    title: "Light",
    description: "Soft and minimal",
    colors: ["#FAF8F5", "#FFFFFF", "#A99BEF"],
  },
  {
    name: "dark",
    title: "Dark",
    description: "Easy on the eyes",
    colors: ["#171622", "#222130", "#A99BEF"],
  },
  {
    name: "ocean",
    title: "Ocean",
    description: "Fresh and peaceful",
    colors: ["#F0F8FA", "#FFFFFF", "#329EAE"],
  },
  {
    name: "forest",
    title: "Forest",
    description: "Natural and relaxing",
    colors: ["#F4F6EF", "#FFFFFF", "#78966A"],
  },
];

export default function ThemeSettingsScreen() {
  const router = useRouter();
  const { theme, themeName, setTheme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            styles.backButton,
            { backgroundColor: theme.surface },
          ]}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={theme.text}
          />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Appearance
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.heading, { color: theme.text }]}>
          Choose your theme
        </Text>

        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Make Solace feel comfortable for you.
        </Text>

        {themeOptions.map((option) => {
          const selected = themeName === option.name;

          return (
            <TouchableOpacity
              key={option.name}
              activeOpacity={0.8}
              onPress={() => setTheme(option.name)}
              style={[
                styles.themeCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: selected
                    ? theme.primary
                    : theme.border,
                  borderWidth: selected ? 2 : 1,
                },
              ]}
            >
              <View style={styles.preview}>
                {option.colors.map((color, index) => (
                  <View
                    key={index}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color },
                    ]}
                  />
                ))}
              </View>

              <View style={styles.themeInfo}>
                <Text
                  style={[
                    styles.themeTitle,
                    { color: theme.text },
                  ]}
                >
                  {option.title}
                </Text>

                <Text
                  style={[
                    styles.themeDescription,
                    { color: theme.muted },
                  ]}
                >
                  {option.description}
                </Text>
              </View>

              <Ionicons
                name={
                  selected
                    ? "checkmark-circle"
                    : "ellipse-outline"
                }
                size={24}
                color={selected ? theme.primary : theme.muted}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 35,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: "700",
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 28,
  },
  themeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 17,
    borderRadius: 18,
    marginBottom: 15,
  },
  preview: {
    flexDirection: "row",
    marginRight: 15,
  },
  colorCircle: {
    width: 25,
    height: 25,
    borderRadius: 13,
    marginRight: -7,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  themeInfo: {
    flex: 1,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  themeDescription: {
    fontSize: 12,
  },
});
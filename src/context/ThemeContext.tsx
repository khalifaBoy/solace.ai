import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

export type ThemeName = "light" | "dark" | "ocean" | "forest";

export interface AppTheme {
  name: ThemeName;
  background: string;
  surface: string;
  card: string;
  primary: string;
  secondary: string;
  text: string;
  muted: string;
  border: string;
  input: string;
  tabBar: string;
  success: string;
  danger: string;
}

const themes: Record<ThemeName, AppTheme> = {
  light: {
    name: "light",
    background: "#FAF8F5",
    surface: "#FFFFFF",
    card: "#F2EEFA",
    primary: "#A99BEF",
    secondary: "#E8E1FA",
    text: "#29243A",
    muted: "#898397",
    border: "#EAE6F0",
    input: "#F5F2F8",
    tabBar: "#FFFFFF",
    success: "#69A88A",
    danger: "#E47777",
  },

  dark: {
    name: "dark",
    background: "#171622",
    surface: "#222130",
    card: "#2C293D",
    primary: "#A99BEF",
    secondary: "#39334F",
    text: "#F5F2FC",
    muted: "#AAA5BA",
    border: "#393648",
    input: "#2C293D",
    tabBar: "#222130",
    success: "#78C6A0",
    danger: "#F08080",
  },

  ocean: {
    name: "ocean",
    background: "#F0F8FA",
    surface: "#FFFFFF",
    card: "#DDF1F3",
    primary: "#329EAE",
    secondary: "#C8E9ED",
    text: "#173B45",
    muted: "#718F96",
    border: "#D4E8EB",
    input: "#E7F3F5",
    tabBar: "#FFFFFF",
    success: "#5B9D83",
    danger: "#D96F76",
  },

  forest: {
    name: "forest",
    background: "#F4F6EF",
    surface: "#FFFFFF",
    card: "#E4EBDD",
    primary: "#78966A",
    secondary: "#D7E3CE",
    text: "#2C3B2A",
    muted: "#87927F",
    border: "#DEE5D7",
    input: "#EBF0E6",
    tabBar: "#FFFFFF",
    success: "#67966D",
    danger: "#D97970",
  },
};

interface ThemeContextType {
  theme: AppTheme;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => Promise<void>;
  isThemeLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

const THEME_STORAGE_KEY = "solace-app-theme";

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [themeName, setThemeName] = useState<ThemeName>("light");
  const [isThemeLoading, setIsThemeLoading] = useState(true);

  useEffect(() => {
    async function loadTheme() {
      try {
        const savedTheme = await AsyncStorage.getItem(
          THEME_STORAGE_KEY
        );

        if (
          savedTheme &&
          Object.prototype.hasOwnProperty.call(themes, savedTheme)
        ) {
          setThemeName(savedTheme as ThemeName);
        }
      } catch (error) {
        console.error("Unable to load theme:", error);
      } finally {
        setIsThemeLoading(false);
      }
    }

    loadTheme();
  }, []);

  const setTheme = async (name: ThemeName) => {
    try {
      setThemeName(name);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, name);
    } catch (error) {
      console.error("Unable to save theme:", error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: themes[themeName],
        themeName,
        setTheme,
        isThemeLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}
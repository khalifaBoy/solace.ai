import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

import FadeInView from "../components/animations/FadeInView";
import PulseView from "../components/animations/PulseView";
import ScaleInView from "../components/animations/ScaleInView";
import SlideInView from "../components/animations/SlideInView";


export default function SplashScreen() {
  const { loading, user } = useAuth();
  const { theme, isThemeLoading } = useTheme();

  useEffect(() => {
    if (loading || isThemeLoading) return;

    let isActive = true;

    const navigateUser = async () => {
      try {
        const onboardingCompleted = await AsyncStorage.getItem(
          "@solace/onboarding_completed"
        );

        // Keep the splash screen visible for at least 2 seconds.
        await new Promise((resolve) => setTimeout(resolve, 5000));

        if (!isActive) return;

        if (user) {
          router.replace("/(tabs)/companion");
        } else if (onboardingCompleted === "true") {
          router.replace("/(auth)/login");
        } else {
          router.replace("/onboarding");
        }
      } catch (error) {
        console.error("Splash navigation error:", error);

        if (isActive) {
          router.replace("/onboarding");
        }
      }
    };

    navigateUser();

    return () => {
      isActive = false;
    };
  }, [loading, isThemeLoading, user]);

  return (
    <LinearGradient
      colors={[
        theme.secondary,
        theme.background,
        theme.background,
      ]}
      style={styles.container}
    >
      <View style={styles.content}>
        <PulseView minScale={1} maxScale={1.06} duration={1500}>
        <ScaleInView delay={200} initialScale={0.5}>
            <View
              style={[
                styles.logoContainer,
                { backgroundColor: theme.card },
              ]}
              >
              <Ionicons
                name="flower-outline"
                size={55}
                color={theme.primary}
                />
            </View>
            </ScaleInView>
            </PulseView>
            
        <FadeInView delay={450} duration={800}>
        <Text style={[styles.title, { color: theme.text }]}>
          solace
        </Text>
        </FadeInView>

        <SlideInView
          direction="bottom"
          distance={20}
          delay={650}
          duration={700}
        >
        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Your space to feel better.
        </Text>
        </SlideInView>

      </View>

      <View style={styles.footer}>
        <ActivityIndicator
          size="small"
          color={theme.primary}
        />
          <FadeInView delay={900} duration={700}>
        <Text style={[styles.footerText,{ color: theme.muted }]}>
          Made with care for your mind
        </Text>
          </FadeInView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    alignItems: "center",
  },

  logoContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 42,
    fontWeight: "700",
    letterSpacing: 2,
  },

  subtitle: {
    fontSize: 15,
    marginTop: 10,
  },

  footer: {
    position: "absolute",
    bottom: 55,
    alignItems: "center",
    gap: 12,
  },

  footerText: {
    fontSize: 12,
    textAlign: "center",
    writingDirection: "ltr",
  },
});
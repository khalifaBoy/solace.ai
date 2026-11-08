import { useMemo, useState } from "react";

import {
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import OnboardingSlide from "@/components/onboarding/OnboardingSlide";
import Pagination from "@/components/onboarding/Pagination";

import FadeInView from "@/components/animations/FadeInView";
import PressableScale from "@/components/animations/PressableScale";
import ScaleInView from "@/components/animations/ScaleInView";
import SlideInView from "@/components/animations/SlideInView";
import StaggeredList from "@/components/animations/StaggeredList";

import { onboardingData } from "@/constants/onboarding";
import { useTheme } from "@/context/ThemeContext";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const { theme } = useTheme();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<
    "left" | "right"
  >("right");

  const isLastSlide =
    currentIndex === onboardingData.length - 1;

  const finishOnboarding = async () => {
    try {
      await AsyncStorage.setItem(
        "@solace/onboarding_completed",
        "true"
      );
    } catch (error) {
      console.error("Unable to save onboarding status:", error);
    }

    router.replace("/signup");
  };

  const nextSlide = () => {
    if (isLastSlide) {
      finishOnboarding();
      return;
    }

    setSlideDirection("right");
    setCurrentIndex((previous) => previous + 1);
  };

  const previousSlide = () => {
    if (currentIndex === 0) return;

    setSlideDirection("left");
    setCurrentIndex((previous) => previous - 1);
  };

  const skipOnboarding = () => {
    finishOnboarding();
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return (
            Math.abs(gestureState.dx) > 15 &&
            Math.abs(gestureState.dx) >
              Math.abs(gestureState.dy) * 1.2
          );
        },

        onPanResponderRelease: (_, gestureState) => {
          const swipeThreshold = 50;

          if (gestureState.dx < -swipeThreshold) {
            nextSlide();
          } else if (gestureState.dx > swipeThreshold) {
            previousSlide();
          }
        },
      }),
    [currentIndex, isLastSlide]
  );

  const currentSlide = onboardingData[currentIndex];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: 55,
    },

    header: {
      paddingHorizontal: 25,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    logo: {
      fontSize: 25,
      fontWeight: "800",
      color: theme.text,
    },

    skip: {
      fontSize: 15,
      color: theme.muted,
    },

    content: {
      flex: 1,
      width: "100%",
    },

    swipeArea: {
      flex: 1,
      width: "100%",
    },

    slideWrapper: {
      flex: 1,
      width: "100%",
    },

    footer: {
      paddingHorizontal: 30,
      paddingBottom: 35,
      alignItems: "center",
      gap: 22,
    },

    footerText: {
      fontSize: 12,
      color: theme.muted,
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <FadeInView duration={600}>
        <View style={styles.header}>
          <ScaleInView
            initialScale={0.7}
            delay={100}
            duration={500}
          >
            <Text style={styles.logo}>solace.</Text>
          </ScaleInView>

          {!isLastSlide && (
            <FadeInView delay={250} duration={500}>
              <PressableScale
                onPress={skipOnboarding}
                pressedScale={0.94}
              >
                <Text style={styles.skip}>Skip</Text>
              </PressableScale>
            </FadeInView>
          )}
        </View>
      </FadeInView>

      {/* Swipeable Content */}
      <View style={styles.content}>
        <View
          style={styles.swipeArea}
          {...panResponder.panHandlers}
        >
          <SlideInView
            key={currentIndex}
            direction={slideDirection}
            distance={45}
            duration={450}
            style={styles.slideWrapper}
          >
            <OnboardingSlide
              title={currentSlide.title}
              description={currentSlide.description}
              icon={currentSlide.icon}
              color={currentSlide.color}
            />
          </SlideInView>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <StaggeredList index={0} staggerDelay={120}>
          <Pagination
            currentIndex={currentIndex}
            total={onboardingData.length}
          />
        </StaggeredList>

        <StaggeredList index={1} staggerDelay={120}>
          <Text style={styles.footerText}>
            {isLastSlide
              ? "Swipe left to begin your journey."
              : "Swipe left or right to explore."}
          </Text>
        </StaggeredList>
      </View>
    </View>
  );
}
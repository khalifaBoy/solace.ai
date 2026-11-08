import { useEffect, useRef, useState } from "react";

import {
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

const affirmations = [
  "I am allowed to grow at my own pace. Every small step matters.",
  "I deserve kindness, patience, and understanding.",
  "I am stronger than the challenges I face.",
  "I choose progress over perfection.",
  "I give myself permission to rest and recharge.",
  "I am becoming a better version of myself every day.",
  "My feelings are valid, and I deserve to be heard.",
  "I can handle today one step at a time.",
  "I am proud of how far I have come.",
  "I choose to focus on what I can control.",
  "I am worthy of love, peace, and happiness.",
  "Small steps every day lead to meaningful change.",
  "I trust myself to find my way forward.",
  "I don't need to have everything figured out today.",
];

function getDailyAffirmationIndex() {
  const now = new Date();

  const dayNumber = Math.floor(
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime() / 86400000
  );

  const sixHourSlot = Math.floor(now.getHours() / 6);

  return (dayNumber * 4 + sixHourSlot) % affirmations.length;
}

export default function AffirmationCard() {
  const { theme } = useTheme();

  const [currentIndex, setCurrentIndex] = useState(
    getDailyAffirmationIndex()
  );

  const indexRef = useRef(currentIndex);

  const scheduledIndexRef = useRef(
    getDailyAffirmationIndex()
  );

  // Update automatically when a new 6-hour period begins.
  useEffect(() => {
    const interval = setInterval(() => {
      const newScheduledIndex = getDailyAffirmationIndex();

      if (newScheduledIndex !== scheduledIndexRef.current) {
        scheduledIndexRef.current = newScheduledIndex;
        indexRef.current = newScheduledIndex;
        setCurrentIndex(newScheduledIndex);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const changeAffirmation = (direction: number) => {
    const nextIndex =
      (indexRef.current + direction + affirmations.length) %
      affirmations.length;

    indexRef.current = nextIndex;
    setCurrentIndex(nextIndex);
  };

  // Detect left and right finger swipes.
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 15 &&
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy),

      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -40) {
          changeAffirmation(1);
        } else if (gestureState.dx > 40) {
          changeAffirmation(-1);
        }
      },
    })
  ).current;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.header}>
        <Ionicons
          name="sunny-outline"
          size={20}
          color={theme.primary}
        />

        <Text
          style={[
            styles.label,
            { color: theme.primary },
          ]}
        >
          TODAY'S AFFIRMATION
        </Text>
      </View>

      <Text
        style={[
          styles.quote,
          { color: theme.text },
        ]}
      >
        "{affirmations[currentIndex]}"
      </Text>

      <View style={styles.footerContainer}>
        <Text
          style={[
            styles.footer,
            { color: theme.muted },
          ]}
        >
          A gentle reminder for you 💛
        </Text>

        <View style={styles.swipeHint}>
          <Ionicons
            name="chevron-back"
            size={14}
            color={theme.primary}
          />

          <Text
            style={[
              styles.hintText,
              { color: theme.primary },
            ]}
          >
            Swipe
          </Text>

          <Ionicons
            name="chevron-forward"
            size={14}
            color={theme.primary}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 22,
    padding: 22,
    marginBottom: 22,
    borderWidth: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 17,
  },

  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },

  quote: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 29,
  },

  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 17,
  },

  footer: {
    fontSize: 12,
  },

  swipeHint: {
    flexDirection: "row",
    alignItems: "center",
  },

  hintText: {
    fontSize: 11,
  },
});
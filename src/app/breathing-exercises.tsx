import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Animated, {
    cancelAnimation,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";

import FadeInView from "@/components/animations/FadeInView";
import PressableScale from "@/components/animations/PressableScale";
import ScaleInView from "@/components/animations/ScaleInView";

const DURATIONS = [1, 3, 5, 10];

const INHALE_DURATION = 4;
const EXHALE_DURATION = 6;
const CYCLE_DURATION = INHALE_DURATION + EXHALE_DURATION;

export default function BreathingExercisesScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const [selectedDuration, setSelectedDuration] = useState(3);
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const scale = useSharedValue(0.8);

  const totalDuration = selectedDuration * 60;
  const remaining = Math.max(totalDuration - elapsed, 0);
  const finished = elapsed >= totalDuration && elapsed > 0;

  const cyclePosition = elapsed % CYCLE_DURATION;

  const isInhaling = cyclePosition < INHALE_DURATION;

  const phaseName = isInhaling ? "Inhale" : "Exhale";

  const phaseRemaining = isInhaling
    ? INHALE_DURATION - cyclePosition
    : CYCLE_DURATION - cyclePosition;

  // Session timer
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setElapsed((previous) => {
        const next = previous + 1;

        if (next >= totalDuration) {
          setIsRunning(false);
          return totalDuration;
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, totalDuration]);

  // Breathing circle animation
  useEffect(() => {
    if (!isRunning) {
      cancelAnimation(scale);
      return;
    }

    const duration = phaseRemaining * 1000;

    scale.value = withTiming(
      isInhaling ? 1.35 : 0.8,
      { duration }
    );

    return () => cancelAnimation(scale);
  }, [isRunning, isInhaling, elapsed, phaseRemaining, scale]);

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const startSession = () => {
    if (finished) {
      setElapsed(0);
      scale.value = 0.8;
    }

    setIsRunning(true);
  };

  const pauseSession = () => {
    setIsRunning(false);
  };

  const resetSession = () => {
    setIsRunning(false);
    setElapsed(0);
    scale.value = 0.8;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
      edges={["top"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <FadeInView>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={[styles.backText, { color: theme.primary }]}>
              ← Back
            </Text>
          </Pressable>

          <Text style={[styles.heading, { color: theme.text }]}>
            Breathing Exercises
          </Text>

          <Text style={[styles.subtitle, { color: theme.muted }]}>
            Slow down, relax and reconnect with yourself.
          </Text>
        </FadeInView>

        {/* Exercise Information */}
        <FadeInView delay={100}>
          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.exerciseTitle, { color: theme.text }]}>
              Calm Breathing
            </Text>

            <Text style={[styles.description, { color: theme.muted }]}>
              A gentle breathing rhythm designed to help you relax.
            </Text>

            <View style={styles.patternContainer}>
              <View
                style={[
                  styles.patternItem,
                  { backgroundColor: theme.secondary },
                ]}
              >
                <Text style={[styles.patternNumber, { color: theme.text }]}>
                  4s
                </Text>
                <Text style={[styles.patternLabel, { color: theme.muted }]}>
                  Inhale
                </Text>
              </View>

              <Text style={[styles.patternArrow, { color: theme.primary }]}>
                →
              </Text>

              <View
                style={[
                  styles.patternItem,
                  { backgroundColor: theme.secondary },
                ]}
              >
                <Text style={[styles.patternNumber, { color: theme.text }]}>
                  6s
                </Text>
                <Text style={[styles.patternLabel, { color: theme.muted }]}>
                  Exhale
                </Text>
              </View>
            </View>
          </View>
        </FadeInView>

        {/* Duration Selection */}
        {!isRunning && elapsed === 0 && (
          <FadeInView delay={200}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Session duration
            </Text>

            <View style={styles.durationContainer}>
              {DURATIONS.map((duration) => {
                const selected = selectedDuration === duration;

                return (
                  <Pressable
                    key={duration}
                    onPress={() => setSelectedDuration(duration)}
                    style={[
                      styles.durationButton,
                      {
                        backgroundColor: selected
                          ? theme.primary
                          : theme.card,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: selected ? "#FFFFFF" : theme.text,
                        fontWeight: "600",
                      }}
                    >
                      {duration} min
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </FadeInView>
        )}

        {/* Breathing Animation */}
        <ScaleInView style={styles.sessionContainer}>
          <Text style={[styles.sessionTitle, { color: theme.text }]}>
            {finished ? "Session completed" : "Follow the rhythm"}
          </Text>

          <View style={styles.animationContainer}>
            <Animated.View
              style={[
                styles.breathingCircle,
                {
                  backgroundColor: theme.secondary,
                  borderColor: theme.primary,
                },
                animatedCircleStyle,
              ]}
            >
              <Text style={[styles.phaseText, { color: theme.text }]}>
                {finished
                  ? "Done"
                  : isRunning
                    ? phaseName
                    : "Breathe"}
              </Text>

              {isRunning && (
                <Text style={[styles.phaseTimer, { color: theme.muted }]}>
                  {phaseRemaining}s
                </Text>
              )}
            </Animated.View>
          </View>

          <Text style={[styles.timer, { color: theme.text }]}>
            {formatTime(remaining)}
          </Text>

          <Text style={[styles.instruction, { color: theme.muted }]}>
            {finished
              ? "Well done! Take a moment to notice how you feel."
              : isRunning
                ? `Gently ${phaseName.toLowerCase()}`
                : "Take a comfortable position and get ready."}
          </Text>

          {/* Controls */}
          <View style={styles.controls}>
            {!isRunning ? (
              <PressableScale
                onPress={startSession}
                style={[
                  styles.primaryButton,
                  { backgroundColor: theme.primary },
                ]}
              >
                <Text style={styles.primaryButtonText}>
                  {finished
                    ? "Start Again"
                    : elapsed > 0
                      ? "Resume"
                      : "Start"}
                </Text>
              </PressableScale>
            ) : (
              <PressableScale
                onPress={pauseSession}
                style={[
                  styles.primaryButton,
                  { backgroundColor: theme.primary },
                ]}
              >
                <Text style={styles.primaryButtonText}>
                  Pause
                </Text>
              </PressableScale>
            )}

            {(isRunning || elapsed > 0) && (
              <PressableScale
                onPress={resetSession}
                style={[
                  styles.resetButton,
                  { borderColor: theme.border },
                ]}
              >
                <Text style={{ color: theme.text, fontWeight: "600" }}>
                  Reset
                </Text>
              </PressableScale>
            )}
          </View>
        </ScaleInView>

        <Text style={[styles.footer, { color: theme.muted }]}>
          Breathe comfortably. Stop if you feel dizzy or uncomfortable.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 15,
    paddingBottom: 35,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    fontSize: 15,
    fontWeight: "600",
  },
  heading: {
    fontSize: 27,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 22,
  },
  infoCard: {
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 25,
  },
  exerciseTitle: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 7,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
  },
  patternContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginTop: 20,
  },
  patternItem: {
    width: 95,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 14,
  },
  patternNumber: {
    fontSize: 20,
    fontWeight: "800",
  },
  patternLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  patternArrow: {
    fontSize: 23,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 13,
  },
  durationContainer: {
    flexDirection: "row",
    gap: 9,
    marginBottom: 25,
  },
  durationButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  sessionContainer: {
    alignItems: "center",
    marginTop: 15,
  },
  sessionTitle: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 25,
  },
  animationContainer: {
    height: 220,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  breathingCircle: {
    height: 155,
    width: 155,
    borderRadius: 100,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  phaseText: {
    fontSize: 21,
    fontWeight: "700",
  },
  phaseTimer: {
    fontSize: 14,
    marginTop: 5,
  },
  timer: {
    fontSize: 30,
    fontWeight: "800",
    marginTop: 15,
  },
  instruction: {
    fontSize: 13,
    marginTop: 8,
    textAlign: "center",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 25,
  },
  primaryButton: {
    paddingHorizontal: 35,
    paddingVertical: 15,
    borderRadius: 14,
    minWidth: 135,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  resetButton: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 14,
    borderWidth: 1,
  },
  footer: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 30,
    lineHeight: 18,
  },
});
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useTheme } from "@/context/ThemeContext";
import { completeActivity } from "@/services/api";

export default function ActivityScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const { title, description, duration } = useLocalSearchParams<{
    title: string;
    description: string;
    duration: string;
  }>();

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const durationInSeconds = (() => {
    const match = duration?.match(/\d+/);
    const minutes = match ? Number(match[0]) : 5;
    return minutes * 60;
  })();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 25,
      flexDirection: "row",
      alignItems: "center",
      gap: 15,
    },
    backButton: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor: theme.surface,
      justifyContent: "center",
      alignItems: "center",
    },
    heading: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
    },
    content: {
      padding: 24,
      alignItems: "center",
    },
    iconContainer: {
      width: 90,
      height: 90,
      borderRadius: 28,
      backgroundColor: theme.primary,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 35,
      marginBottom: 22,
    },
    title: {
      fontSize: 25,
      fontWeight: "700",
      color: theme.text,
      textAlign: "center",
    },
    durationBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
      backgroundColor: theme.secondary,
      paddingHorizontal: 15,
      paddingVertical: 9,
      borderRadius: 20,
      marginTop: 15,
    },
    duration: {
      color: theme.primary,
      fontSize: 13,
      fontWeight: "600",
    },
    descriptionCard: {
      width: "100%",
      backgroundColor: theme.surface,
      padding: 20,
      borderRadius: 18,
      marginTop: 35,
      borderWidth: 1,
      borderColor: theme.border,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 12,
    },
    description: {
      fontSize: 14,
      color: theme.muted,
      lineHeight: 23,
    },
    startButton: {
      width: "100%",
      backgroundColor: theme.primary,
      padding: 17,
      borderRadius: 15,
      marginTop: 30,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
    },
    startButtonText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "700",
    },
    timerContainer: {
      width: "100%",
      backgroundColor: theme.secondary,
      borderRadius: 22,
      padding: 25,
      alignItems: "center",
      marginTop: 25,
    },
    timerLabel: {
      fontSize: 14,
      color: theme.primary,
      fontWeight: "600",
    },
    timer: {
      fontSize: 48,
      fontWeight: "700",
      color: theme.text,
      marginTop: 12,
      letterSpacing: 3,
    },
    controls: {
      width: "100%",
      marginTop: 25,
      gap: 12,
    },
    pauseButton: {
      backgroundColor: theme.secondary,
      padding: 17,
      borderRadius: 15,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
    },
    pauseButtonText: {
      color: theme.primary,
      fontSize: 15,
      fontWeight: "700",
    },
    resetButton: {
      padding: 14,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
    },
    resetButtonText: {
      color: theme.muted,
      fontSize: 14,
      fontWeight: "600",
    },
    completionCard: {
      width: "100%",
      backgroundColor: theme.secondary,
      padding: 20,
      borderRadius: 18,
      alignItems: "center",
      marginTop: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    completionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.success,
      marginTop: 10,
    },
    completionText: {
      fontSize: 13,
      color: theme.text,
      textAlign: "center",
      lineHeight: 21,
      marginTop: 8,
    },
    completeButton: {
      width: "100%",
      padding: 15,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: theme.success,
      backgroundColor: theme.secondary,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 9,
      marginTop: 15,
    },
    completeButtonText: {
      color: theme.success,
      fontSize: 14,
      fontWeight: "700",
    },
    errorText: {
      color: theme.danger,
      fontSize: 13,
      marginTop: 10,
      textAlign: "center",
    },
  });

  const handleCompleteActivity = async () => {
    if (saving || isCompleted) return;

    try {
      setSaving(true);
      setSaveError("");
      setIsRunning(false);

      await completeActivity(
        title || "Wellness Activity",
        duration || "5 minutes",
      );

      setIsCompleted(true);
      setTimeLeft(0);
    } catch (error) {
      console.error("Save Activity Error:", error);

      setSaveError(
        error instanceof Error
          ? error.message
          : "Unable to save activity.",
      );
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          void handleCompleteActivity();
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const startActivity = () => {
    if (timeLeft === 0) {
      setTimeLeft(durationInSeconds);
    }

    setIsCompleted(false);
    setIsRunning(true);
  };

  const pauseActivity = () => {
    setIsRunning(false);
  };

  const resetActivity = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setTimeLeft(0);
    setSaveError("");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </Pressable>

        <Text style={styles.heading}>Activity Details</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="sparkles-outline"
            size={38}
            color="#FFFFFF"
          />
        </View>

        <Text style={styles.title}>{title}</Text>

        <View style={styles.durationBadge}>
          <Ionicons name="time-outline" size={16} color={theme.primary} />
          <Text style={styles.duration}>{duration}</Text>
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>
            {isCompleted
              ? "Activity Completed!"
              : isRunning
                ? "Time Remaining"
                : "Ready when you are"}
          </Text>

          <Text style={styles.timer}>
            {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
            {String(timeLeft % 60).padStart(2, "0")}
          </Text>
        </View>

        {isCompleted && (
          <View style={styles.completionCard}>
            <Ionicons
              name="checkmark-circle"
              size={32}
              color={theme.success}
            />

            <Text style={styles.completionTitle}>
              Well Done! 🎉
            </Text>

            <Text style={styles.completionText}>
              You took a moment for yourself. Keep making time for your
              wellbeing.
            </Text>
          </View>
        )}

        <View style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>About this activity</Text>

          <Text style={styles.description}>{description}</Text>
        </View>

        <View style={styles.controls}>
          {!isRunning ? (
            <Pressable
              style={styles.startButton}
              onPress={startActivity}
              disabled={saving}
            >
              <Ionicons
                name={isCompleted ? "refresh" : "play"}
                size={19}
                color="#FFFFFF"
              />

              <Text style={styles.startButtonText}>
                {isCompleted
                  ? "Start Again"
                  : timeLeft > 0
                    ? "Resume Activity"
                    : "Start Activity"}
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.pauseButton}
              onPress={pauseActivity}
            >
              <Ionicons name="pause" size={19} color={theme.primary} />
              <Text style={styles.pauseButtonText}>Pause</Text>
            </Pressable>
          )}

          {(timeLeft > 0 || isCompleted) && (
            <Pressable
              style={styles.resetButton}
              onPress={resetActivity}
            >
              <Ionicons
                name="refresh-outline"
                size={19}
                color={theme.muted}
              />
              <Text style={styles.resetButtonText}>Reset</Text>
            </Pressable>
          )}
        </View>

        {!isCompleted && (
          <Pressable
            style={styles.completeButton}
            onPress={handleCompleteActivity}
            disabled={saving}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={theme.success}
            />

            <Text style={styles.completeButtonText}>
              {saving ? "Saving..." : "Mark as Completed"}
            </Text>
          </Pressable>
        )}

        {saveError !== "" && (
          <Text style={styles.errorText}>{saveError}</Text>
        )}
      </View>
    </ScrollView>
  );
}
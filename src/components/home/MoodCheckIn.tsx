import { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useTheme } from "@/context/ThemeContext";

import {
  getTodayMoodAssessment,
  type DailyMoodAssessment,
} from "@/services/api";

import FadeInView from "@/components/animations/FadeInView";
import PressableScale from "@/components/animations/PressableScale";
import PulseView from "@/components/animations/PulseView";
import ScaleInView from "@/components/animations/ScaleInView";
import SlideInView from "@/components/animations/SlideInView";
import StaggeredList from "@/components/animations/StaggeredList";

export default function MoodCheckIn() {
  const router = useRouter();
  const { theme } = useTheme();

  const [assessment, setAssessment] =
    useState<DailyMoodAssessment | null>(null);

  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadAssessment = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await getTodayMoodAssessment();

      setCompleted(response.completed);
      setAssessment(response.assessment);
    } catch (err) {
      console.error("Mood Check-in Error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssessment();
  }, [loadAssessment]);

  const startAssessment = () => {
    router.push("/mood-assessment");
  };

  return (
    <FadeInView duration={600}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        {/* Animated Header */}
        <FadeInView duration={500}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: theme.text }]}>
                Mood Check-in
              </Text>

              <Text style={[styles.subtitle, { color: theme.muted }]}>
                Your daily emotional wellness check-in
              </Text>
            </View>

            <PulseView minScale={1} maxScale={1.08}>
              <Ionicons
                name="heart-circle-outline"
                size={30}
                color={theme.primary}
              />
            </PulseView>
          </View>
        </FadeInView>

        {/* Loading */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <PulseView>
              <ActivityIndicator
                color={theme.primary}
                size="large"
              />
            </PulseView>

            <Text style={[styles.loadingText, { color: theme.muted }]}>
              Checking today's assessment...
            </Text>
          </View>
        ) : error ? (
          /* Error */
          <FadeInView>
            <View style={styles.statusContainer}>
              <Text style={[styles.statusText, { color: theme.muted }]}>
                Unable to load your mood check-in.
              </Text>

              <PressableScale
                onPress={loadAssessment}
                style={[
                  styles.retryButton,
                  { backgroundColor: theme.secondary },
                ]}
              >
                <Text
                  style={[
                    styles.retryButtonText,
                    { color: theme.primary },
                  ]}
                >
                  Try Again
                </Text>
              </PressableScale>
            </View>
          </FadeInView>
        ) : completed && assessment ? (
          /* Completed Assessment */
          <View>
            <StaggeredList index={0}>
              <View style={styles.completedHeader}>
                <ScaleInView>
                  <View
                    style={[
                      styles.completedIcon,
                      { backgroundColor: theme.secondary },
                    ]}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={theme.success}
                    />
                  </View>
                </ScaleInView>

                <Text
                  style={[
                    styles.completedText,
                    { color: theme.success },
                  ]}
                >
                  Today's check-in completed
                </Text>
              </View>
            </StaggeredList>

            {/* Animated Mood Score */}
            <StaggeredList index={1}>
              <ScaleInView initialScale={0.9}>
                <View
                  style={[
                    styles.scoreContainer,
                    { backgroundColor: theme.card },
                  ]}
                >
                  <Text
                    style={[
                      styles.scoreLabel,
                      { color: theme.muted },
                    ]}
                  >
                    Your mood score
                  </Text>

                  <Text style={[styles.score, { color: theme.primary }]}>
                    {assessment.mood}
                    <Text
                      style={[
                        styles.outOf,
                        { color: theme.muted },
                      ]}
                    >
                      {" "}/ 5
                    </Text>
                  </Text>
                </View>
              </ScaleInView>
            </StaggeredList>

            {/* Emotion */}
            <StaggeredList index={2}>
              <View style={styles.emotionContainer}>
                <Text
                  style={[
                    styles.emotionLabel,
                    { color: theme.muted },
                  ]}
                >
                  Detected emotion
                </Text>

                <Text
                  style={[
                    styles.emotion,
                    { color: theme.text },
                  ]}
                >
                  {assessment.emotion}
                </Text>
              </View>
            </StaggeredList>

            {/* Explanation */}
            <StaggeredList index={3}>
              <Text
                style={[
                  styles.explanation,
                  { color: theme.muted },
                ]}
              >
                {assessment.explanation}
              </Text>
            </StaggeredList>

            {/* Recommendation */}
            <SlideInView
              direction="bottom"
              distance={20}
              delay={400}
            >
              <View
                style={[
                  styles.recommendationContainer,
                  { backgroundColor: theme.card },
                ]}
              >
                <View style={styles.recommendationHeader}>
                  <Ionicons
                    name="sparkles-outline"
                    size={18}
                    color={theme.primary}
                  />

                  <Text
                    style={[
                      styles.recommendationTitle,
                      { color: theme.primary },
                    ]}
                  >
                    Your recommendation
                  </Text>
                </View>

                <Text
                  style={[
                    styles.recommendation,
                    { color: theme.text },
                  ]}
                >
                  {assessment.recommendation}
                </Text>
              </View>
            </SlideInView>
          </View>
        ) : (
          /* Incomplete Assessment */
          <View style={styles.incompleteContainer}>
            <ScaleInView initialScale={0.7}>
              <PulseView minScale={1} maxScale={1.05}>
                <View
                  style={[
                    styles.illustration,
                    { backgroundColor: theme.card },
                  ]}
                >
                  <Ionicons
                    name="leaf-outline"
                    size={32}
                    color={theme.primary}
                  />
                </View>
              </PulseView>
            </ScaleInView>

            <FadeInView delay={150}>
              <Text
                style={[
                  styles.incompleteTitle,
                  { color: theme.text },
                ]}
              >
                Take a moment for yourself
              </Text>
            </FadeInView>

            <FadeInView delay={250}>
              <Text
                style={[
                  styles.incompleteDescription,
                  { color: theme.muted },
                ]}
              >
                Answer five simple questions about your mood, sleep, energy,
                stress, and daily well-being.
              </Text>
            </FadeInView>

            <SlideInView direction="bottom" delay={350}>
              <PressableScale
                style={[
                  styles.startButton,
                  { backgroundColor: theme.primary },
                ]}
                onPress={startAssessment}
              >
                <Text style={styles.startButtonText}>
                  Start Mood Check-in
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="#FFFFFF"
                />
              </PressableScale>
            </SlideInView>
          </View>
        )}
      </View>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 22,
    padding: 20,
    marginBottom: 22,
    borderWidth: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 13,
    marginTop: 6,
  },

  loadingContainer: {
    paddingVertical: 25,
    alignItems: "center",
    gap: 12,
  },

  loadingText: {
    fontSize: 13,
  },

  statusContainer: {
    alignItems: "center",
    paddingVertical: 15,
  },

  statusText: {
    fontSize: 13,
    marginBottom: 15,
  },

  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 12,
  },

  retryButtonText: {
    fontWeight: "600",
  },

  completedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },

  completedIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  completedText: {
    fontSize: 13,
    fontWeight: "600",
  },

  scoreContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },

  scoreLabel: {
    fontSize: 12,
  },

  score: {
    fontSize: 32,
    fontWeight: "700",
    marginTop: 5,
  },

  outOf: {
    fontSize: 17,
  },

  emotionContainer: {
    marginBottom: 12,
  },

  emotionLabel: {
    fontSize: 11,
    marginBottom: 5,
  },

  emotion: {
    fontSize: 16,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  explanation: {
    fontSize: 13,
    lineHeight: 21,
    marginBottom: 16,
  },

  recommendationContainer: {
    padding: 15,
    borderRadius: 14,
  },

  recommendationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 9,
  },

  recommendationTitle: {
    fontSize: 13,
    fontWeight: "700",
  },

  recommendation: {
    fontSize: 12,
    lineHeight: 20,
  },

  incompleteContainer: {
    alignItems: "center",
  },

  illustration: {
    width: 65,
    height: 65,
    borderRadius: 33,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  incompleteTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  incompleteDescription: {
    fontSize: 12,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },

  startButton: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  startButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
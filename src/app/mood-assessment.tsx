import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { submitDailyMoodAssessment } from "@/services/api";

const assessmentQuestions = [
  {
    question: "How have you been feeling emotionally today?",
    options: [
      "Very positive",
      "Mostly good",
      "Neutral",
      "A little low",
      "Very low",
    ],
  },
  {
    question: "How would you describe your sleep last night?",
    options: ["Very restful", "Good", "Average", "Poor", "Very poor"],
  },
  {
    question: "How is your energy level today?",
    options: ["Very energetic", "High", "Moderate", "Low", "Exhausted"],
  },
  {
    question: "Have you experienced stress or anxiety today?",
    options: ["Not at all", "A little", "Moderately", "Quite a lot", "Extremely"],
  },
  {
    question: "How well have you been managing your daily responsibilities?",
    options: [
      "Very well",
      "Well",
      "Somewhat",
      "With difficulty",
      "Not well at all",
    ],
  },
];

export default function MoodAssessmentScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      padding: 22,
      paddingTop: 35,
      paddingBottom: 45,
    },
    backButton: {
      alignSelf: "flex-start",
      marginBottom: 30,
    },
    backButtonText: {
      color: theme.primary,
      fontSize: 15,
      fontWeight: "600",
    },
    eyebrow: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 2,
      color: theme.primary,
      marginBottom: 10,
    },
    title: {
      fontSize: 30,
      fontWeight: "700",
      color: theme.text,
    },
    subtitle: {
      fontSize: 14,
      lineHeight: 22,
      color: theme.muted,
      marginTop: 10,
      marginBottom: 28,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 22,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    progressLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.muted,
    },
    progressCount: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.primary,
    },
    progressBackground: {
      height: 7,
      backgroundColor: theme.secondary,
      borderRadius: 10,
      overflow: "hidden",
      marginBottom: 30,
    },
    progressFill: {
      height: "100%",
      backgroundColor: theme.primary,
      borderRadius: 10,
    },
    questionNumber: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 1.5,
      color: theme.primary,
      marginBottom: 12,
    },
    question: {
      fontSize: 21,
      fontWeight: "700",
      lineHeight: 30,
      color: theme.text,
      marginBottom: 24,
    },
    optionsContainer: {
      gap: 12,
    },
    option: {
      minHeight: 56,
      paddingHorizontal: 15,
      paddingVertical: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.input,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    selectedOption: {
      backgroundColor: theme.secondary,
      borderColor: theme.primary,
      borderWidth: 1.5,
    },
    optionText: {
      flex: 1,
      fontSize: 14,
      color: theme.text,
    },
    selectedOptionText: {
      color: theme.primary,
      fontWeight: "600",
    },
    radioCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: theme.muted,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 12,
    },
    selectedRadioCircle: {
      borderColor: theme.primary,
    },
    radioDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.primary,
    },
    swipeHint: {
      marginTop: 20,
      alignItems: "center",
    },
    swipeHintText: {
      fontSize: 11,
      color: theme.muted,
      textAlign: "center",
    },
    navigation: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 22,
      gap: 12,
    },
    navigationButton: {
      flex: 1,
      minHeight: 50,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
    },
    previousButton: {
      backgroundColor: theme.secondary,
    },
    previousButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.primary,
    },
    nextButton: {
      backgroundColor: theme.primary,
    },
    nextButtonText: {
      fontSize: 14,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    disabledButton: {
      opacity: 0.45,
    },
    footerText: {
      fontSize: 12,
      lineHeight: 19,
      color: theme.muted,
      textAlign: "center",
      marginTop: 22,
      paddingHorizontal: 15,
    },
  });

  const selectAnswer = (answer: string) => {
    setAnswers((previous) => {
      const updated = [...previous];
      updated[currentQuestion] = answer;
      return updated;
    });
  };

  const goToNextQuestion = () => {
    if (!answers[currentQuestion] || submitting) return;

    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0 && !submitting) {
      setCurrentQuestion((previous) => previous - 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.length !== 5 || answers.some((answer) => !answer)) {
      Alert.alert("Incomplete assessment", "Please answer all five questions.");
      return;
    }

    try {
      setSubmitting(true);

      await submitDailyMoodAssessment(answers);

      Alert.alert(
        "Assessment completed",
        "Your daily mood check-in has been saved.",
        [
          {
            text: "Continue",
            onPress: () => router.replace("/(tabs)/mood"),
          },
        ],
      );
    } catch (error) {
      console.error("Mood Assessment Error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to submit your assessment.";

      Alert.alert("Submission failed", message);
    } finally {
      setSubmitting(false);
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) =>
      Math.abs(gestureState.dx) > 15 &&
      Math.abs(gestureState.dx) > Math.abs(gestureState.dy),

    onPanResponderRelease: (_, gestureState) => {
      if (submitting || Math.abs(gestureState.dx) < 60) return;

      if (gestureState.dx < 0) {
        if (answers[currentQuestion]) {
          if (currentQuestion < assessmentQuestions.length - 1) {
            goToNextQuestion();
          } else {
            handleSubmit();
          }
        }
      } else {
        goToPreviousQuestion();
      }
    },
  });

  const question = assessmentQuestions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];
  const isLastQuestion = currentQuestion === assessmentQuestions.length - 1;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.eyebrow}>DAILY WELLNESS</Text>

        <Text style={styles.title}>Mood Check-in</Text>

        <Text style={styles.subtitle}>
          Take a moment for yourself. Answer these five questions to help us
          understand how you're feeling today.
        </Text>

        <View style={styles.card} {...panResponder.panHandlers}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Your progress</Text>
            <Text style={styles.progressCount}>
              {currentQuestion + 1} of 5
            </Text>
          </View>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentQuestion + 1) / 5) * 100}%`,
                },
              ]}
            />
          </View>

          <Text style={styles.questionNumber}>
            QUESTION {String(currentQuestion + 1).padStart(2, "0")}
          </Text>

          <Text style={styles.question}>{question.question}</Text>

          <View style={styles.optionsContainer}>
            {question.options.map((option) => {
              const selected = selectedAnswer === option;

              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    selected && styles.selectedOption,
                  ]}
                  onPress={() => selectAnswer(option)}
                  disabled={submitting}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selected && styles.selectedOptionText,
                    ]}
                  >
                    {option}
                  </Text>

                  <View
                    style={[
                      styles.radioCircle,
                      selected && styles.selectedRadioCircle,
                    ]}
                  >
                    {selected && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.swipeHint}>
            <Text style={styles.swipeHintText}>
              {currentQuestion === 0
                ? "← Choose an answer, then swipe left"
                : isLastQuestion
                  ? "Swipe right to go back · Swipe left to submit →"
                  : "← Swipe right to go back · Swipe left for next →"}
            </Text>
          </View>

          <View style={styles.navigation}>
            <TouchableOpacity
              style={[
                styles.navigationButton,
                styles.previousButton,
                currentQuestion === 0 && styles.disabledButton,
              ]}
              onPress={goToPreviousQuestion}
              disabled={currentQuestion === 0 || submitting}
            >
              <Text style={styles.previousButtonText}>Previous</Text>
            </TouchableOpacity>

            {!isLastQuestion ? (
              <TouchableOpacity
                style={[
                  styles.navigationButton,
                  styles.nextButton,
                  !selectedAnswer && styles.disabledButton,
                ]}
                onPress={goToNextQuestion}
                disabled={!selectedAnswer || submitting}
              >
                <Text style={styles.nextButtonText}>Next →</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.navigationButton,
                  styles.nextButton,
                  (!selectedAnswer || submitting) && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={!selectedAnswer || submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.nextButtonText}>Submit</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text style={styles.footerText}>
          Your responses help Solace understand your emotional well-being.
        </Text>
      </View>
    </View>
  );
}
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { createMood } from "@/services/api";

import FadeInView from "@/components/animations/FadeInView";
import PressableScale from "@/components/animations/PressableScale";
import ScaleInView from "@/components/animations/ScaleInView";
import SlideInView from "@/components/animations/SlideInView";
import StaggeredList from "@/components/animations/StaggeredList";

const moods = [
  { score: 1, icon: "emoticon-cry-outline", label: "Very Low" },
  { score: 2, icon: "emoticon-sad-outline", label: "Low" },
  { score: 3, icon: "emoticon-neutral-outline", label: "Okay" },
  { score: 4, icon: "emoticon-happy-outline", label: "Good" },
  { score: 5, icon: "emoticon-excited-outline", label: "Great" },
] as const;

const emotions = [
  "Happy",
  "Calm",
  "Anxious",
  "Sad",
  "Angry",
  "Excited",
  "Stressed",
  "Grateful",
];

export default function MoodScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      padding: 22,
      paddingTop: 35,
      paddingBottom: 40,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.text,
    },
    subtitle: {
      fontSize: 14,
      color: theme.muted,
      marginTop: 8,
      marginBottom: 25,
      lineHeight: 21,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 18,
    },
    moodContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    moodItem: {
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 5,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      width: "19%",
    },
    selectedMood: {
      backgroundColor: theme.secondary,
      borderColor: theme.primary,
      borderWidth: 2,
    },
    moodLabel: {
      fontSize: 9,
      color: theme.muted,
      marginTop: 7,
      textAlign: "center",
    },
    emotionContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    emotionChip: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 20,
      backgroundColor: theme.input,
      borderWidth: 1,
      borderColor: theme.border,
    },
    selectedEmotion: {
      backgroundColor: theme.secondary,
      borderColor: theme.primary,
    },
    emotionText: {
      fontSize: 13,
      color: theme.muted,
    },
    selectedEmotionText: {
      color: theme.primary,
      fontWeight: "600",
    },
    noteInput: {
      minHeight: 110,
      backgroundColor: theme.input,
      borderRadius: 12,
      padding: 14,
      fontSize: 14,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
    },
    saveButton: {
      backgroundColor: theme.primary,
      paddingVertical: 16,
      borderRadius: 15,
      alignItems: "center",
      marginTop: 5,
    },
    disabledButton: {
      opacity: 0.5,
    },
    saveButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },
    historyButton: {
      backgroundColor: theme.secondary,
      paddingVertical: 15,
      borderRadius: 15,
      alignItems: "center",
      marginTop: 14,
      borderWidth: 1,
      borderColor: theme.border,
    },
    historyButtonText: {
      color: theme.primary,
      fontSize: 15,
      fontWeight: "700",
    },
  });

  const handleSaveMood = async () => {
    if (!selectedMood || !selectedEmotion) {
      return;
    }

    try {
      setSaving(true);

      const savedMood = await createMood(
        selectedMood,
        selectedEmotion,
        note
      );

      const message = "Your mood has been saved successfully!";

      if (typeof window !== "undefined") {
        window.alert(message);
      }

      setSelectedMood(null);
      setSelectedEmotion(null);
      setNote("");

      console.log("Saved mood:", savedMood);
    } catch (error) {
      console.error("Save Mood Error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to save your mood.";

      if (typeof window !== "undefined") {
        window.alert(message);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <FadeInView duration={600}>
        <Text style={styles.title}>Your Mood</Text>
      </FadeInView>

      <SlideInView direction="bottom" distance={15} delay={100}>
        <Text style={styles.subtitle}>
          Take a moment to understand how you're feeling.
        </Text>
      </SlideInView>

      {/* MOOD SELECTION */}
      <StaggeredList index={0} staggerDelay={150}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            How are you feeling today?
          </Text>

          <View style={styles.moodContainer}>
            {moods.map((item, index) => {
              const isSelected = selectedMood === item.score;

              return (
                <PressableScale
                  key={item.score}
                  style={[
                    styles.moodItem,
                    isSelected && styles.selectedMood,
                  ]}
                  onPress={() => setSelectedMood(item.score)}
                  pressedScale={0.9}
                >
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={32}
                    color={isSelected ? theme.primary : theme.text}
/>
                  <Text style={styles.moodLabel}>
                    {item.label}
                  </Text>
                </PressableScale>
              );
            })}
          </View>
        </View>
      </StaggeredList>

      {/* EMOTION SELECTION */}
      <StaggeredList index={1} staggerDelay={150}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            What best describes your feelings?
          </Text>

          <View style={styles.emotionContainer}>
            {emotions.map((emotion) => {
              const isSelected = selectedEmotion === emotion;

              return (
                <PressableScale
                  key={emotion}
                  style={[
                    styles.emotionChip,
                    isSelected && styles.selectedEmotion,
                  ]}
                  onPress={() => setSelectedEmotion(emotion)}
                  pressedScale={0.94}
                >
                  <Text
                    style={[
                      styles.emotionText,
                      isSelected && styles.selectedEmotionText,
                    ]}
                  >
                    {emotion}
                  </Text>
                </PressableScale>
              );
            })}
          </View>
        </View>
      </StaggeredList>

      {/* MOOD NOTES */}
      <StaggeredList index={2} staggerDelay={150}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Would you like to share more?
          </Text>

          <TextInput
            style={styles.noteInput}
            placeholder="Write about how your day is going..."
            placeholderTextColor={theme.muted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={note}
            onChangeText={setNote}
          />
        </View>
      </StaggeredList>

      {/* SAVE BUTTON */}
      <ScaleInView delay={350}>
        <PressableScale
          style={[
            styles.saveButton,
            ((!selectedMood || !selectedEmotion) || saving) &&
              styles.disabledButton,
          ]}
          disabled={!selectedMood || !selectedEmotion || saving}
          onPress={handleSaveMood}
          pressedScale={0.96}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Saving..." : "Save Mood"}
          </Text>
        </PressableScale>
      </ScaleInView>

      {/* MOOD HISTORY NAVIGATION */}
      <FadeInView delay={450}>
        <PressableScale
          style={styles.historyButton}
          onPress={() => router.push("/mood-history")}
          pressedScale={0.97}
        >
          <Text style={styles.historyButtonText}>
            View Mood History →
          </Text>
        </PressableScale>
      </FadeInView>
    </ScrollView>
  );
}
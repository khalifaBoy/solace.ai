import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

import {
  createJournalEntry,
  updateJournalEntry,
} from "@/services/api";

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

const moods = [
  { label: "Happy", emoji: "😊" },
  { label: "Calm", emoji: "😌" },
  { label: "Okay", emoji: "😐" },
  { label: "Sad", emoji: "😔" },
  { label: "Anxious", emoji: "😟" },
  { label: "Grateful", emoji: "🥰" },
];

export default function JournalWriteScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    content?: string;
    mood?: string;
  }>();

  const isEditing = Boolean(params.id);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState(params.title || "");
  const [content, setContent] = useState(params.content || "");
  const [selectedMood, setSelectedMood] = useState(params.mood || "");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 25,
      paddingBottom: 25,
      flexDirection: "row",
      alignItems: "center",
      gap: 18,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.text,
    },
    section: {
      paddingHorizontal: 24,
      marginBottom: 25,
    },
    label: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 12,
    },
    titleInput: {
      backgroundColor: theme.surface,
      borderRadius: 14,
      padding: 16,
      fontSize: 14,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
    },
    moodContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    moodCard: {
      backgroundColor: theme.surface,
      borderRadius: 14,
      padding: 12,
      minWidth: "30%",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },
    selectedMood: {
      backgroundColor: theme.secondary,
      borderColor: theme.primary,
    },
    moodEmoji: {
      fontSize: 25,
    },
    moodText: {
      fontSize: 12,
      color: theme.muted,
      marginTop: 6,
    },
    selectedMoodText: {
      color: theme.primary,
      fontWeight: "600",
    },
    contentInput: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 16,
      minHeight: 220,
      fontSize: 14,
      color: theme.text,
      lineHeight: 23,
      borderWidth: 1,
      borderColor: theme.border,
    },
    helperText: {
      fontSize: 12,
      color: theme.muted,
      marginTop: 10,
    },
    saveButton: {
      backgroundColor: theme.primary,
      padding: 17,
      borderRadius: 15,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
      marginHorizontal: 24,
    },
    saveButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "700",
    },
    errorText: {
      color: theme.danger,
      fontSize: 13,
      marginTop: 12,
      marginBottom: 20,
      textAlign: "center",
    },
  });

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !selectedMood) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (isEditing && params.id) {
        await updateJournalEntry(
          params.id,
          title.trim(),
          content.trim(),
          selectedMood
        );
      } else {
        await createJournalEntry(
          title.trim(),
          content.trim(),
          selectedMood
        );
      }

      if (isEditing) {
        router.replace({
          pathname: "/journal-detail",
          params: {
            id: params.id!,
            title: title.trim(),
            content: content.trim(),
            mood: selectedMood,
            createdAt: new Date().toISOString(),
          },
        });
      } else {
        router.back();
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save journal entry."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.text}
          />
        </Pressable>

        <Text style={styles.headerTitle}>
          {isEditing ? "Edit Journal Entry" : "Write Your Journal"}
        </Text>
      </View>

      {/* Title */}
      <View style={styles.section}>
        <Text style={styles.label}>Entry Title</Text>

        <TextInput
          style={styles.titleInput}
          placeholder="Give your thoughts a title..."
          placeholderTextColor={theme.muted}
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {/* Mood */}
      <View style={styles.section}>
        <Text style={styles.label}>How are you feeling?</Text>

        <View style={styles.moodContainer}>
          {moods.map((mood) => {
            const isSelected = selectedMood === mood.label;

            return (
              <Pressable
                key={mood.label}
                style={[
                  styles.moodCard,
                  isSelected && styles.selectedMood,
                ]}
                onPress={() => setSelectedMood(mood.label)}
              >
                <Text style={styles.moodEmoji}>
                  {mood.emoji}
                </Text>

                <Text
                  style={[
                    styles.moodText,
                    isSelected && styles.selectedMoodText,
                  ]}
                >
                  {mood.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Journal Content */}
      <View style={styles.section}>
        <Text style={styles.label}>Your Thoughts</Text>

        <TextInput
          style={styles.contentInput}
          placeholder="Write whatever is on your mind..."
          placeholderTextColor={theme.muted}
          multiline
          textAlignVertical="top"
          value={content}
          onChangeText={setContent}
        />

        <Text style={styles.helperText}>
          This is your personal space. Write freely, without judgment.
        </Text>
      </View>

      {/* Save */}
      <Pressable
        style={[
          styles.saveButton,
          saving && { opacity: 0.6 },
        ]}
        onPress={handleSave}
        disabled={saving}
      >
        <Ionicons
          name="bookmark-outline"
          size={19}
          color="#FFFFFF"
        />

        <Text style={styles.saveButtonText}>
          {saving
            ? "Saving..."
            : isEditing
              ? "Update Entry"
              : "Save Journal Entry"}
        </Text>
      </Pressable>

      {error !== "" && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </ScrollView>
  );
}
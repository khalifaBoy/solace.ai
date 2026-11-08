import { getMoods } from "@/services/api";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";

interface MoodEntry {
  id: string;
  mood: number;
  emotion: string;
  note?: string | null;
  createdAt: string;
}

const getMoodEmoji = (score: number) => {
  const emojis: Record<number, string> = {
    1: "😞",
    2: "😔",
    3: "😐",
    4: "🙂",
    5: "😄",
  };

  return emojis[score] || "😐";
};

export default function MoodHistoryScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    content: {
      padding: 22,
      paddingTop: 40,
      paddingBottom: 40,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 25,
      gap: 15,
    },

    backButton: {
      width: 42,
      height: 42,
      borderRadius: 13,
      backgroundColor: theme.surface,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },

    backText: {
      fontSize: 25,
      color: theme.text,
    },

    title: {
      fontSize: 25,
      fontWeight: "700",
      color: theme.text,
    },

    subtitle: {
      fontSize: 13,
      color: theme.muted,
      marginTop: 5,
    },

    summaryCard: {
      backgroundColor: theme.primary,
      borderRadius: 20,
      padding: 22,
      marginBottom: 30,
    },

    summaryLabel: {
      color: "#FFFFFF",
      fontSize: 14,
    },

    summaryCount: {
      fontSize: 38,
      fontWeight: "700",
      color: "#FFFFFF",
      marginTop: 8,
    },

    summaryDescription: {
      fontSize: 12,
      color: "#FFFFFF",
      marginTop: 5,
      lineHeight: 19,
    },

    historySection: {
      marginTop: 5,
    },

    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 18,
    },

    sectionTitle: {
      fontSize: 19,
      fontWeight: "700",
      color: theme.text,
    },

    refreshText: {
      color: theme.primary,
      fontSize: 13,
      fontWeight: "600",
    },

    historyCard: {
      backgroundColor: theme.surface,
      borderRadius: 17,
      padding: 17,
      marginBottom: 13,
      borderWidth: 1,
      borderColor: theme.border,
    },

    historyHeader: {
      flexDirection: "row",
      alignItems: "center",
    },

    moodEmoji: {
      fontSize: 31,
      marginRight: 13,
    },

    historyInfo: {
      flex: 1,
    },

    emotion: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.text,
    },

    date: {
      fontSize: 11,
      color: theme.muted,
      marginTop: 5,
    },

    scoreBadge: {
      backgroundColor: theme.secondary,
      paddingVertical: 7,
      paddingHorizontal: 11,
      borderRadius: 10,
    },

    score: {
      color: theme.primary,
      fontWeight: "700",
      fontSize: 13,
    },

    note: {
      fontSize: 13,
      color: theme.muted,
      marginTop: 14,
      lineHeight: 20,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: 12,
    },

    emptyCard: {
      backgroundColor: theme.surface,
      padding: 25,
      borderRadius: 17,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },

    emptyEmoji: {
      fontSize: 35,
      marginBottom: 12,
    },

    emptyTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 8,
    },

    emptyText: {
      fontSize: 13,
      color: theme.muted,
      textAlign: "center",
      lineHeight: 21,
    },

    retryButton: {
      backgroundColor: theme.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginTop: 15,
    },

    retryText: {
      color: "#FFFFFF",
      fontWeight: "600",
    },
  });

  const loadMoodHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMoods();
      setMoodHistory(data);
    } catch (err) {
      console.error("Mood History Error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load mood history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoodHistory();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.title}>Mood History</Text>
          <Text style={styles.subtitle}>
            Reflect on your emotional journey.
          </Text>
        </View>
      </View>

      {/* Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>
          Total Mood Entries
        </Text>

        <Text style={styles.summaryCount}>
          {moodHistory.length}
        </Text>

        <Text style={styles.summaryDescription}>
          Every entry is a step towards understanding yourself.
        </Text>
      </View>

      {/* History */}
      <View style={styles.historySection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Your Past Entries
          </Text>

          <TouchableOpacity onPress={loadMoodHistory}>
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={theme.primary}
          />
        ) : error ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>{error}</Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadMoodHistory}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : moodHistory.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🌱</Text>

            <Text style={styles.emptyTitle}>
              No mood entries yet
            </Text>

            <Text style={styles.emptyText}>
              Start recording your feelings to build your emotional
              history.
            </Text>
          </View>
        ) : (
          moodHistory.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.moodEmoji}>
                  {getMoodEmoji(item.mood)}
                </Text>

                <View style={styles.historyInfo}>
                  <Text style={styles.emotion}>
                    {item.emotion}
                  </Text>

                  <Text style={styles.date}>
                    {new Date(item.createdAt).toLocaleString()}
                  </Text>
                </View>

                <View style={styles.scoreBadge}>
                  <Text style={styles.score}>
                    {item.mood}/5
                  </Text>
                </View>
              </View>

              {item.note ? (
                <Text style={styles.note}>{item.note}</Text>
              ) : null}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
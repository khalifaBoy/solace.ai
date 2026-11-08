import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { getMoodInsights, getMoods } from "@/services/api";

interface MoodEntry {
  id: string;
  mood: number;
  emotion: string;
  note: string | null;
  createdAt: string;
}

interface ChartData {
  day: string;
  mood: number | null;
}

export default function InsightsScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const [refreshing, setRefreshing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiError, setAiError] = useState<string | null>(null);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 22,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.text,
      marginTop: 25,
    },
    subtitle: {
      fontSize: 14,
      color: theme.muted,
      marginTop: 8,
      marginBottom: 25,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 18,
      padding: 20,
      marginBottom: 18,
      borderWidth: 1,
      borderColor: theme.border,
    },
    cardTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 15,
    },
    placeholder: {
      fontSize: 13,
      color: theme.muted,
      lineHeight: 21,
    },
    averageScore: {
      fontSize: 38,
      fontWeight: "700",
      color: theme.primary,
    },
    averageDescription: {
      fontSize: 13,
      color: theme.muted,
      marginTop: 6,
    },
    emotionRow: {
      marginBottom: 18,
    },
    emotionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    emotionName: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.text,
    },
    emotionPercentage: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.primary,
    },
    progressBackground: {
      height: 9,
      backgroundColor: theme.secondary,
      borderRadius: 10,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: theme.primary,
      borderRadius: 10,
    },
    emotionCount: {
      fontSize: 11,
      color: theme.muted,
      marginTop: 5,
    },
    aiInsightText: {
      fontSize: 14,
      color: theme.text,
      lineHeight: 23,
    },
    refreshButton: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "flex-start",
      gap: 8,
      marginBottom: 22,
    },
    refreshButtonText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "600",
    },
    backButton: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      gap: 8,
      marginBottom: 20,
    },
    backButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.text,
    },
  });

  const loadInsights = async () => {
    try {
      setLoading(true);

      const entries: MoodEntry[] = await getMoods();

      setMoods(entries);

      const days: ChartData[] = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - i);

        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const dailyEntries = entries.filter((entry) => {
          const entryDate = new Date(entry.createdAt);
          return entryDate >= date && entryDate < nextDate;
        });

        const average =
          dailyEntries.length > 0
            ? dailyEntries.reduce((sum, entry) => sum + entry.mood, 0) /
              dailyEntries.length
            : null;

        days.push({
          day: date.toLocaleDateString("en-US", {
            weekday: "short",
          }),
          mood: average === null ? null : Number(average.toFixed(1)),
        });
      }

      setChartData(days);
    } catch (error) {
      console.error("Insights Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const weeklyAverage = (() => {
    const validScores = chartData
      .map((item) => item.mood)
      .filter((score): score is number => score !== null);

    if (validScores.length === 0) return null;

    const total = validScores.reduce((sum, score) => sum + score, 0);

    return (total / validScores.length).toFixed(1);
  })();

  const emotionDistribution = (() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(0, 0, 0, 0);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const recentMoods = moods.filter(
      (entry) => new Date(entry.createdAt) >= sevenDaysAgo,
    );

    const counts: Record<string, number> = {};

    recentMoods.forEach((entry) => {
      counts[entry.emotion] = (counts[entry.emotion] || 0) + 1;
    });

    const total = recentMoods.length;

    return Object.entries(counts)
      .map(([emotion, count]) => ({
        emotion,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  })();

  const getWeeklyAverage = (startDate: Date, endDate: Date) => {
    const entries = moods.filter((entry) => {
      const date = new Date(entry.createdAt);
      return date >= startDate && date < endDate;
    });

    if (entries.length === 0) return null;

    const total = entries.reduce((sum, entry) => sum + entry.mood, 0);

    return total / entries.length;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - 6);

  const previousWeekStart = new Date(currentWeekStart);
  previousWeekStart.setDate(currentWeekStart.getDate() - 7);

  const currentWeekAverage = getWeeklyAverage(
    currentWeekStart,
    new Date(today.getTime() + 86400000),
  );

  const previousWeekAverage = getWeeklyAverage(
    previousWeekStart,
    currentWeekStart,
  );

  const moodDifference =
    currentWeekAverage !== null && previousWeekAverage !== null
      ? Number((currentWeekAverage - previousWeekAverage).toFixed(1))
      : null;

  const loadAIInsights = async () => {
    try {
      setAiLoading(true);
      setAiError(null);

      const data = await getMoodInsights();

      setAiInsight(data.insights);
    } catch (error) {
      console.error("AI Insights Error:", error);

      setAiError(
        error instanceof Error
          ? error.message
          : "Unable to load AI insights.",
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleRefreshInsights = async () => {
    try {
      setRefreshing(true);

      await Promise.all([loadInsights(), loadAIInsights()]);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadInsights();
    loadAIInsights();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/(tabs)");
          }
        }}
      >
        <Ionicons
          name="arrow-back"
          size={22}
          color={theme.text}
        />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Mood Insights</Text>

      <Text style={styles.subtitle}>
        Understand your emotional patterns and progress.
      </Text>

      <TouchableOpacity
        style={[
          styles.refreshButton,
          refreshing && { opacity: 0.6 },
        ]}
        onPress={handleRefreshInsights}
        disabled={refreshing}
      >
        <Ionicons
          name="refresh-outline"
          size={18}
          color="#FFFFFF"
        />

        <Text style={styles.refreshButtonText}>
          {refreshing ? "Refreshing..." : "Refresh Insights"}
        </Text>
      </TouchableOpacity>

      

      {/* Average Mood */}
      {loading ? (
        <Text style={styles.placeholder}>Calculating...</Text>
      ) : (
        <View>
          <Text style={styles.averageScore}>
            {weeklyAverage !== null ? `${weeklyAverage}/5` : "--"}
          </Text>

          <Text style={styles.averageDescription}>
            {weeklyAverage !== null
              ? "Your average mood over the last 7 days"
              : "Record your moods to see your weekly average."}
          </Text>
        </View>
      )}

      {/* Weekly Progress */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Weekly Progress</Text>

        {loading ? (
          <Text style={styles.placeholder}>
            Calculating progress...
          </Text>
        ) : currentWeekAverage === null ? (
          <Text style={styles.placeholder}>
            Record your moods to see weekly progress.
          </Text>
        ) : (
          <>
            <Text style={styles.averageScore}>
              {currentWeekAverage.toFixed(1)}/5
            </Text>

            <Text style={styles.averageDescription}>
              Current week's average mood
            </Text>

            {previousWeekAverage === null ? (
              <Text style={styles.placeholder}>
                More mood history is needed for a weekly comparison.
              </Text>
            ) : (
              <Text style={styles.averageDescription}>
                {moodDifference === 0
                  ? "Your average mood remained unchanged."
                  : moodDifference! > 0
                    ? `Your average mood increased by ${moodDifference}.`
                    : `Your average mood decreased by ${Math.abs(moodDifference!)}.`}
              </Text>
            )}
          </>
        )}
      </View>

      {/* Emotion Distribution */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Emotion Distribution</Text>

        {loading ? (
          <Text style={styles.placeholder}>Loading emotions...</Text>
        ) : emotionDistribution.length === 0 ? (
          <Text style={styles.placeholder}>
            Record your moods to see your emotion distribution.
          </Text>
        ) : (
          emotionDistribution.map((item) => (
            <View key={item.emotion} style={styles.emotionRow}>
              <View style={styles.emotionHeader}>
                <Text style={styles.emotionName}>
                  {item.emotion}
                </Text>

                <Text style={styles.emotionPercentage}>
                  {item.percentage}%
                </Text>
              </View>

              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${item.percentage}%` },
                  ]}
                />
              </View>

              <Text style={styles.emotionCount}>
                {item.count} {item.count === 1 ? "entry" : "entries"}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* AI Insights */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your AI Insights</Text>

        {aiLoading ? (
          <Text style={styles.placeholder}>
            Generating your personalized insights...
          </Text>
        ) : aiError ? (
          <Text style={styles.placeholder}>{aiError}</Text>
        ) : aiInsight ? (
          <Text style={styles.aiInsightText}>{aiInsight}</Text>
        ) : (
          <Text style={styles.placeholder}>
            Record some moods to receive personalized insights.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
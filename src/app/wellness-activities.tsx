import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useTheme } from "@/context/ThemeContext";
import { getMoodActivities } from "@/services/api";

type WellnessActivity = {
  id: number;
  title: string;
  description: string;
  duration: string;
};

function parseActivities(text: string): WellnessActivity[] {
  if (!text) return [];

  const sections = text.split(/\n(?=\s*\d+\.\s)/);

  return sections
    .map((section, index) => {
      const titleMatch = section.match(/\d+\.\s*\*\*(.*?)\*\*/);
      const durationMatch = section.match(/\*\*Duration:\*\*\s*(.*)/);

      const title = titleMatch?.[1]?.trim() || `Activity ${index + 1}`;

      const description = section
        .replace(/\d+\.\s*\*\*.*?\*\*/, "")
        .replace(/\*\*Duration:\*\*\s*.*$/, "")
        .replace(/\*\*/g, "")
        .trim();

      return {
        id: index + 1,
        title,
        description,
        duration: durationMatch?.[1]?.trim() || "A few minutes",
      };
    })
    .filter((activity) => activity.description.length > 0);
}

export default function WellnessActivitiesScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const [activities, setActivities] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const parsedActivities = parseActivities(activities);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 30,
      paddingBottom: 20,
    },
    topBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    backButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    backText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.text,
    },
    historyButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: theme.secondary,
      paddingHorizontal: 13,
      paddingVertical: 10,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    historyButtonText: {
      color: theme.primary,
      fontSize: 13,
      fontWeight: "700",
    },
    header2: {
      paddingHorizontal: 0,
    },
    title: {
      fontSize: 26,
      fontWeight: "700",
      color: theme.text,
    },
    subtitle: {
      fontSize: 14,
      color: theme.muted,
      marginTop: 8,
    },
    section: {
      paddingHorizontal: 24,
      paddingBottom: 30,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.text,
    },
    sectionSubtitle: {
      fontSize: 13,
      color: theme.muted,
      marginTop: 6,
      marginBottom: 20,
    },
    activityCard: {
      backgroundColor: theme.surface,
      borderRadius: 18,
      padding: 18,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    activityHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 10,
    },
    activityTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.text,
      flexShrink: 1,
    },
    durationBadge: {
      backgroundColor: theme.secondary,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 20,
    },
    durationText: {
      fontSize: 11,
      color: theme.primary,
      fontWeight: "600",
    },
    activityDescription: {
      fontSize: 14,
      color: theme.muted,
      lineHeight: 22,
      marginTop: 12,
    },
    error: {
      color: theme.danger,
      fontSize: 14,
    },
    empty: {
      color: theme.muted,
      fontSize: 14,
    },
    refreshButton: {
      backgroundColor: theme.primary,
      paddingVertical: 15,
      borderRadius: 14,
      alignItems: "center",
      marginTop: 8,
    },
    refreshButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "700",
    },
  });

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMoodActivities();
      setActivities(data.activities || "");
    } catch (err) {
      console.error("Activities Error:", err);
      setError("Unable to load activities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.topBar}>
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
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => router.push("/activity-history")}
          >
            <Ionicons
              name="time-outline"
              size={18}
              color={theme.primary}
            />
            <Text style={styles.historyButtonText}>History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.header2}>
          <Text style={styles.title}>Wellness Activities</Text>

          <Text style={styles.subtitle}>
            Small steps towards a healthier, happier you.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suggested for You</Text>

        <Text style={styles.sectionSubtitle}>
          Activities inspired by your recent mood patterns.
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={theme.primary}
          />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : parsedActivities.length === 0 ? (
          <Text style={styles.empty}>
            No activities available yet. Try again later.
          </Text>
        ) : (
          parsedActivities.map((activity) => (
            <Pressable
              key={activity.id}
              style={styles.activityCard}
              onPress={() =>
                router.push({
                  pathname: "/activity",
                  params: {
                    title: activity.title,
                    description: activity.description,
                    duration: activity.duration,
                  },
                })
              }
            >
              <View style={styles.activityHeader}>
                <Text style={styles.activityTitle}>
                  {activity.title}
                </Text>

                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>
                    {activity.duration}
                  </Text>
                </View>
              </View>

              <Text style={styles.activityDescription}>
                {activity.description}
              </Text>
            </Pressable>
          ))
        )}

        <TouchableOpacity
          style={[
            styles.refreshButton,
            loading && { opacity: 0.6 },
          ]}
          onPress={loadActivities}
          disabled={loading}
        >
          <Text style={styles.refreshButtonText}>
            {loading ? "Generating..." : "Refresh Suggestions"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
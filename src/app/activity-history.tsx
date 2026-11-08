import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { getActivityHistory } from "@/services/api";

type ActivityRecord = {
  id: string;
  activity: string;
  duration: string;
  completedAt: string;
};

export default function ActivityHistoryScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    header: {
      padding: 24,
      flexDirection: "row",
      alignItems: "center",
      gap: 15,
    },

    title: {
      fontSize: 22,
      fontWeight: "700",
      color: theme.text,
    },

    summaryCard: {
      backgroundColor: theme.secondary,
      marginHorizontal: 24,
      padding: 25,
      borderRadius: 20,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },

    summaryNumber: {
      fontSize: 38,
      fontWeight: "700",
      color: theme.primary,
    },

    summaryLabel: {
      fontSize: 14,
      color: theme.muted,
      marginTop: 5,
    },

    section: {
      padding: 24,
    },

    sectionTitle: {
      fontSize: 19,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 18,
    },

    activityCard: {
      backgroundColor: theme.surface,
      borderRadius: 17,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 13,
      gap: 13,
      borderWidth: 1,
      borderColor: theme.border,
    },

    iconContainer: {
      width: 45,
      height: 45,
      borderRadius: 14,
      backgroundColor: theme.secondary,
      justifyContent: "center",
      alignItems: "center",
    },

    activityInfo: {
      flex: 1,
    },

    activityTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.text,
    },

    duration: {
      fontSize: 12,
      color: theme.primary,
      marginTop: 5,
    },

    date: {
      fontSize: 11,
      color: theme.muted,
      marginTop: 5,
    },

    message: {
      fontSize: 14,
      color: theme.muted,
      lineHeight: 22,
      textAlign: "center",
      marginTop: 15,
    },
  });

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getActivityHistory();
      setActivities(data);
    } catch (err) {
      console.error("Activity History Error:", err);
      setError("Unable to load activity history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={23}
            color={theme.text}
          />
        </Pressable>

        <Text style={styles.title}>Activity History</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryNumber}>
          {activities.length}
        </Text>

        <Text style={styles.summaryLabel}>
          Activities Completed
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Your Wellness Journey
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={theme.primary}
          />
        ) : error ? (
          <Text style={styles.message}>{error}</Text>
        ) : activities.length === 0 ? (
          <Text style={styles.message}>
            No completed activities yet. Start your wellness journey today!
          </Text>
        ) : (
          activities.map((item) => (
            <View key={item.id} style={styles.activityCard}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="checkmark-circle"
                  size={25}
                  color={theme.success}
                />
              </View>

              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>
                  {item.activity}
                </Text>

                <Text style={styles.duration}>
                  {item.duration}
                </Text>

                <Text style={styles.date}>
                  {new Date(item.completedAt).toLocaleString()}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
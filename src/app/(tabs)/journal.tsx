import { getJournalEntries } from "@/services/api";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

import FadeInView from "@/components/animations/FadeInView";
import PressableScale from "@/components/animations/PressableScale";
import ScaleInView from "@/components/animations/ScaleInView";
import SlideInView from "@/components/animations/SlideInView";
import StaggeredList from "@/components/animations/StaggeredList";

type JournalEntry = {
  id: string;
  title: string;
  content: string;
  mood: string;
  createdAt: string;
};

export default function JournalScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    header: {
      paddingHorizontal: 24,
      paddingTop: 35,
      paddingBottom: 25,
    },

    greeting: {
      fontSize: 13,
      color: theme.muted,
      fontWeight: "600",
    },

    title: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.text,
      marginTop: 8,
    },

    subtitle: {
      fontSize: 14,
      color: theme.muted,
      lineHeight: 22,
      marginTop: 8,
    },

    writeCard: {
      backgroundColor: theme.surface,
      marginHorizontal: 24,
      padding: 22,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: theme.border,
    },

    iconContainer: {
      width: 55,
      height: 55,
      borderRadius: 17,
      backgroundColor: theme.primary,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },

    cardTitle: {
      fontSize: 19,
      fontWeight: "700",
      color: theme.text,
    },

    cardDescription: {
      fontSize: 13,
      color: theme.muted,
      lineHeight: 21,
      marginTop: 9,
    },

    writeButton: {
      backgroundColor: theme.primary,
      padding: 15,
      borderRadius: 14,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 9,
      marginTop: 22,
    },

    writeButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "700",
    },

    historySection: {
      paddingHorizontal: 24,
      marginTop: 32,
      paddingBottom: 30,
    },

    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },

    sectionTitle: {
      fontSize: 19,
      fontWeight: "700",
      color: theme.text,
    },

    emptyCard: {
      backgroundColor: theme.surface,
      borderRadius: 18,
      padding: 30,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },

    emptyTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.text,
      marginTop: 15,
    },

    emptyDescription: {
      fontSize: 13,
      color: theme.muted,
      textAlign: "center",
      lineHeight: 21,
      marginTop: 8,
    },

    entryCard: {
      backgroundColor: theme.surface,
      borderRadius: 18,
      padding: 18,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: theme.border,
    },

    entryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 8,
    },

    entryTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.text,
      flexShrink: 1,
    },

    moodBadge: {
      backgroundColor: theme.secondary,
      paddingHorizontal: 11,
      paddingVertical: 6,
      borderRadius: 20,
    },

    moodBadgeText: {
      fontSize: 11,
      color: theme.primary,
      fontWeight: "600",
    },

    entryPreview: {
      fontSize: 13,
      color: theme.muted,
      lineHeight: 21,
      marginTop: 12,
    },

    entryDate: {
      fontSize: 11,
      color: theme.muted,
      marginTop: 12,
    },
  });

  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getJournalEntries();
      setEntries(data);
    } catch (err) {
      console.error("Journal Fetch Error:", err);
      setError("Unable to load journal entries.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [loadEntries])
  );

  // Sort newest first and display only the latest 3 entries.
  const recentEntries = [...entries]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Animated Header */}
      <FadeInView duration={600}>
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Your Personal Space
          </Text>

          <SlideInView
            direction="bottom"
            distance={15}
            delay={150}
          >
            <Text style={styles.title}>
              My Journal
            </Text>
          </SlideInView>

          <FadeInView delay={300} duration={600}>
            <Text style={styles.subtitle}>
              A safe space for your thoughts, feelings and reflections.
            </Text>
          </FadeInView>
        </View>
      </FadeInView>

      {/* Animated Writing Card */}
      <ScaleInView
        initialScale={0.95}
        delay={200}
        duration={550}
      >
        <View style={styles.writeCard}>
          <ScaleInView
            initialScale={0.7}
            delay={300}
            duration={500}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name="book-outline"
                size={30}
                color="#FFFFFF"
              />
            </View>
          </ScaleInView>

          <FadeInView delay={350}>
            <Text style={styles.cardTitle}>
              What's on your mind today?
            </Text>
          </FadeInView>

          <FadeInView delay={450}>
            <Text style={styles.cardDescription}>
              Take a moment to express yourself. Every thought deserves a space.
            </Text>
          </FadeInView>

          <SlideInView
            direction="bottom"
            distance={15}
            delay={550}
          >
            <PressableScale
              style={styles.writeButton}
              onPress={() => router.push("/journal-write")}
              pressedScale={0.96}
            >
              <Ionicons
                name="create-outline"
                size={19}
                color="#FFFFFF"
              />

              <Text style={styles.writeButtonText}>
                Write an Entry
              </Text>
            </PressableScale>
          </SlideInView>
        </View>
      </ScaleInView>

      {/* Recent Journal Entries */}
      <View style={styles.historySection}>
        <FadeInView delay={400}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Recent Entries
            </Text>

            <Ionicons
              name="time-outline"
              size={21}
              color={theme.muted}
            />
          </View>
        </FadeInView>

        {loading ? (
          <FadeInView>
            <ActivityIndicator
              size="large"
              color={theme.primary}
            />
          </FadeInView>
        ) : error ? (
          <FadeInView>
            <Text style={styles.emptyDescription}>
              {error}
            </Text>
          </FadeInView>
        ) : recentEntries.length === 0 ? (
          <ScaleInView initialScale={0.95} delay={200}>
            <View style={styles.emptyCard}>
              <Ionicons
                name="document-text-outline"
                size={38}
                color={theme.primary}
              />

              <Text style={styles.emptyTitle}>
                Your story starts here
              </Text>

              <Text style={styles.emptyDescription}>
                Your journal entries will appear here once you start writing.
              </Text>
            </View>
          </ScaleInView>
        ) : (
          recentEntries.map((entry, index) => (
            <StaggeredList
              key={entry.id}
              index={index}
              staggerDelay={130}
              translateY={25}
            >
              <PressableScale
                style={styles.entryCard}
                onPress={() =>
                  router.push({
                    pathname: "/journal-detail",
                    params: {
                      id: entry.id,
                      title: entry.title,
                      content: entry.content,
                      mood: entry.mood,
                      createdAt: entry.createdAt,
                    },
                  })
                }
                pressedScale={0.98}
              >
                <View style={styles.entryHeader}>
                  <Text
                    style={styles.entryTitle}
                    numberOfLines={1}
                  >
                    {entry.title}
                  </Text>

                  <View style={styles.moodBadge}>
                    <Text style={styles.moodBadgeText}>
                      {entry.mood}
                    </Text>
                  </View>
                </View>

                <Text
                  style={styles.entryPreview}
                  numberOfLines={3}
                >
                  {entry.content}
                </Text>

                <Text style={styles.entryDate}>
                  {new Date(entry.createdAt).toLocaleDateString()}
                </Text>
              </PressableScale>
            </StaggeredList>
          ))
        )}
      </View>
    </ScrollView>
  );
}
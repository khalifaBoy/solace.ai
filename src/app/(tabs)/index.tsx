import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/context/ThemeContext";

import FadeInView from "@/components/animations/FadeInView";
import PressableScale from "@/components/animations/PressableScale";
import StaggeredList from "@/components/animations/StaggeredList";

import AffirmationCard from "@/components/home/AffirmationCard";
import CompanionCard from "@/components/home/CompanionCard";
import HomeHeader from "@/components/home/HomeHeader";
import InsightsCard from "@/components/home/InsightsCard";
import MoodCheckIn from "@/components/home/MoodCheckIn";
import WellnessActivities from "@/components/home/WellnessActivitiesCard";

export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
      edges={["top"]}
    >
      <ScrollView
        style={{ backgroundColor: theme.background }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <FadeInView duration={600}>
          <HomeHeader />
        </FadeInView>

        <StaggeredList index={0} staggerDelay={120}>
          <MoodCheckIn />
        </StaggeredList>

        <StaggeredList index={1} staggerDelay={120}>
          <InsightsCard />
        </StaggeredList>

        <StaggeredList index={2} staggerDelay={120}>
          <CompanionCard />
        </StaggeredList>

        <StaggeredList index={3} staggerDelay={120}>
          <AffirmationCard />
        </StaggeredList>

        <StaggeredList index={4} staggerDelay={120}>
          <WellnessActivities />
        </StaggeredList>

        {/* Breathing Exercises Card */}
        <StaggeredList index={5} staggerDelay={120}>
          <PressableScale
            onPress={() => router.push("/breathing-exercises")}
            style={[
              styles.breathingCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.secondary },
              ]}
            >
              <Text style={styles.icon}>🌬️</Text>
            </View>

            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                Breathing Exercises
              </Text>

              <Text style={[styles.cardDescription, { color: theme.muted }]}>
                Take a moment to slow down, relax and reconnect with yourself.
              </Text>

              <Text style={[styles.cardAction, { color: theme.primary }]}>
                Start breathing →
              </Text>
            </View>
          </PressableScale>
        </StaggeredList>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 15,
  },
  breathingCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 18,
    gap: 15,
  },
  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 29,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 10,
  },
  cardAction: {
    fontSize: 13,
    fontWeight: "700",
  },
});
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import FadeInView from "@/components/animations/FadeInView";
import PressableScale from "@/components/animations/PressableScale";
import ScaleInView from "@/components/animations/ScaleInView";
import SlideInView from "@/components/animations/SlideInView";
import StaggeredList from "@/components/animations/StaggeredList";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Are you sure you want to log out?"
      );
      if (!confirmed) return;
    }

    try {
      await logout();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const initial = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <FadeInView duration={500}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            My Profile
          </Text>

          <Text style={[styles.subtitle, { color: theme.muted }]}>
            Your personal wellness space
          </Text>
        </View>
      </FadeInView>

      {/* Profile Card */}
      <ScaleInView
        initialScale={0.94}
        delay={150}
        duration={500}
      >
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <ScaleInView initialScale={0.7} delay={200}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: theme.secondary },
              ]}
            >
              <Text
                style={[
                  styles.avatarText,
                  { color: theme.primary },
                ]}
              >
                {initial}
              </Text>
            </View>
          </ScaleInView>

          <FadeInView delay={300}>
            <Text style={[styles.name, { color: theme.text }]}>
              {user?.name || "User"}
            </Text>
          </FadeInView>

          <FadeInView delay={400}>
            <Text style={[styles.email, { color: theme.muted }]}>
              {user?.email || ""}
            </Text>
          </FadeInView>

          <SlideInView
            direction="bottom"
            distance={12}
            delay={500}
          >
            <View
              style={[
                styles.memberBadge,
                { backgroundColor: theme.secondary },
              ]}
            >
              <Ionicons
                name="shield-checkmark"
                size={14}
                color={theme.primary}
              />

              <Text
                style={[
                  styles.memberText,
                  { color: theme.primary },
                ]}
              >
                Registered Member
              </Text>
            </View>
          </SlideInView>
        </View>
      </ScaleInView>

      {/* Edit Profile */}
      <SlideInView
        direction="bottom"
        distance={15}
        delay={350}
      >
        <PressableScale
          style={[
            styles.editProfileButton,
            { backgroundColor: theme.secondary },
          ]}
          onPress={() => router.push("/edit-profile")}
        >
          <Ionicons
            name="create-outline"
            size={17}
            color={theme.primary}
          />

          <Text
            style={[
              styles.editProfileText,
              { color: theme.primary },
            ]}
          >
            Edit Profile
          </Text>
        </PressableScale>
      </SlideInView>

      {/* Account Information */}
      <StaggeredList index={0} staggerDelay={150}>
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.text },
            ]}
          >
            Account Information
          </Text>

          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.infoRow}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: theme.secondary },
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={theme.primary}
                />
              </View>

              <View style={styles.infoTextContainer}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: theme.muted },
                  ]}
                >
                  Full Name
                </Text>

                <Text
                  style={[
                    styles.infoValue,
                    { color: theme.text },
                  ]}
                >
                  {user?.name || "Not available"}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.divider,
                { backgroundColor: theme.border },
              ]}
            />

            <View style={styles.infoRow}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: theme.secondary },
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={theme.primary}
                />
              </View>

              <View style={styles.infoTextContainer}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: theme.muted },
                  ]}
                >
                  Email Address
                </Text>

                <Text
                  style={[
                    styles.infoValue,
                    { color: theme.text },
                  ]}
                >
                  {user?.email || "Not available"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </StaggeredList>

      {/* Wellness */}
      <StaggeredList index={1} staggerDelay={150}>
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.text },
            ]}
          >
            Your Wellness
          </Text>

          <View
            style={[
              styles.menuCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            {/* Mood Insights */}
            <PressableScale
              onPress={() => router.push("/insights")}
              style={styles.menuItem}
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: theme.secondary },
                ]}
              >
                <Ionicons
                  name="analytics-outline"
                  size={20}
                  color={theme.primary}
                />
              </View>

              <Text
                style={[
                  styles.menuText,
                  { color: theme.text },
                ]}
              >
                Mood Insights
              </Text>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.muted}
              />
            </PressableScale>

            <View
              style={[
                styles.divider,
                { backgroundColor: theme.border },
              ]}
            />

            {/* Journal */}
            <PressableScale
              onPress={() => router.push("/journal")}
              style={styles.menuItem}
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: theme.secondary },
                ]}
              >
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={theme.primary}
                />
              </View>

              <Text
                style={[
                  styles.menuText,
                  { color: theme.text },
                ]}
              >
                My Journal
              </Text>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.muted}
              />
            </PressableScale>

            <View
              style={[
                styles.divider,
                { backgroundColor: theme.border },
              ]}
            />

            {/* Activity History */}
            <PressableScale
              onPress={() => router.push("/activity-history")}
              style={styles.menuItem}
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: theme.secondary },
                ]}
              >
                <Ionicons
                  name="fitness-outline"
                  size={20}
                  color={theme.primary}
                />
              </View>

              <Text
                style={[
                  styles.menuText,
                  { color: theme.text },
                ]}
              >
                Activity History
              </Text>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.muted}
              />
            </PressableScale>

            <View
              style={[
                styles.divider,
                { backgroundColor: theme.border },
              ]}
            />

            {/* Appearance */}
            <PressableScale
              onPress={() => router.push("/theme-settings")}
              style={styles.menuItem}
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: theme.secondary },
                ]}
              >
                <Ionicons
                  name="color-palette-outline"
                  size={20}
                  color={theme.primary}
                />
              </View>

              <Text
                style={[
                  styles.menuText,
                  { color: theme.text },
                ]}
              >
                Appearance
              </Text>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.muted}
              />
            </PressableScale>
          </View>
        </View>
      </StaggeredList>

      {/* Logout */}
      <SlideInView
        direction="bottom"
        distance={20}
        delay={650}
      >
        <PressableScale
          style={[
            styles.logoutButton,
            { backgroundColor: theme.card },
          ]}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color={theme.danger}
          />

          <Text
            style={[
              styles.logoutText,
              { color: theme.danger },
            ]}
          >
            Log Out
          </Text>
        </PressableScale>
      </SlideInView>

      {/* Footer */}
      <FadeInView delay={800}>
        <Text
          style={[
            styles.footer,
            { color: theme.muted },
          ]}
        >
          Solace AI · Your wellness companion
        </Text>
      </FadeInView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 25,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 14,
    marginTop: 6,
  },

  profileCard: {
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
  },

  avatar: {
    width: 85,
    height: 85,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  avatarText: {
    fontSize: 34,
    fontWeight: "700",
  },

  name: {
    fontSize: 21,
    fontWeight: "700",
  },

  email: {
    fontSize: 13,
    marginTop: 6,
  },

  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 15,
    gap: 6,
  },

  memberText: {
    fontSize: 11,
    fontWeight: "600",
  },

  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 11,
    paddingHorizontal: 22,
    borderRadius: 12,
    marginTop: 18,
  },

  editProfileText: {
    fontSize: 13,
    fontWeight: "700",
  },

  section: {
    marginTop: 28,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 13,
  },

  infoCard: {
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 17,
    gap: 13,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  infoTextContainer: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },

  divider: {
    height: 1,
  },

  menuCard: {
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 13,
  },

  menuText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },

  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    marginTop: 30,
    gap: 9,
  },

  logoutText: {
    fontSize: 15,
    fontWeight: "700",
  },

  footer: {
    textAlign: "center",
    fontSize: 11,
    marginTop: 25,
  },
});
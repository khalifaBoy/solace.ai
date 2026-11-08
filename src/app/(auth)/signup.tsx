import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";


import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import BackButton from "@/components/common/BackButton";

import FadeInView from "@/components/animations/FadeInView";
import PulseView from "@/components/animations/PulseView";
import ScaleInView from "@/components/animations/ScaleInView";
import SlideInView from "@/components/animations/SlideInView";
import StaggeredList from "@/components/animations/StaggeredList";

import { useTheme } from "@/context/ThemeContext";
import { useAndroidBackHandler } from "@/hooks/useAndroidBackHandler";
import { registerUser } from "@/services/api";
import { showAlert } from "@/utils/alert";

export default function SignupScreen() {
  useAndroidBackHandler("/onboarding");

  const { theme } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 26,
      paddingTop: 55,
      paddingBottom: 35,
    },

    header: {
      alignItems: "center",
      marginTop: 35,
      marginBottom: 40,
    },

    logo: {
      width: 75,
      height: 75,
      borderRadius: 25,
      backgroundColor: theme.secondary,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 22,
    },

    title: {
      fontSize: 27,
      fontWeight: "700",
      color: theme.text,
    },

    subtitle: {
      fontSize: 14,
      color: theme.muted,
      marginTop: 10,
      textAlign: "center",
    },

    form: {
      width: "100%",
    },

    loginContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 28,
    },

    loginText: {
      color: theme.muted,
      fontSize: 14,
    },

    loginLink: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: "700",
    },

    terms: {
      textAlign: "center",
      color: theme.muted,
      fontSize: 11,
      lineHeight: 19,
      marginTop: 35,
    },
  });

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert("Missing information", "Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      Alert.alert("Invalid email", "Please enter a valid email.");
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Weak password",
        "Password must contain at least 8 characters."
      );
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      showAlert(
        "Success",
        "Account created successfully!",
        () => router.replace("/(auth)/login")
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      if (Platform.OS === "web") {
        window.alert(`Registration failed\n\n${errorMessage}`);
      } else {
        Alert.alert("Registration failed", errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FadeInView duration={400}>
          <BackButton fallback="/onboarding" />
        </FadeInView>

        <View style={styles.header}>
          <ScaleInView
            initialScale={0.65}
            delay={150}
            duration={550}
          >
            <PulseView
              minScale={1}
              maxScale={1.04}
              duration={1800}
            >
              <View style={styles.logo}>
                <Ionicons
                  name="flower-outline"
                  size={35}
                  color={theme.primary}
                />
              </View>
            </PulseView>
          </ScaleInView>

          <FadeInView delay={350} duration={650}>
            <Text style={styles.title}>
              Create your account
            </Text>
          </FadeInView>

          <SlideInView
            direction="bottom"
            distance={18}
            delay={500}
            duration={650}
          >
            <Text style={styles.subtitle}>
              Start your journey towards a healthier mind.
            </Text>
          </SlideInView>
        </View>

        <View style={styles.form}>
          <StaggeredList index={0} staggerDelay={120}>
            <AuthInput
              label="Your name"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />
          </StaggeredList>

          <StaggeredList index={1} staggerDelay={120}>
            <AuthInput
              label="Email address"
              placeholder="example@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </StaggeredList>

          <StaggeredList index={2} staggerDelay={120}>
            <AuthInput
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </StaggeredList>

          <ScaleInView delay={750} initialScale={0.96}>
            <AuthButton
              title={loading ? "Creating account..." : "Create Account"}
              onPress={handleSignup}
              loading={loading}
            />
          </ScaleInView>

          <FadeInView delay={900}>
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>
                Already have an account?
              </Text>

              <Pressable onPress={() => router.replace("/(auth)/login")}>
                <Text style={styles.loginLink}> Log in</Text>
              </Pressable>
            </View>
          </FadeInView>
        </View>

        <FadeInView delay={1050}>
          <Text style={styles.terms}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </FadeInView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
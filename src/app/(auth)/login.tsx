import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import FadeInView from "@/components/animations/FadeInView";
import PulseView from "@/components/animations/PulseView";
import ScaleInView from "@/components/animations/ScaleInView";
import SlideInView from "@/components/animations/SlideInView";
import StaggeredList from "@/components/animations/StaggeredList";

import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import BackButton from "@/components/common/BackButton";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useAndroidBackHandler } from "@/hooks/useAndroidBackHandler";
import { loginUser } from "@/services/api";

export default function LoginScreen() {
  useAndroidBackHandler("/signup");

  const { setSession } = useAuth();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    content: {
      flexGrow: 1,
      paddingHorizontal: 26,
      paddingTop: 55,
      paddingBottom: 40,
    },

    header: {
      alignItems: "center",
      marginTop: 55,
      marginBottom: 45,
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
      fontSize: 29,
      fontWeight: "700",
      color: theme.text,
    },

    subtitle: {
      fontSize: 14,
      color: theme.muted,
      marginTop: 10,
    },

    form: {
      width: "100%",
    },

    forgot: {
      alignItems: "flex-end",
      marginBottom: 15,
    },

    forgotText: {
      color: theme.primary,
      fontSize: 13,
      fontWeight: "600",
    },

    signupContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 30,
    },

    signupText: {
      color: theme.muted,
      fontSize: 14,
    },

    signupLink: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: "700",
    },
  });

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert(
        "Missing information",
        "Enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const result = await loginUser({
        email: email.trim().toLowerCase(),
        password,
      });

      if (!result.token || !result.user) {
        throw new Error("Invalid authentication response");
      }

      await setSession(result.token, result.user);

      console.log("User session saved:", result.user);

      if (Platform.OS === "web") {
        window.alert("Welcome back to Solace AI!");
        router.replace("/(tabs)/companion");
      } else {
        Alert.alert(
          "Login successful",
          "Welcome back to Solace AI!",
          [
            {
              text: "Continue",
              onPress: () => router.replace("/(tabs)/companion"),
            },
          ]
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      if (Platform.OS === "web") {
        window.alert(`Login failed\n\n${errorMessage}`);
      } else {
        Alert.alert("Login failed", errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <FadeInView duration={400}>
        <BackButton fallback="/signup" />
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
          <Text style={styles.title}>Welcome back</Text>
        </FadeInView>

        <SlideInView
          direction="bottom"
          distance={18}
          delay={500}
          duration={650}
        >
          <Text style={styles.subtitle}>
            We're happy to see you again.
          </Text>
        </SlideInView>
      </View>

      <View style={styles.form}>
        <StaggeredList index={0} staggerDelay={150}>
          <AuthInput
            label="Email address"
            placeholder="example@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </StaggeredList>

        <StaggeredList index={1} staggerDelay={150}>
          <AuthInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </StaggeredList>

        <FadeInView delay={650}>
          <Pressable
            style={styles.forgot}
            onPress={() =>
              Alert.alert(
                "Forgot password",
                "Password recovery will be added later."
              )
            }
          >
            <Text style={styles.forgotText}>
              Forgot password?
            </Text>
          </Pressable>
        </FadeInView>

        <ScaleInView
          delay={750}
          initialScale={0.96}
          duration={450}
        >
          <AuthButton
            title="Log In"
            onPress={handleLogin}
            loading={loading}
          />
        </ScaleInView>

        <FadeInView delay={900}>
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>
              Don't have an account?
            </Text>

            <Pressable
              onPress={() => router.replace("/(auth)/signup")}
            >
              <Text style={styles.signupLink}> Sign up</Text>
            </Pressable>
          </View>
        </FadeInView>
      </View>
    </ScrollView>
  );
}
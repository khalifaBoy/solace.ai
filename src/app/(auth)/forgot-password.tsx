import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import FadeInView from "@/components/animations/FadeInView";
import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import BackButton from "@/components/common/BackButton";

import { useTheme } from "@/context/ThemeContext";
import { forgotPassword } from "@/services/api";

export default function ForgotPasswordScreen() {
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
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
      marginTop: 75,
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
      fontSize: 27,
      fontWeight: "700",
      color: theme.text,
    },

    subtitle: {
      fontSize: 14,
      color: theme.muted,
      marginTop: 12,
      textAlign: "center",
      lineHeight: 22,
    },

    form: {
      width: "100%",
    },

    footer: {
      alignItems: "center",
      marginTop: 30,
    },

    footerText: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: "600",
    },
  });

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Missing information", "Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const result = await forgotPassword(email);

      const message =
        result.message ||
        "If an account exists with this email, a reset link will be sent.";

      if (Platform.OS === "web") {
        window.alert(message);
        router.replace("/(auth)/login");
      } else {
        Alert.alert("Check your email", message, [
          {
            text: "Continue",
            onPress: () => router.replace("/(auth)/login"),
          },
        ]);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      if (Platform.OS === "web") {
        window.alert(errorMessage);
      } else {
        Alert.alert("Request failed", errorMessage);
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
        <BackButton fallback="/login" />
      </FadeInView>

      <View style={styles.header}>
        <FadeInView duration={500}>
          <View style={styles.logo}>
            <Ionicons
              name="lock-closed-outline"
              size={35}
              color={theme.primary}
            />
          </View>
        </FadeInView>

        <Text style={styles.title}>Forgot Password?</Text>

        <Text style={styles.subtitle}>
          Don't worry. Enter your registered email address and we'll send you
          instructions to reset your password.
        </Text>
      </View>

      <View style={styles.form}>
        <AuthInput
          label="Email address"
          placeholder="example@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <AuthButton
          title="Send Reset Link"
          onPress={handleForgotPassword}
          loading={loading}
        />
      </View>

      <View style={styles.footer}>
        <Text
          style={styles.footerText}
          onPress={() => router.replace("/(auth)/login")}
        >
          Back to Login
        </Text>
      </View>
    </ScrollView>
  );
}
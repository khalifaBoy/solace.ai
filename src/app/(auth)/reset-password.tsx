import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import BackButton from "@/components/common/BackButton";

import { useTheme } from "@/context/ThemeContext";
import { resetPassword } from "@/services/api";

export default function ResetPasswordScreen() {
  const { theme } = useTheme();

  const { token } = useLocalSearchParams<{ token?: string }>();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      marginTop: 70,
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
      marginTop: 30,
      alignItems: "center",
    },

    footerText: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: "600",
    },
  });

  const handleResetPassword = async () => {
    if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
      Alert.alert(
        "Invalid link",
        "This password reset link is invalid. Please request a new one."
      );
      return;
    }

    if (!password || !confirmPassword) {
      Alert.alert("Missing information", "Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Weak password",
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const result = await resetPassword(token, password);

      const message =
        result.message || "Your password has been reset successfully.";

      if (Platform.OS === "web") {
        window.alert(message);
        router.replace("/login");
      } else {
        Alert.alert("Password updated", message, [
          {
            text: "Log In",
            onPress: () => router.replace("/login"),
          },
        ]);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to reset your password.";

      if (Platform.OS === "web") {
        window.alert(message);
      } else {
        Alert.alert("Reset failed", message);
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
    >
      <BackButton fallback="/login" />

      <View style={styles.header}>
        <View style={styles.logo}>
          <Ionicons
            name="key-outline"
            size={35}
            color={theme.primary}
          />
        </View>

        <Text style={styles.title}>Reset Password</Text>

        <Text style={styles.subtitle}>
          Enter your new password below.
        </Text>
      </View>

      <View style={styles.form}>
        <AuthInput
          label="New password"
          placeholder="Enter new password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <AuthInput
          label="Confirm password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <AuthButton
          title="Reset Password"
          onPress={handleResetPassword}
          loading={loading}
        />
      </View>

      <View style={styles.footer}>
        <Text
          style={styles.footerText}
          onPress={() => router.replace("/login")}
        >
          Back to Login
        </Text>
      </View>
    </ScrollView>
  );
}
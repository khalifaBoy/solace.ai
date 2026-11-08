import { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const { theme } = useTheme();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    content: {
      padding: 24,
      paddingBottom: 50,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 18,
      marginBottom: 35,
    },

    headerTitle: {
      fontSize: 21,
      fontWeight: "700",
      color: theme.text,
    },

    avatarContainer: {
      alignItems: "center",
      marginBottom: 35,
    },

    avatar: {
      width: 90,
      height: 90,
      borderRadius: 50,
      backgroundColor: theme.secondary,
      justifyContent: "center",
      alignItems: "center",
    },

    avatarText: {
      fontSize: 36,
      fontWeight: "700",
      color: theme.primary,
    },

    avatarSubtitle: {
      fontSize: 13,
      color: theme.muted,
      marginTop: 12,
    },

    section: {
      marginBottom: 24,
    },

    label: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 10,
    },

    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surface,
      borderRadius: 14,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: theme.border,
      gap: 12,
    },

    input: {
      flex: 1,
      paddingVertical: 16,
      fontSize: 14,
      color: theme.text,
    },

    errorText: {
      color: theme.danger,
      fontSize: 13,
      marginBottom: 15,
      textAlign: "center",
    },

    saveButton: {
      backgroundColor: theme.primary,
      padding: 17,
      borderRadius: 14,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
      marginTop: 10,
    },

    saveButtonText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "700",
    },

    cancelButton: {
      padding: 16,
      alignItems: "center",
      marginTop: 8,
    },

    cancelText: {
      color: theme.muted,
      fontSize: 14,
      fontWeight: "600",
    },
  });

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateProfile(name.trim(), email.trim());

      if (Platform.OS === "web") {
        window.alert("Profile updated successfully!");
      } else {
        Alert.alert("Success", "Profile updated successfully!");
      }

      router.back();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.text}
          />
        </Pressable>

        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {name.trim().charAt(0).toUpperCase() || "U"}
          </Text>
        </View>

        <Text style={styles.avatarSubtitle}>
          Update your personal information
        </Text>
      </View>

      {/* Name */}
      <View style={styles.section}>
        <Text style={styles.label}>Full Name</Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={20}
            color={theme.primary}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor={theme.muted}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>
      </View>

      {/* Email */}
      <View style={styles.section}>
        <Text style={styles.label}>Email Address</Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={20}
            color={theme.primary}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={theme.muted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Error */}
      {error !== "" && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {/* Save */}
      <Pressable
        style={[
          styles.saveButton,
          saving && { opacity: 0.6 },
        ]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Ionicons
            name="checkmark-circle-outline"
            size={20}
            color="#FFFFFF"
          />
        )}

        <Text style={styles.saveButtonText}>
          {saving ? "Saving..." : "Save Changes"}
        </Text>
      </Pressable>

      {/* Cancel */}
      <Pressable
        style={styles.cancelButton}
        onPress={() => router.back()}
        disabled={saving}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
    </ScrollView>
  );
}
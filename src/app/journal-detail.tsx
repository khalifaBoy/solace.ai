import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { deleteJournalEntry } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function JournalDetailScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const { id, title, content, mood, createdAt } =
    useLocalSearchParams<{
      id: string;
      title: string;
      content: string;
      mood: string;
      createdAt: string;
    }>();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    header: {
      padding: 24,
      flexDirection: "row",
      alignItems: "center",
      gap: 18,
    },

    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.text,
    },

    content: {
      padding: 24,
    },

    title: {
      fontSize: 25,
      fontWeight: "700",
      color: theme.text,
    },

    metadata: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginTop: 15,
    },

    mood: {
      backgroundColor: theme.secondary,
      color: theme.primary,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 20,
      overflow: "hidden",
      fontSize: 12,
      fontWeight: "600",
    },

    date: {
      fontSize: 12,
      color: theme.muted,
    },

    entryCard: {
      backgroundColor: theme.surface,
      padding: 22,
      borderRadius: 18,
      marginTop: 25,
      minHeight: 220,
      borderWidth: 1,
      borderColor: theme.border,
    },

    entryContent: {
      fontSize: 15,
      color: theme.text,
      lineHeight: 27,
    },

    actions: {
      marginTop: 25,
      gap: 12,
    },

    editButton: {
      backgroundColor: theme.primary,
      padding: 16,
      borderRadius: 14,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 9,
    },

    editText: {
      color: "#FFFFFF",
      fontWeight: "700",
    },

    deleteButton: {
      backgroundColor: theme.card,
      padding: 16,
      borderRadius: 14,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 9,
      borderWidth: 1,
      borderColor: theme.border,
    },

    deleteText: {
      color: theme.danger,
      fontWeight: "700",
    },
  });

  const handleEdit = () => {
    router.push({
      pathname: "/journal-write",
      params: {
        id: id as string,
        title: title as string,
        content: content as string,
        mood: mood as string,
      },
    });
  };

  const handleDelete = async () => {
    const confirmed =
      Platform.OS === "web"
        ? window.confirm(
            "Are you sure you want to delete this journal entry?"
          )
        : await new Promise<boolean>((resolve) => {
            Alert.alert(
              "Delete Journal Entry",
              "Are you sure you want to delete this entry?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                  onPress: () => resolve(false),
                },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => resolve(true),
                },
              ]
            );
          });

    if (!confirmed) return;

    try {
      await deleteJournalEntry(id as string);
      router.back();
    } catch (error) {
      if (Platform.OS === "web") {
        window.alert(
          error instanceof Error
            ? error.message
            : "Unable to delete entry"
        );
      } else {
        Alert.alert(
          "Error",
          error instanceof Error
            ? error.message
            : "Unable to delete entry"
        );
      }
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.push("/journal")}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.text}
          />
        </Pressable>

        <Text style={styles.headerTitle}>Journal Entry</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.metadata}>
          <Text style={styles.mood}>{mood}</Text>

          <Text style={styles.date}>
            {createdAt
              ? new Date(createdAt).toLocaleDateString()
              : ""}
          </Text>
        </View>

        <View style={styles.entryCard}>
          <Text style={styles.entryContent}>{content}</Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.editButton}
            onPress={handleEdit}
          >
            <Ionicons
              name="create-outline"
              size={19}
              color="#FFFFFF"
            />

            <Text style={styles.editText}>Edit Entry</Text>
          </Pressable>

          <Pressable
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Ionicons
              name="trash-outline"
              size={19}
              color={theme.danger}
            />

            <Text style={styles.deleteText}>Delete Entry</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
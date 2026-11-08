import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  deleteConversation,
  getConversations,
} from "@/services/api";

import { useTheme } from "@/context/ThemeContext";

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    messages: number;
  };
}

export default function HistoryScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 20,
      backgroundColor: theme.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },

    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
    },

    list: {
      padding: 16,
    },

    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surface,
      padding: 15,
      borderRadius: 16,
      marginBottom: 12,
      gap: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },

    cardContent: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },

    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: theme.secondary,
      justifyContent: "center",
      alignItems: "center",
    },

    details: {
      flex: 1,
      marginLeft: 12,
    },

    title: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.text,
    },

    date: {
      fontSize: 11,
      color: theme.muted,
      marginTop: 5,
    },

    messageCount: {
      alignItems: "center",
      marginLeft: 8,
    },

    count: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.primary,
    },

    countLabel: {
      fontSize: 9,
      color: theme.muted,
    },

    deleteButton: {
      padding: 10,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 5,
    },

    loader: {
      flex: 1,
    },

    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 30,
    },

    emptyTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: theme.text,
      marginTop: 15,
    },

    emptyText: {
      fontSize: 13,
      color: theme.muted,
      textAlign: "center",
      marginTop: 8,
    },

    retry: {
      color: theme.primary,
      fontWeight: "700",
      marginTop: 15,
    },
  });

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getConversations();

      setConversations(data);
    } catch (err) {
      console.error("History Error:", err);
      setError("Unable to load conversations. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (conversationId: string) => {
    try {
      await deleteConversation(conversationId);

      setConversations((previous) =>
        previous.filter((item) => item.id !== conversationId)
      );
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      Alert.alert("Error", "Unable to delete conversation.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadConversations();
    }, [loadConversations])
  );

  const renderConversation = ({ item }: { item: Conversation }) => (
    <View style={styles.card}>
      <Pressable
        style={styles.cardContent}
        onPress={() => {
          router.push({
            pathname: "/companion",
            params: { conversationId: item.id },
          });
        }}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={22}
            color={theme.primary}
          />
        </View>

        <View style={styles.details}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>

          <Text style={styles.date}>
            {new Date(item.updatedAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.messageCount}>
          <Text style={styles.count}>
            {item._count?.messages ?? 0}
          </Text>
          <Text style={styles.countLabel}>Messages</Text>
        </View>
      </Pressable>

      <Pressable
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Delete conversation"
      >
        <Ionicons
          name="trash-outline"
          size={20}
          color={theme.danger}
        />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.text}
          />
        </Pressable>

        <Text style={styles.headerTitle}>Chat History</Text>

        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.primary}
          style={styles.loader}
        />
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{error}</Text>

          <Pressable onPress={loadConversations}>
            <Text style={styles.retry}>Try again</Text>
          </Pressable>
        </View>
      ) : conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="chatbubbles-outline"
            size={55}
            color={theme.primary}
          />

          <Text style={styles.emptyTitle}>
            No conversations yet
          </Text>

          <Text style={styles.emptyText}>
            Your previous conversations will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={renderConversation}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
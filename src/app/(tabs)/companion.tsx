import { getConversation } from "@/services/api";
import { useEffect, useRef, useState } from "react";

import * as Speech from "expo-speech";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import ChatHeader from "@/components/chat/ChatHeader";
import MessageBubble, {
  Message,
} from "@/components/chat/MessageBubble";

import ChatInput from "@/components/chat/ChatInput";
import SuggestedPrompts from "@/components/chat/SuggestedPrompts";
import TypingIndicator from "@/components/chat/TypingIndicator";

import { useLocalSearchParams, useRouter } from "expo-router";

import {
  createConversation,
  sendMessage as requestAIReply,
  saveMessage,
} from "@/services/api";

// Animation components
import FadeInView from "@/components/animations/FadeInView";
import ScaleInView from "@/components/animations/ScaleInView";
import SlideInView from "@/components/animations/SlideInView";
import StaggeredList from "@/components/animations/StaggeredList";

const welcomeMessage: Message = {
  id: "welcome",
  text: "Hey! 💜 I'm Solace. I'm here to listen, understand and support you. How are you feeling today?",
  sender: "ai",
  time: "Now",
};

export default function CompanionScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();

  const {
    conversationId: selectedConversationId,
    prompt,
  } = useLocalSearchParams<{
    conversationId?: string;
    prompt?: string;
  }>();

  const router = useRouter();

  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const [isLoadingConversation, setIsLoadingConversation] =
    useState(false);

  const [messages, setMessages] = useState<Message[]>([
    welcomeMessage,
  ]);

  const [isTyping, setIsTyping] = useState(false);

  const [conversationId, setConversationId] = useState<string | null>(
    null
  );

  const listRef = useRef<FlatList<Message>>(null);
  const requestId = useRef(0);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    keyboardContainer: {
      flex: 1,
    },
    messageList: {
      paddingHorizontal: 17,
      paddingTop: 20,
      paddingBottom: 20,
      flexGrow: 1,
    },
    intro: {
      alignItems: "center",
      marginBottom: 30,
    },
    date: {
      fontSize: 10,
      color: theme.primary,
      fontWeight: "700",
      letterSpacing: 1.5,
      marginBottom: 10,
    },
    introTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 12,
    },
    loadingText: {
      fontSize: 14,
      color: theme.muted,
    },
  });

  // Restore an existing conversation.
  useEffect(() => {
    if (!selectedConversationId) return;

    const loadConversation = async () => {
      try {
        setIsLoadingConversation(true);

        const conversation = await getConversation(
          selectedConversationId
        );

        setConversationId(conversation.id);

        const restoredMessages = conversation.messages.map(
          (message) => ({
            id: message.id,
            text: message.content,
            sender:
              message.role === "assistant"
                ? ("ai" as const)
                : ("user" as const),
            time: new Date(message.createdAt).toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ),
          })
        );

        setMessages(
          restoredMessages.length > 0
            ? restoredMessages
            : [welcomeMessage]
        );
      } catch (error) {
        console.error(
          "Unable to restore conversation:",
          error
        );
      } finally {
        setIsLoadingConversation(false);
      }
    };

    loadConversation();
  }, [selectedConversationId]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Send message to AI.
  const sendMessage = async (text: string) => {
    if (isTyping || !text.trim()) return;

    const currentRequestId = ++requestId.current;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      time: getCurrentTime(),
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      let activeConversationId = conversationId;

      // Create conversation if one doesn't exist.
      if (!activeConversationId) {
        if (!user?.id) {
          throw new Error("User is not logged in");
        }

        const conversation = await createConversation();

        if (currentRequestId !== requestId.current) return;

        activeConversationId = conversation.id;
        setConversationId(conversation.id);
      }

      // Save user message.
      await saveMessage(
        activeConversationId,
        "user",
        userMessage.text
      );

      if (currentRequestId !== requestId.current) return;

      // Prepare messages for AI API.
      const apiMessages = updatedMessages
        .filter((message) => message.id !== "welcome")
        .map((message) => ({
          role:
            message.sender === "ai"
              ? ("assistant" as const)
              : ("user" as const),
          content: message.text,
        }));

      // Get AI response.
      const aiReply = await requestAIReply(apiMessages);

      // Speak the AI response when voice mode is enabled.
        if (voiceEnabled) {
          Speech.stop();

          Speech.speak(aiReply, {
            language: "en-IN",
            rate: 0.95,
            pitch: 1.0,
          });
        }

      if (currentRequestId !== requestId.current) return;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiReply,
        sender: "ai",
        time: getCurrentTime(),
      };

      setMessages((previous) => [...previous, aiMessage]);

      const BASE_URL = "https://solace-backend-wtch.onrender.com";

      // Save AI response.
      await fetch(
        `${BASE_URL}/api/conversations/${activeConversationId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: "assistant",
            content: aiReply,
          }),
        }
      );
    } catch (error) {
      console.error("Ai Chat Error:", error);

      if (currentRequestId !== requestId.current) return;

      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: "I'm having trouble connecting right now. Please try again in a moment. 💜",
        sender: "ai",
        time: getCurrentTime(),
      };

      setMessages((previous) => [
        ...previous,
        errorMessage,
      ]);
    } finally {
      if (currentRequestId === requestId.current) {
        setIsTyping(false);
      }
    }
  };

  // Start a new conversation.
  const startNewChat = async () => {
    requestId.current++;

    setMessages([welcomeMessage]);
    setIsTyping(false);
    setConversationId(null);

    try {
      if (!user?.id) {
        throw new Error("User is not logged in");
      }

      const conversation = await createConversation();

      setConversationId(conversation.id);
    } catch (error) {
      console.error("New Conversation Error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <SlideInView direction="top" distance={15}>
          <ChatHeader
            onNewChat={startNewChat}
            onHistory={() => router.push("/history")}
          />
        </SlideInView>

        {isLoadingConversation ? (
          <ScaleInView style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={theme.primary}
            />

            <Text style={styles.loadingText}>
              Restoring your conversation...
            </Text>
          </ScaleInView>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <StaggeredList
                index={index}
                staggerDelay={60}
                duration={350}
                translateY={12}
              >
                <MessageBubble message={item} />
              </StaggeredList>
            )}
            contentContainerStyle={styles.messageList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              requestAnimationFrame(() => {
                listRef.current?.scrollToEnd({
                  animated: true,
                });
              });
            }}
            ListHeaderComponent={
              <FadeInView duration={600}>
                <View style={styles.intro}>
                  <Text style={styles.date}>
                    YOUR SAFE SPACE 💜
                  </Text>

                  <Text style={styles.introTitle}>
                    A little space just for you.
                  </Text>
                </View>
              </FadeInView>
            }
            ListFooterComponent={
              <View>
                {messages.length === 1 && (
                  <FadeInView delay={200}>
                    <SuggestedPrompts onSelect={sendMessage} />
                  </FadeInView>
                )}

                {isTyping && (
                  <SlideInView
                    direction="bottom"
                    distance={12}
                    duration={300}
                  >
                    <TypingIndicator />
                  </SlideInView>
                )}
              </View>
            }
          />
        )}

        <FadeInView duration={500} translateY={10}>
          <ChatInput
          onSend={sendMessage}
          disabled={isTyping || isLoadingConversation}
          initialText={
            typeof prompt === "string" ? prompt : ""
          }
          voiceEnabled={voiceEnabled}
          onToggleVoice={() => {
            setVoiceEnabled((previous) => {
              if (previous) {
                Speech.stop();
              }

              return !previous;
            });
          }}
        />
        </FadeInView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
  initialText?: string;
  voiceEnabled?: boolean;
  onToggleVoice?: () => void;
}

export default function ChatInput({
  onSend,
  disabled = false,
  initialText = "",
  voiceEnabled = false,
  onToggleVoice,
}: Props) {
  const { theme } = useTheme();

  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 12,
      backgroundColor: theme.background,
    },
    inputContainer: {
      minHeight: 55,
      maxHeight: 120,
      backgroundColor: theme.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.border,
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: 16,
      paddingRight: 7,
    },
    input: {
      flex: 1,
      fontSize: 13,
      color: theme.text,
      paddingVertical: 12,
      maxHeight: 100,
    },
    iconButton: {
      width: 40,
      height: 42,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 5,
    },
    micButton: {
      backgroundColor: isListening ? theme.danger : theme.secondary,
    },
    speakerButton: {
      backgroundColor: voiceEnabled ? theme.secondary : "transparent",
    },
    sendButton: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor: theme.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    disabledButton: {
      opacity: 0.45,
    },
  });

  useEffect(() => {
    if (initialText) {
      setText(initialText);
    }
  }, [initialText]);

  useSpeechRecognitionEvent("start", () => {
    setIsListening(true);
  });

  useSpeechRecognitionEvent("end", () => {
    setIsListening(false);
  });

  useSpeechRecognitionEvent("result", (event) => {
    const transcript = event.results[0]?.transcript;

    if (transcript) {
      setText(transcript);
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    setIsListening(false);

    if (event.error !== "aborted") {
      Alert.alert(
        "Voice recognition",
        event.message || "Unable to recognize your speech. Please try again."
      );
    }
  });

  useEffect(() => {
    return () => {
      ExpoSpeechRecognitionModule.abort();
    };
  }, []);

  const toggleListening = async () => {
    if (disabled) return;

    if (isListening) {
      ExpoSpeechRecognitionModule.stop();
      return;
    }

    try {
      const available =
        ExpoSpeechRecognitionModule.isRecognitionAvailable();

      if (!available) {
        Alert.alert(
          "Unavailable",
          "Speech recognition is not available on this device."
        );
        return;
      }

      const permission =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Microphone permission",
          "Please allow microphone and speech recognition permissions."
        );
        return;
      }

      setText("");

      ExpoSpeechRecognitionModule.start({
        lang: "en-IN",
        interimResults: true,
        maxAlternatives: 1,
        continuous: false,
      });
    } catch (error) {
      console.error("Speech recognition error:", error);

      Alert.alert(
        "Voice error",
        "Unable to start voice recognition."
      );
    }
  };

  const handleSend = () => {
    const message = text.trim();

    if (!message || disabled) return;

    if (isListening) {
      ExpoSpeechRecognitionModule.stop();
    }

    onSend(message);
    setText("");
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Share what's on your mind..."
          placeholderTextColor={theme.muted}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={2000}
          editable={!disabled}
        />

        {/* Voice input */}
        <Pressable
          style={[
            styles.iconButton,
            styles.micButton,
            disabled && styles.disabledButton,
          ]}
          onPress={toggleListening}
          disabled={disabled}
        >
          <Ionicons
            name={isListening ? "stop" : "mic"}
            size={21}
            color={isListening ? "#FFFFFF" : theme.primary}
          />
        </Pressable>

        {/* AI voice response toggle */}
        <Pressable
          style={[
            styles.iconButton,
            styles.speakerButton,
          ]}
          onPress={onToggleVoice}
        >
          <Ionicons
            name={voiceEnabled ? "volume-high" : "volume-mute"}
            size={21}
            color={theme.primary}
          />
        </Pressable>

        {/* Send */}
        <Pressable
          style={[
            styles.sendButton,
            (!text.trim() || disabled) && styles.disabledButton,
          ]}
          onPress={handleSend}
          disabled={!text.trim() || disabled}
        >
          <Ionicons
            name="arrow-up"
            size={22}
            color="#FFFFFF"
          />
        </Pressable>
      </View>
    </View>
  );
}
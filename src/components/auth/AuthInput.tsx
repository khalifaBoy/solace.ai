import { useState } from "react";

import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address";
}

export default function AuthInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
}: Props) {
  const [visible, setVisible] = useState(false);
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginBottom: 20,
    },

    label: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 9,
    },

    inputContainer: {
      height: 55,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.input,
    },

    input: {
      flex: 1,
      fontSize: 15,
      color: theme.text,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={theme.muted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !visible}
          keyboardType={keyboardType}
          autoCapitalize={
            keyboardType === "email-address" ? "none" : "sentences"
          }
          autoCorrect={false}
        />

        {secureTextEntry && (
          <Pressable
            onPress={() => setVisible(!visible)}
            hitSlop={10}
          >
            <Ionicons
              name={visible ? "eye-off-outline" : "eye-outline"}
              size={21}
              color={theme.muted}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}
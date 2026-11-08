import { useEffect } from "react";
import {
    StyleProp,
    View,
    ViewStyle,
} from "react-native";

import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";

interface Props {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export default function ShimmerView({
  width = "100%",
  height = 18,
  borderRadius = 8,
  style,
}: Props) {
  const { theme } = useTheme();

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 1200,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [0, 0.5, 1],
      [0.45, 0.85, 0.45]
    ),
  }));

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.secondary,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor: theme.primary,
            opacity: 0.25,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}
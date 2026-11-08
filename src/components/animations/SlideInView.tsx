import React, { useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";

import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from "react-native-reanimated";

interface Props {
  children: React.ReactNode;
  direction?: "left" | "right" | "top" | "bottom";
  distance?: number;
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

export default function SlideInView({
  children,
  direction = "bottom",
  distance = 40,
  delay = 0,
  duration = 500,
  style,
}: Props) {
  const translateX = useSharedValue(
    direction === "left"
      ? -distance
      : direction === "right"
        ? distance
        : 0
  );

  const translateY = useSharedValue(
    direction === "top"
      ? -distance
      : direction === "bottom"
        ? distance
        : 0
  );

  const opacity = useSharedValue(0);

  useEffect(() => {
    const animation = {
      duration,
      easing: Easing.out(Easing.ease),
    };

    translateX.value = withDelay(
      delay,
      withTiming(0, animation)
    );

    translateY.value = withDelay(
      delay,
      withTiming(0, animation)
    );

    opacity.value = withDelay(
      delay,
      withTiming(1, animation)
    );
  }, [delay, duration, translateX, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}
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
  initialScale?: number;
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

export default function ScaleInView({
  children,
  initialScale = 0.85,
  delay = 0,
  duration = 450,
  style,
}: Props) {
  const scale = useSharedValue(initialScale);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const config = {
      duration,
      easing: Easing.out(Easing.ease),
    };

    scale.value = withDelay(delay, withTiming(1, config));
    opacity.value = withDelay(delay, withTiming(1, config));
  }, [delay, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}
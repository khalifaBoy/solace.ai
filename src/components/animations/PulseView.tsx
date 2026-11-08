import React, { useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";

import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

interface Props {
  children: React.ReactNode;
  minScale?: number;
  maxScale?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

export default function PulseView({
  children,
  minScale = 1,
  maxScale = 1.08,
  duration = 900,
  style,
}: Props) {
  const scale = useSharedValue(minScale);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(maxScale, {
          duration,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(minScale, {
          duration,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );

    return () => {
      scale.value = minScale;
    };
  }, [minScale, maxScale, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}
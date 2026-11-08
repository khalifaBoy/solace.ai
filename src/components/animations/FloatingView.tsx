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
  distance?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

export default function FloatingView({
  children,
  distance = 10,
  duration = 1500,
  style,
}: Props) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-distance, {
          duration,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );

    return () => {
      translateY.value = 0;
    };
  }, [distance, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}
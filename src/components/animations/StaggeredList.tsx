import React from "react";
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
  index: number;
  staggerDelay?: number;
  duration?: number;
  translateY?: number;
  style?: StyleProp<ViewStyle>;
}

export default function StaggeredList({
  children,
  index,
  staggerDelay = 100,
  duration = 400,
  translateY = 20,
  style,
}: Props) {
  const opacity = useSharedValue(0);
  const translate = useSharedValue(translateY);

  React.useEffect(() => {
    const delay = index * staggerDelay;

    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration,
        easing: Easing.out(Easing.ease),
      })
    );

    translate.value = withDelay(
      delay,
      withTiming(0, {
        duration,
        easing: Easing.out(Easing.ease),
      })
    );
  }, [index, staggerDelay, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translate.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}
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
  delay?: number;
  duration?: number;
  translateY?: number;
  style?: StyleProp<ViewStyle>;
}

export default function FadeInView({
  children,
  delay = 0,
  duration = 500,
  translateY = 20,
  style,
}: Props) {
  const opacity = useSharedValue(0);
  const translate = useSharedValue(translateY);

  useEffect(() => {
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
  }, []);

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
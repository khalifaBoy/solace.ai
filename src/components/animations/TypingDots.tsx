import { useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";

import Animated, {
    cancelAnimation,
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

interface DotProps {
  delay: number;
  color: string;
  size: number;
}

function AnimatedDot({ delay, color, size }: DotProps) {
  const opacity = useSharedValue(0.35);
  const translateY = useSharedValue(0);

  useEffect(() => {
    const config = {
      duration: 350,
      easing: Easing.inOut(Easing.ease),
    };

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, config),
          withTiming(0.35, config)
        ),
        -1,
        false
      )
    );

    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-5, config),
          withTiming(0, config)
        ),
        -1,
        false
      )
    );

    return () => {
      cancelAnimation(opacity);
      cancelAnimation(translateY);
    };
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

interface Props {
  color?: string;
  size?: number;
  gap?: number;
  style?: StyleProp<ViewStyle>;
}

export default function TypingDots({
  color = "#A99BEF",
  size = 8,
  gap = 6,
  style,
}: Props) {
  return (
    <Animated.View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap,
        },
        style,
      ]}
    >
      <AnimatedDot delay={0} color={color} size={size} />
      <AnimatedDot delay={150} color={color} size={size} />
      <AnimatedDot delay={300} color={color} size={size} />
    </Animated.View>
  );
}
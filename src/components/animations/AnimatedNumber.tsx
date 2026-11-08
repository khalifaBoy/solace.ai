import { useEffect } from "react";
import { StyleProp, TextStyle } from "react-native";

import Animated, {
    Easing,
    useAnimatedProps,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

const AnimatedTextInput = Animated.createAnimatedComponent(
  require("react-native").TextInput
);

interface Props {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  style?: StyleProp<TextStyle>;
}

export default function AnimatedNumber({
  value,
  duration = 1000,
  prefix = "",
  suffix = "",
  decimals = 0,
  style,
}: Props) {
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(value, {
      duration,
      easing: Easing.out(Easing.ease),
    });
  }, [value, duration]);

  const animatedProps = useAnimatedProps(() => ({
    text: `${prefix}${animatedValue.value.toFixed(decimals)}${suffix}`,
    defaultValue: `${prefix}${animatedValue.value.toFixed(decimals)}${suffix}`,
  }));

  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      value={`${prefix}${value.toFixed(decimals)}${suffix}`}
      animatedProps={animatedProps}
      style={[
        {
          padding: 0,
          color: "#29243A",
          fontSize: 24,
          fontWeight: "700",
        },
        style,
      ]}
    />
  );
}
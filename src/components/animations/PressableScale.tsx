import React from "react";
import {
    Pressable,
    PressableProps,
    StyleProp,
    ViewStyle,
} from "react-native";

import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

interface Props extends Omit<PressableProps, "style"> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  pressedScale?: number;
}

export default function PressableScale({
  children,
  style,
  pressedScale = 0.96,
  onPressIn,
  onPressOut,
  ...props
}: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn: NonNullable<PressableProps["onPressIn"]> = (event) => {
    scale.value = withSpring(pressedScale, {
      damping: 15,
      stiffness: 200,
    });

    onPressIn?.(event);
  };

  const handlePressOut: NonNullable<PressableProps["onPressOut"]> = (event) => {
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 180,
    });

    onPressOut?.(event);
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        {...props}
        style={style}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
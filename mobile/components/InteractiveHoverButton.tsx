import React, { useRef } from "react";
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: "primary" | "outline";
}

export default function InteractiveHoverButton({
  children,
  onPress,
  disabled,
  style,
  textStyle,
  variant = "primary",
}: Props) {
  const pressed = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(
      pressed.value,
      [0, 1],
      variant === "primary" ? ["#8a4853", "#6e3a42"] : ["transparent", "rgba(138,72,83,0.08)"]
    );
    return {
      backgroundColor: bg,
      transform: [{ scale: withSpring(pressed.value ? 0.96 : 1, { damping: 12, stiffness: 280 }) }],
    };
  });

  const textAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(pressed.value ? 1.04 : 1, { damping: 14, stiffness: 260 }) }],
  }));

  return (
    <AnimatedPressable
      disabled={disabled}
      onPressIn={() => { pressed.value = 1; }}
      onPressOut={() => { pressed.value = 0; }}
      onPress={onPress}
      style={[
        styles.base,
        variant === "primary" ? styles.primary : styles.outline,
        disabled && styles.disabled,
        animStyle,
        style,
      ]}
    >
      <Animated.Text style={[styles.text, variant === "outline" && styles.textOutline, textAnimStyle]}>
        {children}
      </Animated.Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 999,
    gap: 6,
  },
  primary: {
    backgroundColor: "#8a4853",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#8a4853",
  },
  disabled: { opacity: 0.5 },
  text: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  textOutline: {
    color: "#8a4853",
  },
});

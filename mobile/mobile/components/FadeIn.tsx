import { ReactNode } from "react";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { ViewStyle, StyleProp } from "react-native";

export function FadeInItem({
  children,
  delay = 0,
  direction = "up",
  style,
}: {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down";
  style?: StyleProp<ViewStyle>;
}) {
  const entering =
    direction === "up"
      ? FadeInUp.delay(delay).springify().damping(16)
      : FadeInDown.delay(delay).springify().damping(16);

  return (
    <Animated.View entering={entering} style={style}>
      {children}
    </Animated.View>
  );
}

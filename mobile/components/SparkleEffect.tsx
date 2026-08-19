import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

const PARTICLES = [
  { dx: -14, dy: -18, size: 5 },
  { dx: 14, dy: -16, size: 4 },
  { dx: -18, dy: 4, size: 3 },
  { dx: 16, dy: 6, size: 5 },
  { dx: -6, dy: -22, size: 3 },
  { dx: 8, dy: -20, size: 4 },
];

interface Props {
  trigger: number;
}

function Particle({ dx, dy, size, delay, trigger }: { dx: number; dy: number; size: number; delay: number; trigger: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (trigger > 0) {
      progress.value = 0;
      progress.value = withDelay(
        delay,
        withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) }, () => {
          progress.value = 0;
        })
      );
    }
  }, [trigger]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: progress.value * dx },
      { translateY: progress.value * dy },
      { scale: progress.value < 0.8 ? 1 : 1 - (progress.value - 0.8) * 5 },
    ],
    opacity: progress.value < 0.7 ? 1 : 1 - (progress.value - 0.7) * 3.3,
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    />
  );
}

export default function SparkleEffect({ trigger }: Props) {
  return (
    <View style={styles.container} pointerEvents="none">
      {PARTICLES.map((p, i) => (
        <Particle key={i} dx={p.dx} dy={p.dy} size={p.size} delay={i * 30} trigger={trigger} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 0,
    height: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    position: "absolute",
    backgroundColor: "#d4a574",
  },
});

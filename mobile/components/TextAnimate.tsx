import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";

type Props = {
  text: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  style?: any;
};

function AnimatedChar({
  char,
  index,
  delay,
  stagger,
  duration,
  style,
}: {
  char: string;
  index: number;
  delay: number;
  stagger: number;
  duration: number;
  style?: any;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const scale = useSharedValue(0.7);

  useEffect(() => {
    const d = delay + index * stagger;
    opacity.value = withDelay(
      d,
      withTiming(1, { duration, easing: Easing.out(Easing.cubic) })
    );
    translateY.value = withDelay(
      d,
      withSpring(0, { damping: 13, stiffness: 100 })
    );
    scale.value = withDelay(
      d,
      withTiming(1, { duration: duration * 1.2, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  if (char === " ") {
    return <View style={{ width: 8 }} />;
  }

  return (
    <Animated.View style={animatedStyle}>
      <Text style={style}>{char}</Text>
    </Animated.View>
  );
}

export function TextAnimate({
  text,
  delay = 0,
  stagger = 60,
  duration = 500,
  style,
}: Props) {
  return (
    <View style={styles.container}>
      {text.split("").map((char, i) => (
        <AnimatedChar
          key={`${i}`}
          char={char}
          index={i}
          delay={delay}
          stagger={stagger}
          duration={duration}
          style={style}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

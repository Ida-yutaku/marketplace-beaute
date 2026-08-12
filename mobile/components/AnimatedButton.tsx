import { ReactNode } from "react";
import { StyleProp, ViewStyle, GestureResponderEvent } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedTouchable = Animated.createAnimatedComponent(
  require("react-native").TouchableOpacity
);

export default function AnimatedButton({
  onPress,
  style,
  children,
  disabled,
}: {
  onPress: (e: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  disabled?: boolean;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchable
      activeOpacity={0.9}
      disabled={disabled}
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 14, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 220 });
      }}
      onPress={onPress}
      style={[style, animatedStyle, disabled ? { opacity: 0.6 } : null]}
    >
      {children}
    </AnimatedTouchable>
  );
}

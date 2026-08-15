import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
  runOnJS,
} from "react-native-reanimated";

// Écran d'accueil au lancement : logo qui apparaît avec un léger effet de
// respiration, texte qui suit, barre de progression qui se remplit, puis
// redirection automatique vers la page d'accueil marketing.
export default function SplashScreen() {
  const router = useRouter();

  const logoScale = useSharedValue(0.6);
  const logoOpacity = useSharedValue(0);
  const glow = useSharedValue(0.4);
  const textOpacity = useSharedValue(0);
  const textTranslate = useSharedValue(14);
  const subtitleOpacity = useSharedValue(0);
  const barWidth = useSharedValue(0);

  useEffect(() => {
    // Le logo apparaît avec un léger rebond, puis respire doucement en boucle.
    logoOpacity.value = withTiming(1, { duration: 420, easing: Easing.out(Easing.quad) });
    logoScale.value = withSequence(
      withTiming(1.08, { duration: 460, easing: Easing.out(Easing.back(1.6)) }),
      withTiming(1, { duration: 220 })
    );
    glow.value = withDelay(
      460,
      withRepeat(withSequence(withTiming(0.9, { duration: 900 }), withTiming(0.4, { duration: 900 })), -1, true)
    );

    textOpacity.value = withDelay(280, withTiming(1, { duration: 420 }));
    textTranslate.value = withDelay(280, withTiming(0, { duration: 420, easing: Easing.out(Easing.quad) }));
    subtitleOpacity.value = withDelay(460, withTiming(1, { duration: 420 }));

    barWidth.value = withDelay(
      520,
      withTiming(1, { duration: 1000, easing: Easing.out(Easing.cubic) }, (finished) => {
        if (finished) runOnJS(goNext)();
      })
    );
  }, []);

  function goNext() {
    router.replace("/home");
  }

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
  }));
  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslate.value }],
  }));
  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));
  const barStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value * 100}%`,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.glowRing, glowStyle]} />
      <Animated.View style={[styles.logoCircle, logoStyle]}>
        <Text style={styles.logoText}>S</Text>
      </Animated.View>

      <Animated.Text style={[styles.title, textStyle]}>
        She's <Text style={styles.titleHighlight}>Beauté</Text>
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, subtitleStyle]}>RÉVÉLEZ VOTRE ÉCLAT</Animated.Text>

      <View style={styles.loadingTrack}>
        <Animated.View style={[styles.loadingBar, barStyle]} />
      </View>

      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0814",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  glowRing: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#E91E63",
    opacity: 0.35,
    // le flou n'existe pas nativement sur RN, on simule via une grande
    // forme semi-transparente légèrement plus large que le logo
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#1F112B",
    borderWidth: 2,
    borderColor: "#E91E63",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#E91E63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FF69B4",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  titleHighlight: {
    color: "#FF69B4",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#B39DDB",
    letterSpacing: 2,
    marginBottom: 32,
  },
  loadingTrack: {
    width: 140,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#2A173B",
    overflow: "hidden",
  },
  loadingBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FF69B4",
  },
  version: {
    position: "absolute",
    bottom: 40,
    fontSize: 12,
    color: "#7A6B8A",
  },
});

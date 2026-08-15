import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { api } from "@/lib/api";
import { COLORS } from "@/constants/theme";
import AnimatedButton from "@/components/AnimatedButton";

type Status = "pending" | "paid" | "canceled";

export default function CartSuccessScreen() {
  const { order_id } = useLocalSearchParams<{ order_id: string }>();
  const router = useRouter();
  const [status, setStatus] = useState<Status>("pending");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!order_id) return;
    const interval = setInterval(async () => {
      try {
        const order: any = await api.verifyOrder(Number(order_id));
        setStatus(order.status);
        if (order.status !== "pending") {
          setChecking(false);
          clearInterval(interval);
        }
      } catch {
        // on continue d'essayer
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [order_id]);

  // Anneau de pulsation en attente de confirmation.
  const pendingPulse = useSharedValue(0.9);
  useEffect(() => {
    if (status === "pending") {
      pendingPulse.value = withRepeat(withSequence(withTiming(1.15, { duration: 700 }), withTiming(0.9, { duration: 700 })), -1, false);
    }
  }, [status]);
  const pendingStyle = useAnimatedStyle(() => ({ transform: [{ scale: pendingPulse.value }] }));

  // Icône de résultat (check ou croix) : entrée en rebond + anneaux qui se
  // propagent depuis le centre, façon onde de confirmation.
  const iconScale = useSharedValue(0);
  const ring1 = useSharedValue(0);
  const ring2 = useSharedValue(0);

  useEffect(() => {
    if (status !== "pending") {
      iconScale.value = withSequence(
        withTiming(1.2, { duration: 320, easing: Easing.out(Easing.back(2)) }),
        withTiming(1, { duration: 180 })
      );
      ring1.value = withDelay(80, withTiming(1, { duration: 700, easing: Easing.out(Easing.quad) }));
      ring2.value = withDelay(200, withTiming(1, { duration: 700, easing: Easing.out(Easing.quad) }));
    }
  }, [status]);

  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: iconScale.value }] }));
  const ring1Style = useAnimatedStyle(() => ({
    opacity: 1 - ring1.value,
    transform: [{ scale: 1 + ring1.value * 1.6 }],
  }));
  const ring2Style = useAnimatedStyle(() => ({
    opacity: 1 - ring2.value,
    transform: [{ scale: 1 + ring2.value * 2.1 }],
  }));

  const isPaid = status === "paid";
  const isCanceled = status === "canceled";
  const resultColor = isPaid ? "#16a34a" : isCanceled ? COLORS.error : COLORS.primaryDark;

  return (
    <View style={styles.container}>
      <View style={styles.iconStage}>
        {status === "pending" ? (
          <Animated.View style={[styles.pendingRing, pendingStyle]}>
            <Ionicons name="time-outline" size={44} color={COLORS.primaryDark} />
          </Animated.View>
        ) : (
          <>
            <Animated.View style={[styles.ring, { borderColor: resultColor }, ring2Style]} />
            <Animated.View style={[styles.ring, { borderColor: resultColor }, ring1Style]} />
            <Animated.View style={[styles.resultCircle, { backgroundColor: resultColor }, iconStyle]}>
              <Ionicons name={isPaid ? "checkmark" : "close"} size={46} color="white" />
            </Animated.View>
          </>
        )}
      </View>

      <Animated.Text entering={FadeInDown.delay(150).duration(400)} style={styles.title}>
        {isPaid ? "Paiement confirmé 🎉" : isCanceled ? "Paiement annulé" : "En attente de confirmation..."}
      </Animated.Text>
      <Animated.Text entering={FadeInDown.delay(220).duration(400)} style={styles.subtitle}>
        Commande #{order_id}
      </Animated.Text>

      <Animated.View entering={FadeInDown.delay(300).duration(400)}>
        <AnimatedButton style={styles.button} onPress={() => router.replace("/catalog")}>
          <Text style={styles.buttonText}>Retour au catalogue</Text>
        </AnimatedButton>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, alignItems: "center", justifyContent: "center", padding: 24, gap: 8 },
  iconStage: { width: 120, height: 120, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  pendingRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.interactive,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
  },
  resultCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 20, fontWeight: "800", color: COLORS.primaryText, textAlign: "center" },
  subtitle: { color: COLORS.textMuted },
  button: { backgroundColor: COLORS.primaryDark, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 14, marginTop: 20 },
  buttonText: { color: "white", fontWeight: "700" },
});

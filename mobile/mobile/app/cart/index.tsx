import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Linking } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  Layout,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { useCart } from "@/contexts/CartContext";
import { api, ApiError } from "@/lib/api";
import { COLORS, SPACING } from "@/constants/theme";
import AnimatedButton from "@/components/AnimatedButton";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity) as React.ComponentType<any>;

export default function CartScreen() {
  const router = useRouter();
  const { cart, totalPrice, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  // Pulsation douce du bouton de paiement pendant la redirection, pour
  // signaler clairement que quelque chose se passe.
  const pulse = useSharedValue(1);
  useEffect(() => {
    if (loading) {
      pulse.value = withRepeat(withSequence(withTiming(1.03, { duration: 500 }), withTiming(1, { duration: 500 })), -1, true);
    } else {
      pulse.value = withTiming(1, { duration: 150 });
    }
  }, [loading]);
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  // Le total change de couleur brièvement à chaque mise à jour du panier.
  const totalFlash = useSharedValue(0);
  useEffect(() => {
    totalFlash.value = withSequence(withTiming(1, { duration: 120 }), withTiming(0, { duration: 400, easing: Easing.out(Easing.quad) }));
  }, [totalPrice]);
  const totalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + totalFlash.value * 0.08 }],
  }));

  async function handleCheckout() {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const items = cart.map((item) => ({ product_id: Number(item.id), quantity: item.quantity }));
      const { checkout_url, order_id } = await api.checkout(items);
      clearCart();
      router.push(`/cart/success?order_id=${order_id}`);
      const supported = await Linking.canOpenURL(checkout_url);
      if (supported) {
        await Linking.openURL(checkout_url);
      } else {
        Alert.alert("Erreur", "Impossible d'ouvrir la page de paiement.");
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Le paiement n'a pas pu être initié.";
      Alert.alert("Erreur", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Animated.Text entering={FadeInRight.duration(350)} style={styles.title}>
        Mon panier
      </Animated.Text>
      <FlatList
        data={cart}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <Animated.View entering={FadeInRight.duration(400)} style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>🛍️</Text>
            <Text style={styles.empty}>Ton panier est vide.</Text>
          </Animated.View>
        }
        renderItem={({ item }) => (
          <Animated.View
            entering={FadeInRight.duration(300).springify().damping(18)}
            exiting={FadeOutLeft.duration(220)}
            layout={Layout.springify().damping(18)}
            style={styles.row}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.title || item.name}</Text>
              <Text style={styles.itemPrice}>{item.price} FCFA x {item.quantity}</Text>
            </View>
            <View style={styles.qtyRow}>
              <AnimatedTouchable onPress={() => decreaseQuantity(item.id)} style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>−</Text>
              </AnimatedTouchable>
              <Text style={styles.qty}>{item.quantity}</Text>
              <AnimatedTouchable onPress={() => increaseQuantity(item.id)} style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>+</Text>
              </AnimatedTouchable>
              <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                <Text style={styles.removeText}>✕</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      />
      {cart.length > 0 && (
        <Animated.View entering={FadeInRight.duration(300)} style={styles.footer}>
          <Animated.Text style={[styles.total, totalStyle]}>Total : {totalPrice} FCFA</Animated.Text>
          <Animated.View style={pulseStyle}>
            <AnimatedButton style={styles.button} onPress={handleCheckout} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? "Redirection..." : "Payer avec Mobile Money"}</Text>
            </AnimatedButton>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.lg },
  title: { fontSize: 22, fontWeight: "800", color: COLORS.primaryText, marginBottom: 12 },
  emptyWrap: { alignItems: "center", marginTop: 60, gap: 8 },
  emptyIcon: { fontSize: 40 },
  empty: { textAlign: "center", color: COLORS.textMuted },
  row: { flexDirection: "row", alignItems: "center", backgroundColor: "white", borderRadius: 12, padding: 12, marginBottom: 8 },
  itemTitle: { fontWeight: "700", color: "#1f2937" },
  itemPrice: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  qtyBtn: { width: 26, height: 26, borderRadius: 13, backgroundColor: COLORS.interactive, alignItems: "center", justifyContent: "center" },
  qtyBtnText: { fontWeight: "800", color: COLORS.primaryDark },
  qty: { fontWeight: "700", minWidth: 16, textAlign: "center" },
  removeText: { color: COLORS.error, marginLeft: 8, fontSize: 16 },
  footer: { borderTopWidth: 1, borderTopColor: "#f0d5e0", paddingTop: 12, marginTop: 8 },
  total: { fontSize: 16, fontWeight: "800", marginBottom: 10, color: "#1f2937" },
  button: { backgroundColor: COLORS.primaryDark, paddingVertical: 16, borderRadius: 14, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "700", fontSize: 15 },
});

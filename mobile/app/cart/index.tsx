import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Linking } from "react-native";
import { useRouter } from "expo-router";
import { useCart } from "@/contexts/CartContext";
import { api, ApiError } from "@/lib/api";
import { COLORS, SPACING } from "@/constants/theme";

export default function CartScreen() {
  const router = useRouter();
  const { cart, totalPrice, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

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
      <Text style={styles.title}>Mon panier</Text>
      <FlatList
        data={cart}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text style={styles.empty}>Ton panier est vide.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.title || item.name}</Text>
              <Text style={styles.itemPrice}>{item.price} € x {item.quantity}</Text>
            </View>
            <View style={styles.qtyRow}>
              <TouchableOpacity onPress={() => decreaseQuantity(item.id)} style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qty}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => increaseQuantity(item.id)} style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                <Text style={styles.removeText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      {cart.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.total}>Total : {totalPrice} €</Text>
          <TouchableOpacity style={styles.button} onPress={handleCheckout} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Redirection..." : "Payer avec Mobile Money"}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.lg },
  title: { fontSize: 22, fontWeight: "800", color: COLORS.primaryText, marginBottom: 12 },
  empty: { textAlign: "center", color: COLORS.textMuted, marginTop: 40 },
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

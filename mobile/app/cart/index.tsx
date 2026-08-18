import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "@/contexts/CartContext";
import { api, ApiError } from "@/lib/api";
import { colors } from "@/lib/theme";
import BottomNav from "@/components/BottomNav";

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
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Le paiement n'a pas pu être initié.";
      alert(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.title}>Mon panier</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="bag-outline" size={48} color={colors.outlineVariant} />
            <Text style={styles.empty}>Ton panier est vide.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.itemTitle} numberOfLines={1}>{item.title || item.name}</Text>
              <Text style={styles.itemPrice}>{item.price} €</Text>
            </View>
            <View style={styles.qtyRow}>
              <TouchableOpacity onPress={() => decreaseQuantity(item.id)} style={styles.qtyBtn}>
                <Ionicons name="remove" size={16} color={colors.primary} />
              </TouchableOpacity>
              <Text style={styles.qty}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => increaseQuantity(item.id)} style={styles.qtyBtn}>
                <Ionicons name="add" size={16} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeBtn}>
                <Ionicons name="close" size={16} color={colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {cart.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>{totalPrice} €</Text>
          </View>
          <TouchableOpacity style={styles.payBtn} onPress={handleCheckout} disabled={loading} activeOpacity={0.85}>
            <Text style={styles.payBtnText}>{loading ? "Redirection..." : "Payer"}</Text>
          </TouchableOpacity>
        </View>
      )}
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: { fontSize: 20, fontWeight: "700", color: colors.onSurface },
  list: { padding: 16, gap: 8 },
  emptyWrap: { alignItems: "center", marginTop: 80, gap: 12 },
  empty: { color: colors.outline, fontSize: 15 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 14,
    marginBottom: 4,
  },
  rowLeft: { flex: 1 },
  itemTitle: { fontWeight: "600", color: colors.onSurface, fontSize: 14 },
  itemPrice: { color: colors.secondary, fontSize: 13, marginTop: 2 },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceContainerHigh,
    justifyContent: "center",
    alignItems: "center",
  },
  qty: { fontWeight: "700", fontSize: 14, color: colors.onSurface, minWidth: 16, textAlign: "center" },
  removeBtn: { marginLeft: 6 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  totalLabel: { fontSize: 16, fontWeight: "600", color: colors.onSurfaceVariant },
  totalPrice: { fontSize: 20, fontWeight: "700", color: colors.onSurface },
  payBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
  },
  payBtnText: { color: colors.onPrimary, fontWeight: "700", fontSize: 15 },
});

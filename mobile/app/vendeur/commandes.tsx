import { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, RefreshControl, TouchableOpacity } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { api, Order, formatFCFA } from "@/lib/api";
import { colors } from "@/lib/theme";
import { showAlert } from "@/lib/alert";
import SellerBottomNav from "@/components/SellerBottomNav";

const STATUS_MAP = {
  pending: { label: "En attente", bg: colors.tertiaryContainer, fg: colors.tertiary },
  paid: { label: "Payée", bg: colors.primaryContainer, fg: colors.onPrimaryContainer },
  canceled: { label: "Annulée", bg: colors.errorContainer, fg: colors.error },
} as const;

export default function SellerOrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.getSellerOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      showAlert("Erreur", "Impossible de charger les commandes.");
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Commandes reçues</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="receipt-outline" size={48} color={colors.outlineVariant} />
            <Text style={styles.emptyText}>Aucune commande pour le moment.</Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const st = STATUS_MAP[item.status] ?? STATUS_MAP.pending;
          return (
            <Animated.View entering={FadeInDown.delay(index * 40).springify().damping(16)} style={styles.card}>
              {/* Top row: order id + status */}
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.orderId}>Commande #{item.id}</Text>
                  <Text style={styles.orderDate}>{formatDate(item.created_at)}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
                  <Text style={[styles.statusText, { color: st.fg }]}>{st.label}</Text>
                </View>
              </View>

              {/* Buyer info */}
              {item.buyer && (
                <View style={styles.buyerRow}>
                  <View style={styles.buyerAvatar}>
                    <Ionicons name="person" size={16} color={colors.primary} />
                  </View>
                  <View style={styles.buyerInfo}>
                    <Text style={styles.buyerName}>{item.buyer.username}</Text>
                    <Text style={styles.buyerEmail}>{item.buyer.email}</Text>
                  </View>
                </View>
              )}

              {/* Items summary */}
              <View style={styles.itemsSection}>
                {item.items.map((oi) => (
                  <View key={oi.id} style={styles.itemRow}>
                    <Text style={styles.itemTitle} numberOfLines={1}>{oi.product.title}</Text>
                    <Text style={styles.itemQty}>x{oi.quantity}</Text>
                    <Text style={styles.itemPrice}>{formatFCFA(oi.unit_price)}</Text>
                  </View>
                ))}
              </View>

              {/* Total */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatFCFA(item.total_amount)}</Text>
              </View>
            </Animated.View>
          );
        }}
      />
      <SellerBottomNav />
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
    paddingVertical: 14,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: colors.onSurface },
  list: { padding: 16, paddingBottom: 100, gap: 12 },

  emptyWrap: { alignItems: "center", marginTop: 80, gap: 12 },
  emptyText: { color: colors.outline, fontSize: 15 },

  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  orderId: { fontSize: 16, fontWeight: "700", color: colors.onSurface },
  orderDate: { fontSize: 12, color: colors.outline, marginTop: 2 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: { fontSize: 11, fontWeight: "700" },

  buyerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.roseBg,
    borderRadius: 10,
  },
  buyerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.roseLight,
    justifyContent: "center",
    alignItems: "center",
  },
  buyerInfo: { flex: 1 },
  buyerName: { fontSize: 14, fontWeight: "600", color: colors.onSurface },
  buyerEmail: { fontSize: 12, color: colors.outline, marginTop: 1 },

  itemsSection: { marginTop: 12, gap: 6 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  itemTitle: { flex: 1, fontSize: 13, color: colors.onSurfaceVariant },
  itemQty: { fontSize: 12, fontWeight: "600", color: colors.onSurfaceVariant },
  itemPrice: { fontSize: 13, fontWeight: "600", color: colors.primary },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  totalLabel: { fontSize: 14, fontWeight: "600", color: colors.onSurfaceVariant },
  totalValue: { fontSize: 16, fontWeight: "700", color: colors.primary },
});

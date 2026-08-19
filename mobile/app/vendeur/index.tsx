import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import Animated, { FadeIn, FadeInDown, Layout } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { api, Order, Product, Shop, formatFCFA, mediaUrl } from "@/lib/api";
import { colors } from "@/lib/theme";
import { showAlert, confirmAlert } from "@/lib/alert";
import SellerBottomNav from "@/components/SellerBottomNav";
import ShopSwitcher from "@/components/ShopSwitcher";

type FilterKey = "all" | "active" | "out";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "active", label: "En vente" },
  { key: "out", label: "Rupture" },
];

export default function VendeurDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
  const [switcherVisible, setSwitcherVisible] = useState(false);

  const load = useCallback(async () => {
    try {
      const [p, s, o] = await Promise.all([
        api.getProducts({ mine: true }),
        api.getMyShops(),
        api.getSellerOrders(),
      ]);
      setProducts(Array.isArray(p) ? p : p.results ?? []);
      setShops(Array.isArray(s) ? s : s.results ?? []);
      setOrders(Array.isArray(o) ? o : []);
    } catch {
      showAlert("Erreur", "Impossible de charger les données.");
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  function handleDelete(id: number, title: string) {
    confirmAlert("Supprimer", `Supprimer "${title}" ?`, async () => {
      try {
        await api.deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch {
        showAlert("Erreur", "La suppression a échoué.");
      }
    });
  }

  const filtered = products.filter((p) => {
    if (selectedShopId !== null) {
      const shop = shops.find((s) => s.id === selectedShopId);
      if (shop && p.shop_name !== shop.name) return false;
    }
    if (filter === "active") return p.is_available && p.stock > 0;
    if (filter === "out") return p.stock <= 0;
    return true;
  });

  const totalRevenue = orders
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  const selectedShopName = selectedShopId === null
    ? null
    : shops.find((s) => s.id === selectedShopId)?.name ?? null;

  const stats = [
    {
      icon: "cube-outline" as const,
      label: "Produits",
      value: filtered.length,
      bg: colors.roseBg,
      iconColor: colors.primary,
    },
    {
      icon: "storefront-outline" as const,
      label: "Boutiques",
      value: shops.length,
      bg: colors.secondaryContainer,
      iconColor: colors.secondary,
    },
    {
      icon: "receipt-outline" as const,
      label: "Commandes",
      value: orders.length,
      bg: colors.surfaceContainerLow,
      iconColor: colors.primary,
      onPress: () => router.push("/vendeur/commandes"),
    },
    {
      icon: "cash-outline" as const,
      label: "Revenu",
      value: formatFCFA(totalRevenue),
      bg: colors.errorContainer,
      iconColor: colors.error,
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setSwitcherVisible(true)}
          style={styles.menuBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={22} color={colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>ESPACE VENDEUR</Text>
          <Text style={styles.headerTitle}>
            {selectedShopName ?? "Toutes mes boutiques"}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setSwitcherVisible(true)} style={styles.shopBtn}>
          <Ionicons name="storefront-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListHeaderComponent={
          <>
            {/* Stats cards */}
            <Animated.View entering={FadeInDown.delay(60)} style={styles.statsGrid}>
              {stats.map((s) => (
                <TouchableOpacity
                  key={s.label}
                  style={[styles.statCard, { backgroundColor: s.bg }]}
                  activeOpacity={s.onPress ? 0.7 : 1}
                  onPress={s.onPress}
                  disabled={!s.onPress}
                >
                  <Ionicons name={s.icon} size={20} color={s.iconColor} />
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </Animated.View>

            {/* Section header */}
            <Animated.View entering={FadeInDown.delay(120)} style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Mes Produits</Text>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => router.push("/vendeur/nouveau")}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={16} color={colors.onPrimary} />
                <Text style={styles.addBtnText}>Nouveau</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Filter chips */}
            <Animated.View entering={FadeInDown.delay(160)} style={styles.chipRow}>
              {FILTERS.map((f) => (
                <TouchableOpacity
                  key={f.key}
                  style={[styles.chip, filter === f.key && styles.chipActive]}
                  onPress={() => setFilter(f.key)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, filter === f.key && styles.chipTextActive]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          </>
        }
        ListEmptyComponent={
          <Animated.View entering={FadeIn.delay(200)} style={styles.empty}>
            <Ionicons name="bag-handle-outline" size={40} color={colors.outlineVariant} />
            <Text style={styles.emptyText}>Aucun produit</Text>
          </Animated.View>
        }
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 50).springify().damping(16)}
            layout={Layout.springify()}
            style={styles.card}
          >
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.push(`/vendeur/${item.id}`)}>
              <View style={styles.imageWrap}>
                {item.image_url || item.image ? (
                  <Image source={{ uri: mediaUrl(item.image_url) ?? mediaUrl(item.image)! }} style={styles.image} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="camera-outline" size={28} color={colors.outlineVariant} />
                  </View>
                )}
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: item.is_available && item.stock > 0 ? colors.success : colors.errorContainer },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: item.is_available && item.stock > 0 ? "#fff" : colors.error },
                    ]}
                  >
                    {item.is_available && item.stock > 0 ? "En vente" : "Rupture"}
                  </Text>
                </View>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.cardPrice}>{formatFCFA(item.price)}</Text>
                <Text style={styles.cardShop} numberOfLines={1}>
                  {item.shop_name}
                </Text>
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => router.push(`/vendeur/${item.id}`)}
                  >
                    <Ionicons name="pencil-outline" size={12} color={colors.primary} />
                    <Text style={styles.editBtnText}>Modifier</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(item.id, item.title)}
                  >
                    <Ionicons name="trash-outline" size={14} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
      />

      <ShopSwitcher
        visible={switcherVisible}
        shops={shops}
        selectedShopId={selectedShopId}
        onSelect={(shop) => setSelectedShopId(shop.id === 0 ? null : shop.id)}
        onClose={() => setSwitcherVisible(false)}
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  menuBtn: { padding: 4 },
  headerCenter: { flex: 1 },
  headerLabel: { fontSize: 10, fontWeight: "600", color: colors.primary, letterSpacing: 1.5 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: colors.onSurface, marginTop: 2 },
  shopBtn: { padding: 8 },

  /* Stats */
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  statCard: {
    width: "47%",
    flexGrow: 1,
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  statValue: { fontSize: 20, fontWeight: "700", color: colors.onSurface },
  statLabel: { fontSize: 12, color: colors.onSurfaceVariant, fontWeight: "500" },

  /* Section */
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.onSurface },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  addBtnText: { color: colors.onPrimary, fontSize: 13, fontWeight: "600" },

  /* Chips */
  chipRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.onSurfaceVariant, fontWeight: "500" },
  chipTextActive: { color: colors.onPrimary },

  /* Product grid */
  list: { paddingBottom: 100 },
  card: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  imageWrap: { position: "relative", aspectRatio: 4 / 3 },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.surfaceContainerLow,
    justifyContent: "center",
    alignItems: "center",
  },
  statusBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusText: { fontSize: 10, fontWeight: "700" },
  cardBody: { padding: 10 },
  cardTitle: { fontWeight: "600", fontSize: 13, color: colors.onSurface },
  cardPrice: { color: colors.primary, fontWeight: "700", fontSize: 14, marginTop: 2 },
  cardShop: { color: colors.outline, fontSize: 11, marginTop: 2 },
  cardActions: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  editBtnText: { color: colors.primary, fontSize: 11, fontWeight: "600" },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.errorContainer,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: { alignItems: "center", marginTop: 60, gap: 8 },
  emptyText: { fontWeight: "600", fontSize: 15, color: colors.onSurfaceVariant },
});

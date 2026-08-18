import { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl, Image, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import Animated, { FadeIn, FadeInDown, Layout } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { api, Product } from "@/lib/api";
import { colors } from "@/lib/theme";
import { showAlert, confirmAlert } from "@/lib/alert";

export default function VendeurDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      const data = await api.getProducts({ mine: true });
      setProducts(Array.isArray(data) ? data : data.results ?? []);
    } catch {
      showAlert("Erreur", "Impossible de charger tes annonces.");
    }
  }, []);

  useFocusEffect(useCallback(() => { loadProducts(); }, [loadProducts]));

  async function onRefresh() {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  }

  function handleLogout() {
    confirmAlert("Déconnexion", "Tu veux vraiment te déconnecter ?", async () => {
      await api.logout();
      router.replace("/login");
    });
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

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>ESPACE VENDEUR</Text>
          <Text style={styles.headerTitle}>Mes Annonces</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListEmptyComponent={
          <Animated.View entering={FadeIn.delay(200)} style={styles.empty}>
            <Ionicons name="bag-handle-outline" size={40} color={colors.outlineVariant} />
            <Text style={styles.emptyText}>Aucune annonce</Text>
          </Animated.View>
        }
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 60).springify().damping(16)}
            layout={Layout.springify()}
            style={styles.card}
          >
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.push(`/vendeur/${item.id}`)}>
              <View style={styles.imageWrap}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.image} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={{ fontSize: 28 }}>💄</Text>
                  </View>
                )}
                <View style={[styles.statusBadge, { backgroundColor: item.is_available ? colors.success : colors.outline }]}>
                  <Text style={styles.statusText}>{item.is_available ? "En vente" : "Off"}</Text>
                </View>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.cardPrice}>{item.price} €</Text>
                <Text style={styles.cardShop}>{item.shop_name}</Text>
                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.editBtn} onPress={() => router.push(`/vendeur/${item.id}`)}>
                    <Text style={styles.editBtnText}>Modifier</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id, item.title)}>
                    <Ionicons name="trash-outline" size={14} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
      />

      <View style={styles.fabWrap}>
        <TouchableOpacity style={styles.fab} onPress={() => router.push("/vendeur/nouveau")} activeOpacity={0.85}>
          <Ionicons name="add" size={22} color={colors.onPrimary} />
          <Text style={styles.fabText}>Nouvelle annonce</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerLabel: { fontSize: 10, fontWeight: "600", color: colors.primary, letterSpacing: 1.5 },
  headerTitle: { fontSize: 24, fontWeight: "700", color: colors.onSurface, marginTop: 2 },
  logoutBtn: { padding: 8 },
  list: { padding: 16, paddingBottom: 100, gap: 12 },
  card: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  imageWrap: { position: "relative" },
  image: { width: "100%", height: 110 },
  imagePlaceholder: {
    width: "100%",
    height: 110,
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
  statusText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  cardBody: { padding: 10 },
  cardTitle: { fontWeight: "600", fontSize: 13, color: colors.onSurface },
  cardPrice: { color: colors.primary, fontWeight: "700", fontSize: 14, marginTop: 2 },
  cardShop: { color: colors.outline, fontSize: 11, marginTop: 2 },
  cardActions: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  editBtn: {
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
  fabWrap: { position: "absolute", bottom: 20, left: 16, right: 16 },
  fab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fabText: { color: colors.onPrimary, fontWeight: "700", fontSize: 15 },
});

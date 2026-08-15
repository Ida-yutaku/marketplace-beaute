import { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl, Image } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import Animated, { FadeIn, FadeInDown, Layout } from "react-native-reanimated";
import { api, Product } from "@/lib/api";
import { showAlert, confirmAlert } from "@/lib/alert";
import AnimatedButton from "@/components/AnimatedButton";

export default function VendeurDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      const data = await api.getProducts({ mine: true });
      setProducts(Array.isArray(data) ? data : data.results ?? []);
    } catch {
      showAlert("Erreur", "Impossible de charger tes annonces. Es-tu connecté ?");
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
    confirmAlert("Supprimer", `Supprimer l'annonce "${title}" ?`, async () => {
      try {
        await api.deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch {
        showAlert("Erreur", "La suppression a échoué.");
      }
    });
  }

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(400)} style={styles.hero}>
        <Text style={styles.heroKicker}>Espace vendeur</Text>
        <Text style={styles.heroTitle}>Mes annonces</Text>
        <AnimatedButton onPress={() => router.push("/vendeur/boutiques")}>
          <Text style={styles.heroLink}>Gérer mes boutiques →</Text>
        </AnimatedButton>
        <AnimatedButton onPress={handleLogout}>
          <Text style={styles.logoutLink}>Se déconnecter</Text>
        </AnimatedButton>
      </Animated.View>

      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: 14 }}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7A2048" />}
        ListEmptyComponent={
          <Animated.View entering={FadeIn.delay(200)} style={styles.empty}>
            <Text style={styles.emptyEmoji}>🌸</Text>
            <Text style={styles.emptyText}>Aucune annonce pour le moment</Text>
          </Animated.View>
        }
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 70).springify().damping(16)}
            layout={Layout.springify()}
            style={styles.card}
          >
            <AnimatedButton style={{ flex: 1 }} onPress={() => router.push(`/vendeur/${item.id}`)}>
              <View style={styles.imageWrapper}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.image} />
                ) : (
                  <View style={[styles.image, styles.imagePlaceholder]}>
                    <Text style={{ fontSize: 28 }}>💄</Text>
                  </View>
                )}
                <View style={[styles.badge, { backgroundColor: item.is_available ? "#16a34a" : "#9ca3af" }]}>
                  <Text style={styles.badgeText}>{item.is_available ? "En vente" : "Indisponible"}</Text>
                </View>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.cardPrice}>{item.price} €</Text>
                <Text style={styles.cardStock}>{item.shop_name}</Text>
                <View style={styles.cardActions}>
                  <View style={styles.editBtn}>
                    <Text style={styles.editBtnText}>Modifier</Text>
                  </View>
                  <AnimatedButton style={styles.deleteBtn} onPress={() => handleDelete(item.id, item.title)}>
                    <Text style={styles.deleteBtnText}>✕</Text>
                  </AnimatedButton>
                </View>
              </View>
            </AnimatedButton>
          </Animated.View>
        )}
      />

      <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.fabWrapper}>
        <AnimatedButton style={styles.fab} onPress={() => router.push("/vendeur/nouveau")}>
          <Text style={styles.fabText}>+ Nouvelle annonce</Text>
        </AnimatedButton>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FBEEF3" },
  hero: { backgroundColor: "#7A2048", paddingTop: 24, paddingBottom: 28, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  heroKicker: { color: "#F3C9D9", fontSize: 12, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase" },
  heroTitle: { color: "white", fontSize: 28, fontWeight: "800", marginTop: 4 },
  heroLink: { color: "#F3C9D9", fontSize: 13, marginTop: 8, textDecorationLine: "underline" },
  logoutLink: { color: "#FBCFE8", fontSize: 12, marginTop: 6 },
  listContent: { padding: 16, paddingBottom: 100, gap: 14 },
  card: { flex: 1, backgroundColor: "white", borderRadius: 18, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  imageWrapper: { position: "relative" },
  image: { width: "100%", height: 120 },
  imagePlaceholder: { backgroundColor: "#FBEEF3", alignItems: "center", justifyContent: "center" },
  badge: { position: "absolute", top: 8, left: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  badgeText: { color: "white", fontSize: 10, fontWeight: "700" },
  cardBody: { padding: 10 },
  cardTitle: { fontWeight: "700", fontSize: 14, color: "#1f2937" },
  cardPrice: { color: "#7A2048", fontWeight: "800", fontSize: 15, marginTop: 2 },
  cardStock: { color: "#9ca3af", fontSize: 11, marginTop: 2 },
  cardActions: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  editBtn: { backgroundColor: "#FBEEF3", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  editBtnText: { color: "#7A2048", fontSize: 12, fontWeight: "600" },
  deleteBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#fee2e2", alignItems: "center", justifyContent: "center" },
  deleteBtnText: { color: "#dc2626", fontWeight: "700", fontSize: 13 },
  empty: { alignItems: "center", marginTop: 60 },
  emptyEmoji: { fontSize: 40, marginBottom: 8 },
  emptyText: { fontWeight: "700", fontSize: 15, color: "#1f2937" },
  fabWrapper: { position: "absolute", bottom: 20, left: 20, right: 20 },
  fab: { backgroundColor: "#7A2048", paddingVertical: 16, borderRadius: 16, alignItems: "center", shadowColor: "#7A2048", shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  fabText: { color: "white", fontWeight: "700", fontSize: 15 },
});

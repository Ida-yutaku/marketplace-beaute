import { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { api, Product } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";
import { COLORS, SPACING } from "@/constants/theme";
import { confirmAlert } from "@/lib/alert";

export default function CatalogScreen() {
  const router = useRouter();
  const { addToCart, totalCount } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  useFocusEffect(
    useCallback(() => {
      api.getProducts().then((data) => {
        setProducts(Array.isArray(data) ? data : data.results ?? []);
      });
    }, [])
  );

  function handleLogout() {
    confirmAlert("Déconnexion", "Tu veux vraiment te déconnecter ?", async () => {
      await api.logout();
      router.replace("/login");
    });
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Catalogue</Text>
        <View style={{ flexDirection: "row", gap: 14, alignItems: "center" }}>
          <TouchableOpacity style={styles.cartBtn} onPress={() => router.push("/cart")}>
            <Text style={styles.cartBtnText}>🛒 {totalCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ padding: SPACING.lg, gap: 12 }}
        ListEmptyComponent={<Text style={styles.empty}>Aucun produit disponible.</Text>}
        renderItem={({ item, index }) => (
          <ProductCard
            product={{ id: item.id, title: item.title, price: item.price, image: item.image ?? undefined }}
            index={index}
            onAdd={(p) => addToCart(p)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: SPACING.lg },
  title: { fontSize: 22, fontWeight: "800", color: COLORS.primaryText },
  cartBtn: { backgroundColor: COLORS.primaryDark, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  cartBtnText: { color: "white", fontWeight: "700" },
  logoutText: { color: COLORS.primaryDark, fontSize: 12, fontWeight: "600" },
  empty: { textAlign: "center", color: COLORS.textMuted, marginTop: 40 },
});

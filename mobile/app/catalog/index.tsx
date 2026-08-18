import { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api, Product, Category } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { colors } from "@/lib/theme";
import ProductCard from "@/components/ProductCard";

export default function CatalogScreen() {
  const router = useRouter();
  const { addToCart, totalCount } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      api.getProducts().then((data) => {
        setProducts(Array.isArray(data) ? data : data.results ?? []);
      }).catch(() => {});
      api.getCategories().then(setCategories).catch(() => {});
    }, [])
  );

  const filtered = selectedCat
    ? products.filter((p) => p.category?.slug === selectedCat)
    : products;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Boutique</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.cartBtn} onPress={() => router.push("/cart")}>
            <Ionicons name="bag-outline" size={20} color={colors.onPrimary} />
            {totalCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.catRow}>
        <TouchableOpacity
          style={[styles.catChip, !selectedCat && styles.catChipActive]}
          onPress={() => setSelectedCat(null)}
        >
          <Text style={[styles.catChipText, !selectedCat && styles.catChipTextActive]}>Tout</Text>
        </TouchableOpacity>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.catChip, selectedCat === cat.slug && styles.catChipActive]}
            onPress={() => setSelectedCat(selectedCat === cat.slug ? null : cat.slug)}
          >
            <Text style={[styles.catChipText, selectedCat === cat.slug && styles.catChipTextActive]}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Products */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Aucun produit disponible.</Text>}
        renderItem={({ item, index }) => (
          <ProductCard
            product={{ id: item.id, title: item.title, price: item.price, image: item.image ?? undefined }}
            index={index}
            onAdd={addToCart}
          />
        )}
      />
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
    paddingVertical: 12,
  },
  title: { fontSize: 24, fontWeight: "700", color: colors.onSurface },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  cartBtn: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -3,
    right: -3,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: colors.onError, fontSize: 10, fontWeight: "700" },
  catRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: colors.surfaceContainerHigh,
  },
  catChipActive: {
    backgroundColor: colors.primary,
  },
  catChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.onSurfaceVariant,
    letterSpacing: 0.3,
  },
  catChipTextActive: {
    color: colors.onPrimary,
  },
  list: { padding: 16, gap: 12 },
  empty: { textAlign: "center", color: colors.outline, marginTop: 40 },
});

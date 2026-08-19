import React, { useCallback, useState } from "react";
import { View, Text, FlatList, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api, Product, Category } from "@/lib/api";
import { colors } from "@/lib/theme";
import { useCart, ProductItem } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";
import ProductDetailSheet from "@/components/ProductDetailSheet";
import BottomNav from "@/components/BottomNav";

const CATEGORIES = [
  { label: "Soins", icon: "flower-outline" as const },
  { label: "Maquillage", icon: "color-palette-outline" as const },
  { label: "Cheveux", icon: "cut-outline" as const },
  { label: "Parfum", icon: "water-outline" as const },
];

export default function HomeScreen() {
  const router = useRouter();
  const { addToCart, totalCount } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [detailProduct, setDetailProduct] = useState<ProductItem | null>(null);

  useFocusEffect(
    useCallback(() => {
      api.getProducts().then((data) => {
        setProducts(Array.isArray(data) ? data : data.results ?? []);
      }).catch(() => {});
      api.getCategories().then(setCategories).catch(() => {});
    }, [])
  );

  function handleCategoryPress(label: string) {
    const cat = categories.find((c) => c.name.toLowerCase() === label.toLowerCase());
    router.push({ pathname: "/catalog", params: cat ? { category: cat.slug } : {} });
  }

  function toProductItem(p: Product): ProductItem {
    return {
      id: p.id, title: p.title, price: p.price,
      image: p.image ?? undefined,
      description: p.description, stock: p.stock, is_available: p.is_available,
    };
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ width: 40 }} />
          <Text style={styles.logo}>LUMINA</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => router.push("/cart")}>
              <Ionicons name="bag-outline" size={22} color={colors.onSurfaceVariant} />
              {totalCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{totalCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}>NOUVELLE COLLECTION</Text>
            <Text style={styles.heroTitle}>L'Éclat Pur,{'\n'}Réinventé.</Text>
            <TouchableOpacity style={styles.heroBtn} onPress={() => router.push("/catalog")} activeOpacity={0.85}>
              <Text style={styles.heroBtnText}>Découvrir</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explorer</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat.label} style={styles.catItem} activeOpacity={0.7} onPress={() => handleCategoryPress(cat.label)}>
                <View style={styles.catCircle}>
                  <Ionicons name={cat.icon} size={24} color={colors.primary} />
                </View>
                <Text style={styles.catLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tendances</Text>
            <TouchableOpacity onPress={() => router.push("/catalog")}>
              <Text style={styles.seeAll}>Tout Voir</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.grid}>
            {products.slice(0, 4).map((item, index) => (
              <ProductCard
                key={item.id}
                product={toProductItem(item)}
                index={index}
                onAdd={addToCart}
                onSeeMore={() => setDetailProduct(toProductItem(item))}
              />
            ))}
          </View>
          {products.length === 0 && (
            <Text style={styles.empty}>Aucun produit pour le moment.</Text>
          )}
        </View>

        <View style={styles.ctaSection}>
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Vous êtes vendeuse ?</Text>
            <Text style={styles.ctaSubtitle}>Ouvrez votre boutique LUMINA et vendez vos produits beauté.</Text>
            <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push("/register")} activeOpacity={0.85}>
              <Text style={styles.ctaBtnText}>Créer un compte vendeur</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
      <ProductDetailSheet visible={!!detailProduct} product={detailProduct} onClose={() => setDetailProduct(null)} />
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logo: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 4,
  },
  headerRight: { width: 40, alignItems: "flex-end", position: "relative" },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: colors.onPrimary, fontSize: 10, fontWeight: "700" },

  hero: {
    marginHorizontal: 16,
    height: 260,
    borderRadius: 16,
    backgroundColor: colors.roseLight,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(138,72,83,0.25)",
  },
  heroContent: { padding: 20, zIndex: 1 },
  heroLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.onSurface,
    lineHeight: 34,
    marginBottom: 14,
  },
  heroBtn: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 999,
  },
  heroBtnText: { color: colors.onPrimary, fontSize: 13, fontWeight: "600" },

  section: { marginTop: 32, paddingHorizontal: 16 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.onSurface,
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  categoriesRow: { gap: 20, paddingBottom: 8 },
  catItem: { alignItems: "center", width: 72 },
  catCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.roseLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  catLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.onSurfaceVariant,
    letterSpacing: 0.5,
    textAlign: "center",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  empty: { textAlign: "center", color: colors.outline, marginTop: 20 },

  ctaSection: { marginTop: 32, paddingHorizontal: 16 },
  ctaCard: {
    backgroundColor: colors.roseLight,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  ctaTitle: { fontSize: 18, fontWeight: "700", color: colors.onSurface, textAlign: "center" },
  ctaSubtitle: { fontSize: 13, color: colors.onSurfaceVariant, textAlign: "center", marginTop: 6, marginBottom: 16 },
  ctaBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 999,
  },
  ctaBtnText: { color: colors.onPrimary, fontWeight: "600", fontSize: 13 },
});

import React, { useCallback, useState } from "react";
import { View, Text, FlatList, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api, Product, Category } from "@/lib/api";
import { colors } from "@/lib/theme";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";

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

  useFocusEffect(
    useCallback(() => {
      api.getProducts().then((data) => {
        setProducts(Array.isArray(data) ? data : data.results ?? []);
      }).catch(() => {});
    }, [])
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="menu" size={22} color={colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.logo}>LUMINA</Text>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push("/cart")}>
            <Ionicons name="bag-outline" size={22} color={colors.onSurface} />
            {totalCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}>NOUVELLE COLLECTION</Text>
            <Text style={styles.heroTitle}>L'Éclat Pur,{'\n'}Réinventé.</Text>
            <TouchableOpacity style={styles.heroBtn} onPress={() => router.push("/catalog")}>
              <Text style={styles.heroBtnText}>Découvrir</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explorer</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat.label} style={styles.catItem} activeOpacity={0.7}>
                <View style={styles.catCircle}>
                  <Ionicons name={cat.icon} size={24} color={colors.onSurfaceVariant} />
                </View>
                <Text style={styles.catLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Trending */}
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
                product={{ id: item.id, title: item.title, price: item.price, image: item.image ?? undefined }}
                index={index}
                onAdd={addToCart}
              />
            ))}
          </View>
          {products.length === 0 && (
            <Text style={styles.empty}>Aucun produit pour le moment.</Text>
          )}
        </View>

        {/* Journal de Beauté (editorial) */}
        <View style={[styles.section, { marginBottom: 100 }]}>
          <Text style={styles.sectionTitle}>Journal de Beauté</Text>
          <View style={styles.editorialCard}>
            <View style={styles.editorialOverlay} />
            <View style={styles.editorialContent}>
              <Text style={styles.editorialLabel}>TUTORIEL</Text>
              <Text style={styles.editorialTitle}>Le Secret d'un Teint{'\n'}Lumineux</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  iconBtn: { padding: 4, position: "relative" },
  logo: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 4,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: colors.onPrimary, fontSize: 10, fontWeight: "700" },

  // Hero
  hero: {
    marginHorizontal: 16,
    height: 260,
    borderRadius: 16,
    backgroundColor: colors.surfaceContainerLow,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  heroContent: { padding: 20, zIndex: 1 },
  heroLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(255,255,255,0.85)",
    letterSpacing: 2,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ffffff",
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

  // Sections
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
    color: colors.outline,
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  // Categories
  categoriesRow: { gap: 20, paddingBottom: 8 },
  catItem: { alignItems: "center", width: 72 },
  catCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceContainerHigh,
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

  // Grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  empty: { textAlign: "center", color: colors.outline, marginTop: 20 },

  // Editorial
  editorialCard: {
    height: 200,
    borderRadius: 16,
    backgroundColor: colors.surfaceContainerLow,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  editorialOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  editorialContent: { padding: 20, zIndex: 1 },
  editorialLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 2,
    marginBottom: 4,
  },
  editorialTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
    lineHeight: 28,
  },
});

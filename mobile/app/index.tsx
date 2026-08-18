import React, { useCallback, useState } from "react";
import { View, Text, FlatList, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Modal, Pressable, Dimensions } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown, SlideInLeft, SlideOutLeft } from "react-native-reanimated";
import { api, Product, Category } from "@/lib/api";
import { colors } from "@/lib/theme";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = SCREEN_WIDTH * 0.78;

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
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    if (cat) {
      router.push({ pathname: "/catalog", params: { category: cat.slug } });
    } else {
      router.push("/catalog");
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setDrawerOpen(true)}>
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
            <TouchableOpacity style={styles.heroBtn} onPress={() => router.push("/catalog")} activeOpacity={0.85}>
              <Text style={styles.heroBtnText}>Découvrir</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
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

        {/* CTA Banner */}
        <View style={styles.ctaSection}>
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Vous êtes vendeuse ?</Text>
            <Text style={styles.ctaSubtitle}>Ouvrez votre boutique LUMINA et vendez vos produits beauté.</Text>
            <TouchableOpacity style={styles.ctaBtn} onPress={() => setDrawerOpen(true)} activeOpacity={0.85}>
              <Text style={styles.ctaBtnText}>En savoir plus</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Burger Drawer */}
      <Modal visible={drawerOpen} transparent animationType="none" onRequestClose={() => setDrawerOpen(false)}>
        <Pressable style={styles.drawerOverlay} onPress={() => setDrawerOpen(false)}>
          <Animated.View entering={SlideInLeft.duration(300)} exiting={SlideOutLeft.duration(200)} style={styles.drawer} onStartShouldSetResponder={() => true}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerLogo}>LUMINA</Text>
              <TouchableOpacity onPress={() => setDrawerOpen(false)}>
                <Ionicons name="close" size={22} color={colors.onSurface} />
              </TouchableOpacity>
            </View>

            <View style={styles.drawerDivider} />

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => { setDrawerOpen(false); router.push({ pathname: "/register", params: { role: "vendeuse" } }); }}
              activeOpacity={0.7}
            >
              <View style={[styles.drawerIconWrap, { backgroundColor: colors.roseLight }]}>
                <Ionicons name="storefront-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.drawerItemText}>
                <Text style={styles.drawerItemTitle}>Je suis vendeuse</Text>
                <Text style={styles.drawerItemDesc}>Créez votre boutique beauté</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.outline} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => { setDrawerOpen(false); router.push({ pathname: "/register", params: { role: "acheteuse" } }); }}
              activeOpacity={0.7}
            >
              <View style={[styles.drawerIconWrap, { backgroundColor: colors.roseLight }]}>
                <Ionicons name="bag-handle-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.drawerItemText}>
                <Text style={styles.drawerItemTitle}>Je suis acheteuse</Text>
                <Text style={styles.drawerItemDesc}>Explorez nos produits beauté</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.outline} />
            </TouchableOpacity>

            <View style={styles.drawerDivider} />

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => { setDrawerOpen(false); router.push("/catalog"); }}
              activeOpacity={0.7}
            >
              <View style={[styles.drawerIconWrap, { backgroundColor: colors.surfaceContainerHigh }]}>
                <Ionicons name="storefront-outline" size={20} color={colors.onSurfaceVariant} />
              </View>
              <View style={styles.drawerItemText}>
                <Text style={styles.drawerItemTitle}>Boutique</Text>
                <Text style={styles.drawerItemDesc}>Voir tous les produits</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.outline} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => { setDrawerOpen(false); router.push("/cart"); }}
              activeOpacity={0.7}
            >
              <View style={[styles.drawerIconWrap, { backgroundColor: colors.surfaceContainerHigh }]}>
                <Ionicons name="bag-outline" size={20} color={colors.onSurfaceVariant} />
              </View>
              <View style={styles.drawerItemText}>
                <Text style={styles.drawerItemTitle}>Mon panier</Text>
                <Text style={styles.drawerItemDesc}>{totalCount > 0 ? `${totalCount} article(s)` : "Panier vide"}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.outline} />
            </TouchableOpacity>

            <View style={styles.drawerDivider} />

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => { setDrawerOpen(false); }}
              activeOpacity={0.7}
            >
              <View style={[styles.drawerIconWrap, { backgroundColor: colors.surfaceContainerHigh }]}>
                <Ionicons name="sunny-outline" size={20} color={colors.onSurfaceVariant} />
              </View>
              <View style={styles.drawerItemText}>
                <Text style={styles.drawerItemTitle}>Mode clair</Text>
                <Text style={styles.drawerItemDesc}>Thème actuel</Text>
              </View>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            </TouchableOpacity>

            <View style={styles.drawerFooter}>
              <Text style={styles.drawerFooterText}>LUMINA — Beauty Marketplace</Text>
            </View>
          </Animated.View>
        </Pressable>
      </Modal>
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

  // Drawer
  drawerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  drawer: {
    width: DRAWER_WIDTH,
    height: "100%",
    backgroundColor: colors.surfaceContainerLowest,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  drawerLogo: { fontSize: 22, fontWeight: "700", color: colors.primary, letterSpacing: 4 },
  drawerDivider: {
    height: 1,
    backgroundColor: colors.outlineVariant,
    marginVertical: 12,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
  drawerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  drawerItemText: { flex: 1 },
  drawerItemTitle: { fontSize: 15, fontWeight: "600", color: colors.onSurface },
  drawerItemDesc: { fontSize: 12, color: colors.outline, marginTop: 1 },
  drawerFooter: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  drawerFooterText: { fontSize: 11, color: colors.outline, letterSpacing: 0.5 },
});

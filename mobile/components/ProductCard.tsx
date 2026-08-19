import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/lib/theme";
import { formatFCFA } from "@/lib/api";
import { ProductItem } from "@/contexts/CartContext";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ProductCardProps {
  product: ProductItem;
  index: number;
  onAdd?: (product: ProductItem) => void;
  onPress?: () => void;
  onSeeMore?: () => void;
}

export default function ProductCard({ product, index, onAdd, onPress, onSeeMore }: ProductCardProps) {
  const title = product.title || product.name || "Produit";
  const pressScale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: pressScale.value }] }));

  const inStock = product.stock === undefined ? true : product.stock > 0;

  return (
    <Animated.View entering={FadeInUp.delay(index * 50).springify().damping(16)} style={styles.card}>
      <AnimatedTouchable
        activeOpacity={0.9}
        style={styles.inner}
        onPress={onPress}
        onPressIn={() => { pressScale.value = withSpring(0.97, { damping: 14, stiffness: 300 }); }}
        onPressOut={() => { pressScale.value = withSpring(1, { damping: 12, stiffness: 220 }); }}
      >
        <View style={styles.imageWrap}>
          {product.image ? (
            <Image source={{ uri: product.image }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="camera-outline" size={32} color={colors.outlineVariant} />
            </View>
          )}
          {!inStock && (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>Rupture</Text>
            </View>
          )}
          {onAdd && inStock && (
            <TouchableOpacity style={styles.addBtn} onPress={() => onAdd(product)} activeOpacity={0.8}>
              <Text style={styles.addBtnText}>+</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.price}>{formatFCFA(product.price)}</Text>
          {onSeeMore && (
            <TouchableOpacity style={styles.seeMoreBtn} onPress={onSeeMore} activeOpacity={0.7}>
              <Text style={styles.seeMoreText}>Voir plus</Text>
              <Ionicons name="chevron-forward" size={12} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </AnimatedTouchable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { width: "48%", marginBottom: 8 },
  inner: { borderRadius: 12, overflow: "hidden" },
  imageWrap: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    aspectRatio: 4 / 5,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  placeholder: { flex: 1, justifyContent: "center", alignItems: "center" },
  outOfStockBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: colors.errorContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  outOfStockText: { color: colors.error, fontSize: 10, fontWeight: "700" },
  addBtn: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  addBtnText: { color: colors.onPrimary, fontSize: 18, fontWeight: "700", marginTop: -1 },
  info: { paddingHorizontal: 4, paddingTop: 8, paddingBottom: 4 },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.onSurface,
  },
  price: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
    marginTop: 2,
  },
  seeMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 4,
  },
  seeMoreText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
});

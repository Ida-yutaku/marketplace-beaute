import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { colors } from "@/lib/theme";
import { ProductItem } from "@/contexts/CartContext";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ProductCardProps {
  product: ProductItem;
  index: number;
  onAdd?: (product: ProductItem) => void;
  onPress?: () => void;
}

export default function ProductCard({ product, index, onAdd, onPress }: ProductCardProps) {
  const title = product.title || product.name || "Produit";
  const pressScale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: pressScale.value }] }));

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
              <Text style={styles.placeholderEmoji}>🧴</Text>
            </View>
          )}
          {onAdd && (
            <TouchableOpacity style={styles.addBtn} onPress={() => onAdd(product)} activeOpacity={0.8}>
              <Text style={styles.addBtnText}>+</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.price}>{product.price} €</Text>
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
  placeholderEmoji: { fontSize: 36 },
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
    fontFamily: undefined,
  },
  price: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.secondary,
    marginTop: 2,
  },
});

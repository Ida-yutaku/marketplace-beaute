import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { COLORS, CAPSULE_VARIANTS, SPACING, RADIUS, FONTS, TYPE_SCALE } from "@/constants/theme";
import { ProductItem } from "@/contexts/CartContext";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ProductCardProps {
  product: ProductItem;
  index: number;
  onAdd: (product: ProductItem) => void;
}

export default function ProductCard({ product, index, onAdd }: ProductCardProps) {
  const title = product.title || product.name || "Produit";
  const capsuleColor = CAPSULE_VARIANTS[index % CAPSULE_VARIANTS.length];

  // Léger enfoncement au clic sur le bouton "Ajouter" — le seul geste de
  // pression de l'écran, pour que la carte se sente réactive sans surcharger.
  const pressScale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const handlePressIn = () => {
    pressScale.value = withSpring(0.94, { damping: 14, stiffness: 300 });
  };
  const handlePressOut = () => {
    pressScale.value = withSpring(1, { damping: 12, stiffness: 220 });
  };

  return (
    // Entrée en fondu + léger glissement, décalée par index : les cartes
    // "éclosent" en cascade au chargement plutôt que d'apparaître en bloc.
    <Animated.View
      entering={FadeInUp.delay(index * 60).springify().damping(16)}
      style={styles.card}
    >
      <View style={[styles.imageCapsule, { backgroundColor: capsuleColor }]}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.image} />
        ) : (
          <Text style={{ fontSize: 34 }}>🧴</Text>
        )}
      </View>

      <Text style={styles.price}>{product.price} €</Text>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <AnimatedTouchable
        style={[styles.addBtn, buttonStyle]}
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onAdd(product)}
      >
        <Text style={styles.addBtnText}>+ Ajouter</Text>
      </AnimatedTouchable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "47%",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  imageCapsule: {
    width: "100%",
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.sm,
    overflow: "hidden",
  },
  image: {
    width: "75%",
    height: "75%",
    resizeMode: "contain",
  },
  price: {
    fontSize: TYPE_SCALE.title,
    fontFamily: FONTS.price,
    color: COLORS.primaryText,
  },
  title: {
    fontSize: TYPE_SCALE.caption,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 2,
    marginBottom: SPACING.sm,
  },
  addBtn: {
    backgroundColor: COLORS.primaryDark,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    width: "100%",
    alignItems: "center",
  },
  addBtnText: {
    fontSize: TYPE_SCALE.caption,
    color: COLORS.white,
    fontWeight: "bold",
  },
});

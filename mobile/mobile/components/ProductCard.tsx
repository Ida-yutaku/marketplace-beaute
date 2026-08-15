import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { COLORS, CAPSULE_VARIANTS, SPACING, RADIUS, FONTS, TYPE_SCALE } from "@/constants/theme";
import { ProductItem } from "@/contexts/CartContext";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity) as React.ComponentType<any>;

interface ProductCardProps {
  product: ProductItem;
  index: number;
  onAdd: (product: ProductItem) => void;
}

export default function ProductCard({ product, index, onAdd }: ProductCardProps) {
  const title = product.title || product.name || "Produit";
  const capsuleColor = CAPSULE_VARIANTS[index % CAPSULE_VARIANTS.length];
  const [justAdded, setJustAdded] = useState(false);

  // Léger enfoncement au clic sur le bouton "Ajouter".
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

  // "Puce" qui s'envole de la carte vers le coin supérieur droit (où se
  // trouve le panier dans le header) au moment de l'ajout — un feedback
  // visuel satisfaisant sans dépendre d'une mesure exacte de position.
  const flyProgress = useSharedValue(0);
  const flyOpacity = useSharedValue(0);
  const [flying, setFlying] = useState(false);

  const flyStyle = useAnimatedStyle(() => {
    const arcUp = -flyProgress.value * 90 + Math.sin(flyProgress.value * Math.PI) * -20;
    const arcRight = flyProgress.value * 140;
    const scale = 1 - flyProgress.value * 0.6;
    return {
      opacity: flyOpacity.value,
      transform: [{ translateY: arcUp }, { translateX: arcRight }, { scale }],
    };
  });

  function handleAdd() {
    onAdd(product);

    // Morph du bouton "+ Ajouter" -> "✓ Ajouté" pendant ~900ms.
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);

    // Lance la puce volante.
    setFlying(true);
    flyProgress.value = 0;
    flyOpacity.value = 1;
    flyProgress.value = withTiming(1, { duration: 550, easing: Easing.out(Easing.quad) });
    flyOpacity.value = withSequence(
      withTiming(1, { duration: 350 }),
      withTiming(0, { duration: 200 }, (finished) => {
        if (finished) runOnJS(setFlying)(false);
      })
    );
  }

  return (
    // Entrée en fondu + léger glissement, décalée par index : les cartes
    // "éclosent" en cascade au chargement plutôt que d'apparaître en bloc.
    <Animated.View
      entering={FadeInUp.delay(index * 60).springify().damping(16)}
      style={styles.card}
    >
      <View style={styles.imageWrap}>
        <View style={[styles.imageCapsule, { backgroundColor: capsuleColor }]}>
          {product.image ? (
            <Image source={{ uri: product.image }} style={styles.image} />
          ) : (
            <Text style={{ fontSize: 34 }}>🧴</Text>
          )}
        </View>
        {flying && (
          <Animated.View style={[styles.flyChip, flyStyle]} pointerEvents="none">
            <Text style={styles.flyChipText}>🛍️</Text>
          </Animated.View>
        )}
      </View>

      <Text style={styles.price}>{product.price} FCFA</Text>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <AnimatedTouchable
        style={[styles.addBtn, buttonStyle, justAdded && styles.addBtnDone]}
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleAdd}
      >
        <Text style={styles.addBtnText}>{justAdded ? "✓ Ajouté" : "+ Ajouter"}</Text>
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
  imageWrap: {
    width: "100%",
    marginBottom: SPACING.sm,
  },
  imageCapsule: {
    width: "100%",
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  flyChip: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  flyChipText: {
    fontSize: 14,
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
  addBtnDone: {
    backgroundColor: "#16a34a",
  },
  addBtnText: {
    fontSize: TYPE_SCALE.caption,
    color: COLORS.white,
    fontWeight: "bold",
  },
});

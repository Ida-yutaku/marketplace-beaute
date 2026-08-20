import React from "react";
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/lib/theme";
import { formatFCFA, mediaUrl } from "@/lib/api";
import { ProductItem, useCart } from "@/contexts/CartContext";
import InteractiveHoverButton from "./InteractiveHoverButton";

interface Props {
  visible: boolean;
  product: ProductItem | null;
  onClose: () => void;
}

export default function ProductDetailSheet({ visible, product, onClose }: Props) {
  const { addToCart } = useCart();
  if (!product) return null;

  const inStock = product.stock === undefined ? true : product.stock > 0;
  const title = product.title || product.name || "Produit";

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.sheet}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {product.image && (
              <Image source={{ uri: mediaUrl(product.image) }} style={styles.image} />
            )}
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.price}>{formatFCFA(product.price)}</Text>

            <View style={styles.stockRow}>
              <View style={[styles.stockBadge, inStock ? styles.inStock : styles.outOfStock]}>
                <Text style={[styles.stockText, inStock ? styles.stockTextIn : styles.stockTextOut]}>
                  {inStock ? "En stock" : "Rupture de stock"}
                </Text>
              </View>
            </View>

            {product.description ? (
              <View style={styles.descSection}>
                <Text style={styles.descLabel}>Description</Text>
                <Text style={styles.descText}>{product.description}</Text>
              </View>
            ) : null}
          </ScrollView>

          <View style={styles.footer}>
            <InteractiveHoverButton
              disabled={!inStock}
              onPress={() => {
                addToCart(product);
                onClose();
              }}
              style={{ flex: 1, borderRadius: 12 }}
            >
              <Ionicons name="cart-outline" size={18} color={colors.onPrimary} />
              {inStock ? "Ajouter au panier" : "Indisponible"}
            </InteractiveHoverButton>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={colors.onSurface} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  scrollContent: { padding: 20 },
  image: {
    width: "100%",
    height: 240,
    borderRadius: 14,
    marginBottom: 16,
    resizeMode: "cover",
  },
  title: {
    fontSize: 22,
    fontFamily: "Playfair-Bold",
    color: colors.onSurface,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
    marginTop: 4,
  },
  stockRow: { flexDirection: "row", marginTop: 12 },
  stockBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  inStock: { backgroundColor: colors.primaryContainer },
  outOfStock: { backgroundColor: colors.errorContainer },
  stockText: { fontSize: 13, fontWeight: "600" },
  stockTextIn: { color: colors.onPrimaryContainer },
  stockTextOut: { color: colors.error },
  descSection: { marginTop: 16 },
  descLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  descText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.onSurface,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 10,
  },
  addBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  addBtnDisabled: { opacity: 0.5 },
  addBtnText: {
    color: colors.onPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceContainerLow,
    justifyContent: "center",
    alignItems: "center",
  },
});

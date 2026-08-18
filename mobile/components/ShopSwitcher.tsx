import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Shop } from "@/lib/api";
import { colors } from "@/lib/theme";

type Props = {
  visible: boolean;
  shops: Shop[];
  selectedShopId: number | null;
  onSelect: (shop: Shop) => void;
  onClose: () => void;
};

export default function ShopSwitcher({
  visible,
  shops,
  selectedShopId,
  onSelect,
  onClose,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.container} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Choisir une boutique</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.shopItem, selectedShopId === null && styles.shopItemActive]}
            onPress={() => {
              onSelect({ id: 0 } as Shop);
              onClose();
            }}
          >
            <View style={[styles.shopIcon, selectedShopId === null && styles.shopIconActive]}>
              <Ionicons
                name="apps-outline"
                size={20}
                color={selectedShopId === null ? colors.onPrimary : colors.primary}
              />
            </View>
            <Text style={[styles.shopName, selectedShopId === null && styles.shopNameActive]}>
              Toutes mes boutiques
            </Text>
            {selectedShopId === null && (
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            )}
          </TouchableOpacity>

          <View style={styles.divider} />

          <FlatList
            data={shops}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.shopItem, selectedShopId === item.id && styles.shopItemActive]}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <View style={[styles.shopIcon, selectedShopId === item.id && styles.shopIconActive]}>
                  <Ionicons
                    name="storefront"
                    size={20}
                    color={selectedShopId === item.id ? colors.onPrimary : colors.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.shopName, selectedShopId === item.id && styles.shopNameActive]}>
                    {item.name}
                  </Text>
                  {!!item.description && (
                    <Text style={styles.shopDesc} numberOfLines={1}>
                      {item.description}
                    </Text>
                  )}
                </View>
                {selectedShopId === item.id && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
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
  container: {
    backgroundColor: colors.surfaceContainerLowest,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%",
    paddingBottom: 40,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.outlineVariant,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.onSurface,
  },
  closeBtn: { padding: 4 },
  divider: {
    height: 1,
    backgroundColor: colors.outlineVariant,
    marginHorizontal: 16,
  },
  shopItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  shopItemActive: {
    backgroundColor: colors.roseBg,
  },
  shopIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.roseLight,
    justifyContent: "center",
    alignItems: "center",
  },
  shopIconActive: {
    backgroundColor: colors.primary,
  },
  shopName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: colors.onSurface,
  },
  shopNameActive: {
    color: colors.primary,
  },
  shopDesc: {
    fontSize: 12,
    color: colors.outline,
    marginTop: 2,
  },
});

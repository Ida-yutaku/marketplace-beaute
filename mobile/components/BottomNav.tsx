import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/lib/theme";

type Tab = {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
  path: string;
};

const TABS: Tab[] = [
  { name: "Accueil", icon: "home-outline", iconActive: "home", path: "/home" },
  { name: "Boutique", icon: "storefront-outline", iconActive: "storefront", path: "/catalog" },
  { name: "Panier", icon: "bag-outline", iconActive: "bag", path: "/cart" },
  { name: "Profil", icon: "person-outline", iconActive: "person", path: "/vendeur" },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  function isActive(tabPath: string) {
    return pathname === tabPath || pathname.startsWith(tabPath + "/");
  }

  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const active = isActive(tab.path);
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            activeOpacity={0.7}
            onPress={() => router.push(tab.path as any)}
          >
            <Ionicons
              name={active ? tab.iconActive : tab.icon}
              size={22}
              color={active ? colors.primary : colors.outline}
            />
            <Text style={[styles.label, active && styles.labelActive]}>
              {tab.name}
            </Text>
            {active && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLowest,
    paddingBottom: 24,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    width: 64,
    gap: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: "500",
    color: colors.outline,
    letterSpacing: 0.5,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: "600",
  },
  indicator: {
    width: 20,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
    marginTop: 2,
  },
});

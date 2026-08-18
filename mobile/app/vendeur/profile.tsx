import { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { api, Me } from "@/lib/api";
import { colors } from "@/lib/theme";
import { confirmAlert } from "@/lib/alert";
import SellerBottomNav from "@/components/SellerBottomNav";

export default function VendorProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<Me | null>(null);

  useFocusEffect(
    useCallback(() => {
      api.me().then(setUser).catch(() => {});
    }, [])
  );

  function handleLogout() {
    confirmAlert("Déconnexion", "Tu veux vraiment te déconnecter ?", async () => {
      await api.logout();
      router.replace("/login");
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerLabel}>ESPACE VENDEUR</Text>
          <Text style={styles.headerTitle}>Mon Profil</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Avatar */}
        <Animated.View entering={FadeInDown.delay(60)} style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={colors.primary} />
          </View>
          <Text style={styles.username}>{user?.username || "..."}</Text>
          <Text style={styles.email}>{user?.email || ""}</Text>
          <View style={styles.roleBadge}>
            <Ionicons name="storefront" size={12} color={colors.primary} />
            <Text style={styles.roleText}>Vendeuse</Text>
          </View>
        </Animated.View>

        {/* Info Cards */}
        <Animated.View entering={FadeInDown.delay(120)} style={styles.section}>
          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: colors.roseLight }]}>
              <Ionicons name="mail-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.infoBody}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email || "—"}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: colors.roseLight }]}>
              <Ionicons name="call-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.infoBody}>
              <Text style={styles.infoLabel}>Téléphone</Text>
              <Text style={styles.infoValue}>{user?.phone || "—"}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Quick actions */}
        <Animated.View entering={FadeInDown.delay(180)} style={styles.section}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => router.push("/vendeur/boutiques")}
            activeOpacity={0.7}
          >
            <Ionicons name="storefront-outline" size={20} color={colors.onSurfaceVariant} />
            <Text style={styles.actionText}>Mes boutiques</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.outline} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => router.push("/vendeur")}
            activeOpacity={0.7}
          >
            <Ionicons name="grid-outline" size={20} color={colors.onSurfaceVariant} />
            <Text style={styles.actionText}>Dashboard</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.outline} />
          </TouchableOpacity>
        </Animated.View>

        {/* Logout */}
        <Animated.View entering={FadeInDown.delay(240)}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <SellerBottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerLabel: { fontSize: 10, fontWeight: "600", color: colors.primary, letterSpacing: 1.5 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: colors.onSurface, marginTop: 2 },

  content: { flex: 1, padding: 16 },

  /* Avatar */
  avatarWrap: { alignItems: "center", marginBottom: 28 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.roseLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  username: { fontSize: 18, fontWeight: "700", color: colors.onSurface },
  email: { fontSize: 13, color: colors.outline, marginTop: 2 },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.roseBg,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    marginTop: 10,
  },
  roleText: { fontSize: 12, fontWeight: "600", color: colors.primary },

  /* Info */
  section: { marginBottom: 24 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  infoBody: { flex: 1 },
  infoLabel: { fontSize: 11, color: colors.outline, fontWeight: "500" },
  infoValue: { fontSize: 14, color: colors.onSurface, fontWeight: "600", marginTop: 1 },

  /* Actions */
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  actionText: { flex: 1, fontSize: 15, fontWeight: "600", color: colors.onSurface },

  /* Logout */
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    marginTop: 8,
    backgroundColor: colors.errorContainer,
    borderRadius: 12,
  },
  logoutText: { color: colors.error, fontWeight: "700", fontSize: 14 },
});

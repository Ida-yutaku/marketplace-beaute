import { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api, Me } from "@/lib/api";
import { colors } from "@/lib/theme";
import { confirmAlert } from "@/lib/alert";
import BottomNav from "@/components/BottomNav";

export default function ProfileScreen() {
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
      router.replace("/");
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Mon Profil</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={colors.primary} />
          </View>
          <Text style={styles.username}>{user?.username || "..."}</Text>
          <Text style={styles.email}>{user?.email || ""}</Text>
        </View>

        <View style={styles.section}>
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

          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: colors.roseLight }]}>
              <Ionicons name="bag-handle-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.infoBody}>
              <Text style={styles.infoLabel}>Compte</Text>
              <Text style={styles.infoValue}>Acheteuse</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.actionRow} onPress={() => router.push("/cart")} activeOpacity={0.7}>
            <Ionicons name="bag-outline" size={20} color={colors.onSurfaceVariant} />
            <Text style={styles.actionText}>Mon panier</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.outline} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: { fontSize: 20, fontWeight: "700", color: colors.onSurface },
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  avatarWrap: { alignItems: "center", marginBottom: 32 },
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
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  actionText: { flex: 1, fontSize: 15, fontWeight: "600", color: colors.onSurface },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    marginTop: 16,
    backgroundColor: colors.errorContainer,
    borderRadius: 12,
  },
  logoutText: { color: colors.error, fontWeight: "700", fontSize: 14 },
});

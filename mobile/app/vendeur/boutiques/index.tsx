import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { api, Shop } from "@/lib/api";
import { colors } from "@/lib/theme";
import { showAlert } from "@/lib/alert";
import BottomNav from "@/components/BottomNav";

export default function BoutiquesScreen() {
  const router = useRouter();
  const [shops, setShops] = useState<Shop[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const loadShops = useCallback(async () => {
    try {
      const data = await api.getMyShops();
      setShops(Array.isArray(data) ? data : data.results ?? []);
    } catch {
      showAlert("Erreur", "Impossible de charger tes boutiques.");
    }
  }, []);

  useFocusEffect(useCallback(() => { loadShops(); }, [loadShops]));

  async function handleCreate() {
    if (!name.trim()) {
      showAlert("Nom manquant", "Donne un nom à ta boutique.");
      return;
    }
    setLoading(true);
    try {
      await api.createShop({ name, description });
      setName("");
      setDescription("");
      loadShops();
    } catch {
      showAlert("Erreur", "La création a échoué.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.onSurface} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerLabel}>ESPACE VENDEUR</Text>
          <Text style={styles.headerTitle}>Mes boutiques</Text>
        </View>
        <View style={{ width: 30 }} />
      </View>

      <FlatList
        data={shops}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Animated.View entering={FadeInDown.delay(100)} style={styles.emptyWrap}>
            <Ionicons name="storefront-outline" size={48} color={colors.outlineVariant} />
            <Text style={styles.emptyText}>Aucune boutique</Text>
            <Text style={styles.emptyHint}>Crée ta première boutique ci-dessous</Text>
          </Animated.View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 60).springify().damping(16)}>
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => {}}
            >
              <View style={styles.cardIcon}>
                <Ionicons name="storefront" size={20} color={colors.primary} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                {!!item.description && (
                  <Text style={styles.cardDesc} numberOfLines={2}>
                    {item.description}
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.outlineVariant} />
            </TouchableOpacity>
          </Animated.View>
        )}
        ListFooterComponent={
          <Animated.View entering={FadeInDown.delay(200)} style={styles.formCard}>
            <Text style={styles.formTitle}>Créer une boutique</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom de la boutique"
              placeholderTextColor={colors.outline}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Description (optionnel)"
              placeholderTextColor={colors.outline}
              multiline
              numberOfLines={3}
              value={description}
              onChangeText={setDescription}
            />
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleCreate}
              disabled={loading}
              activeOpacity={0.85}
            >
              <Ionicons name="add-circle-outline" size={18} color={colors.onPrimary} />
              <Text style={styles.buttonText}>{loading ? "Création..." : "Créer la boutique"}</Text>
            </TouchableOpacity>
          </Animated.View>
        }
      />

      <BottomNav />
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
    gap: 12,
  },
  backBtn: { padding: 4 },
  headerLabel: { fontSize: 10, fontWeight: "600", color: colors.primary, letterSpacing: 1.5 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: colors.onSurface, marginTop: 2 },
  list: { padding: 16, paddingBottom: 100, gap: 10 },

  /* Empty */
  emptyWrap: { alignItems: "center", marginTop: 60, gap: 6 },
  emptyText: { fontWeight: "600", fontSize: 16, color: colors.onSurfaceVariant },
  emptyHint: { fontSize: 13, color: colors.outline },

  /* Shop card */
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    gap: 14,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.roseLight,
    justifyContent: "center",
    alignItems: "center",
  },
  cardBody: { flex: 1 },
  cardTitle: { fontWeight: "700", fontSize: 15, color: colors.onSurface },
  cardDesc: { color: colors.outline, fontSize: 12, marginTop: 3 },

  /* Create form */
  formCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    gap: 10,
  },
  formTitle: {
    fontWeight: "700",
    color: colors.onSurface,
    fontSize: 16,
    marginBottom: 2,
  },
  input: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    color: colors.onSurface,
    fontSize: 14,
  },
  textarea: { height: 72, textAlignVertical: "top" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 999,
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.onPrimary, fontWeight: "700", fontSize: 14 },
});

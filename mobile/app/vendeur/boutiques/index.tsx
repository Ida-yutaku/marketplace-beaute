import { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api, Shop } from "@/lib/api";
import { colors } from "@/lib/theme";
import { showAlert } from "@/lib/alert";

export default function BoutiquesScreen() {
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="storefront-outline" size={24} color={colors.primary} />
        <Text style={styles.title}>Mes boutiques</Text>
      </View>

      <FlatList
        data={shops}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="storefront-outline" size={40} color={colors.outlineVariant} />
            <Text style={styles.empty}>Aucune boutique pour le moment.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <Ionicons name="storefront" size={20} color={colors.primary} />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              {!!item.description && <Text style={styles.cardDesc}>{item.description}</Text>}
            </View>
          </View>
        )}
      />

      <View style={styles.form}>
        <Text style={styles.formTitle}>Créer une boutique</Text>
        <TextInput style={styles.input} placeholder="Nom de la boutique" placeholderTextColor={colors.outline} value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Description (optionnel)" placeholderTextColor={colors.outline} value={description} onChangeText={setDescription} />
        <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={loading} activeOpacity={0.85}>
          <Text style={styles.buttonText}>{loading ? "Création..." : "+ Créer"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  header: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: "700", color: colors.onSurface },
  list: { paddingBottom: 8 },
  emptyWrap: { alignItems: "center", marginTop: 40, gap: 8 },
  empty: { color: colors.outline, fontSize: 14 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.roseLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardBody: { flex: 1 },
  cardTitle: { fontWeight: "700", fontSize: 15, color: colors.onSurface },
  cardDesc: { color: colors.outline, fontSize: 12, marginTop: 2 },
  form: { borderTopWidth: 1, borderTopColor: colors.outlineVariant, paddingTop: 16, marginTop: 8 },
  formTitle: { fontWeight: "700", marginBottom: 8, color: colors.onSurface, fontSize: 15 },
  input: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.rose,
    color: colors.onSurface,
    fontSize: 14,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  buttonText: { color: colors.onPrimary, fontWeight: "700", fontSize: 14 },
});

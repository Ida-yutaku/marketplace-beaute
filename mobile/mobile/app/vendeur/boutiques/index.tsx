import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { api, Shop } from "@/lib/api";

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
      Alert.alert("Erreur", "Impossible de charger tes boutiques.");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadShops();
    }, [loadShops])
  );

  async function handleCreate() {
    if (!name.trim()) {
      Alert.alert("Nom manquant", "Donne un nom à ta boutique.");
      return;
    }
    setLoading(true);
    try {
      await api.createShop({ name, description });
      setName("");
      setDescription("");
      loadShops();
    } catch {
      Alert.alert("Erreur", "La création a échoué.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes boutiques</Text>

      <FlatList
        data={shops}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text style={styles.empty}>Aucune boutique pour le moment.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            {!!item.description && <Text style={styles.cardDesc}>{item.description}</Text>}
          </View>
        )}
      />

      <View style={styles.form}>
        <Text style={styles.formTitle}>Créer une nouvelle boutique</Text>
        <TextInput
          style={styles.input}
          placeholder="Nom de la boutique"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Description (optionnel)"
          value={description}
          onChangeText={setDescription}
        />
        <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Création..." : "+ Créer la boutique"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FBEEF3", padding: 16 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 12, color: "#7A2048" },
  empty: { color: "#9ca3af", textAlign: "center", marginTop: 20 },
  card: { backgroundColor: "white", borderRadius: 12, padding: 14, marginBottom: 10 },
  cardTitle: { fontWeight: "700", fontSize: 15, color: "#1f2937" },
  cardDesc: { color: "#6b7280", fontSize: 12, marginTop: 2 },
  form: { marginTop: 16, borderTopWidth: 1, borderTopColor: "#f0d5e0", paddingTop: 16 },
  formTitle: { fontWeight: "700", marginBottom: 8, color: "#1f2937" },
  input: { backgroundColor: "white", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 10 },
  button: { backgroundColor: "#7A2048", paddingVertical: 14, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "700" },
});

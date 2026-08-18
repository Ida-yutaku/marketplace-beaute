import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator, SafeAreaView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api, Category, Product } from "@/lib/api";
import { colors } from "@/lib/theme";

export default function EditProductScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = Number(id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ title: "", description: "", price: "", stock: "", category_id: "" });
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [newImageUri, setNewImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
    api.getProduct(productId).then((p: Product) => {
      setForm({
        title: p.title, description: p.description, price: p.price,
        stock: String(p.stock), category_id: p.category ? String(p.category.id) : "",
      });
      setCurrentImage(p.image);
      setLoading(false);
    });
  }, [productId]);

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!result.canceled) setNewImageUri(result.assets[0].uri);
  }

  async function handleSubmit() {
    setSaving(true);
    try {
      await api.updateProduct(productId, {
        title: form.title, description: form.description,
        price: form.price, stock: Number(form.stock),
        category_id: Number(form.category_id),
      });
      if (newImageUri) await api.uploadProductImage(productId, newImageUri);
      alert("Modifications enregistrées");
      router.replace("/vendeur");
    } catch {
      alert("Erreur lors de la modification.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier l'annonce</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage} activeOpacity={0.8}>
          {newImageUri || currentImage ? (
            <Image source={{ uri: newImageUri || currentImage! }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera-outline" size={32} color={colors.outline} />
              <Text style={styles.imagePickerText}>Ajouter une photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Titre</Text>
        <TextInput style={styles.input} placeholder="Titre du produit" placeholderTextColor={colors.outline} value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} />

        <Text style={styles.label}>Description</Text>
        <TextInput style={[styles.input, styles.textarea]} placeholder="Description" placeholderTextColor={colors.outline} multiline numberOfLines={4} value={form.description} onChangeText={(v) => setForm({ ...form, description: v })} />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Prix (€)</Text>
            <TextInput style={styles.input} placeholder="0.00" placeholderTextColor={colors.outline} keyboardType="decimal-pad" value={form.price} onChangeText={(v) => setForm({ ...form, price: v })} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Stock</Text>
            <TextInput style={styles.input} placeholder="0" placeholderTextColor={colors.outline} keyboardType="number-pad" value={form.stock} onChangeText={(v) => setForm({ ...form, stock: v })} />
          </View>
        </View>

        <Text style={styles.label}>Catégorie</Text>
        <View style={styles.pickerWrap}>
          <Picker selectedValue={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
            <Picker.Item label="Choisir une catégorie" value="" />
            {categories.map((c) => <Picker.Item key={c.id} label={c.name} value={String(c.id)} />)}
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={saving} activeOpacity={0.85}>
          <Text style={styles.buttonText}>{saving ? "Enregistrement..." : "Enregistrer"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: colors.onSurface },
  container: { flex: 1 },
  content: { padding: 16, gap: 10, paddingBottom: 40 },
  label: { fontSize: 12, fontWeight: "600", color: colors.onSurfaceVariant, marginBottom: 6, marginLeft: 2 },
  input: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    fontSize: 15,
    color: colors.onSurface,
  },
  textarea: { height: 90, textAlignVertical: "top" },
  row: { flexDirection: "row", gap: 12 },
  pickerWrap: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  imagePicker: {
    height: 160,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderStyle: "dashed",
    overflow: "hidden",
  },
  imagePlaceholder: { flex: 1, justifyContent: "center", alignItems: "center", gap: 6 },
  imagePickerText: { color: colors.outline, fontSize: 13 },
  imagePreview: { width: "100%", height: "100%", resizeMode: "cover" },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: colors.onPrimary, fontWeight: "700", fontSize: 15 },
});

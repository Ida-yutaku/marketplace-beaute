import { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { api, Category, Shop } from "@/lib/api";
import { colors } from "@/lib/theme";
import { showAlert } from "@/lib/alert";

export default function NewProductScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [form, setForm] = useState({ title: "", description: "", price: "", stock: "1", category_id: "", shop_id: "" });
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
    api.getMyShops().then((data) => setShops(Array.isArray(data) ? data : data.results ?? [])).catch(() => {});
  }, []);

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showAlert("Permission refusée", "Autorise l'accès à tes photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  }

  async function handleSubmit() {
    if (!form.title || !form.description || !form.price || !form.category_id || !form.shop_id) {
      showAlert("Champs manquants", "Titre, description, prix, catégorie et boutique sont obligatoires.");
      return;
    }
    setLoading(true);
    try {
      const product = await api.createProduct({
        title: form.title, description: form.description, price: form.price,
        stock: Number(form.stock), category_id: Number(form.category_id), shop_id: Number(form.shop_id),
      });
      if (imageUri) await api.uploadProductImage(product.id, imageUri);
      showAlert("Annonce publiée", "Ton annonce est en ligne.");
      router.replace("/vendeur");
    } catch {
      showAlert("Erreur", "La création a échoué.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouvelle annonce</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {shops.length === 0 && (
          <Animated.View entering={FadeInDown.delay(60)} style={styles.warning}>
            <Ionicons name="warning-outline" size={18} color="#92400E" />
            <Text style={styles.warningText}>Crée une boutique d'abord dans "Mes boutiques".</Text>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(100)}>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage} activeOpacity={0.8}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera-outline" size={32} color={colors.outline} />
                <Text style={styles.imagePickerText}>Ajouter une photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160)}>
          <Text style={styles.label}>Titre</Text>
          <TextInput style={styles.input} placeholder="Nom du produit" placeholderTextColor={colors.outline} value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)}>
          <Text style={styles.label}>Description</Text>
          <TextInput style={[styles.input, styles.textarea]} placeholder="Décris ton produit..." placeholderTextColor={colors.outline} multiline numberOfLines={4} value={form.description} onChangeText={(v) => setForm({ ...form, description: v })} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(240)} style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Prix (€)</Text>
            <TextInput style={styles.input} placeholder="0.00" placeholderTextColor={colors.outline} keyboardType="decimal-pad" value={form.price} onChangeText={(v) => setForm({ ...form, price: v })} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Stock</Text>
            <TextInput style={styles.input} placeholder="1" placeholderTextColor={colors.outline} keyboardType="number-pad" value={form.stock} onChangeText={(v) => setForm({ ...form, stock: v })} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(280)}>
          <Text style={styles.label}>Boutique</Text>
          <View style={styles.pickerWrap}>
            <Picker selectedValue={form.shop_id} onValueChange={(v) => setForm({ ...form, shop_id: v })}>
              <Picker.Item label="Choisir une boutique" value="" />
              {shops.map((s) => <Picker.Item key={s.id} label={s.name} value={String(s.id)} />)}
            </Picker>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(320)}>
          <Text style={styles.label}>Catégorie</Text>
          <View style={styles.pickerWrap}>
            <Picker selectedValue={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
              <Picker.Item label="Choisir une catégorie" value="" />
              {categories.map((c) => <Picker.Item key={c.id} label={c.name} value={String(c.id)} />)}
            </Picker>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(360)}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading} activeOpacity={0.85}>
            <Text style={styles.buttonText}>{loading ? "Publication..." : "Publier l'annonce"}</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
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
  warning: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF3C7",
    padding: 12,
    borderRadius: 10,
  },
  warningText: { color: "#92400E", fontSize: 13, flex: 1 },
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

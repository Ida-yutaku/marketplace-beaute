import { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeIn, useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence } from "react-native-reanimated";
import { api, Category, Shop } from "@/lib/api";
import { showAlert } from "@/lib/alert";
import AnimatedButton from "@/components/AnimatedButton";

export default function NewProductScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [form, setForm] = useState({ title: "", description: "", price: "", stock: "1", category_id: "", shop_id: "" });
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pulse = useSharedValue(1);
  useEffect(() => {
    if (!imageUri) {
      pulse.value = withRepeat(withSequence(withTiming(1.03, { duration: 900 }), withTiming(1, { duration: 900 })), -1);
    }
  }, [imageUri]);
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => setCategories([]));
    api.getMyShops().then((data) => setShops(Array.isArray(data) ? data : data.results ?? [])).catch(() => setShops([]));
  }, []);

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showAlert("Permission refusée", "Autorise l'accès à tes photos pour ajouter une image.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  }

  async function handleSubmit() {
    if (!form.title || !form.price || !form.category_id || !form.shop_id) {
      showAlert("Champs manquants", "Titre, prix, catégorie et boutique sont obligatoires.");
      return;
    }
    setLoading(true);
    try {
      const product = await api.createProduct({
        title: form.title,
        description: form.description,
        price: form.price,
        stock: Number(form.stock),
        category_id: Number(form.category_id),
        shop_id: Number(form.shop_id),
      });
      if (imageUri) await api.uploadProductImage(product.id, imageUri);
      showAlert("Annonce publiée", "Ton annonce est en ligne.");
      router.replace("/vendeur");
    } catch {
      showAlert("Erreur", "La création a échoué, vérifie les champs.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Animated.View entering={FadeIn.duration(400)}>
        <Text style={styles.title}>Nouvelle annonce</Text>
      </Animated.View>

      {shops.length === 0 && (
        <Animated.View entering={FadeInDown.delay(80)} style={styles.warningBox}>
          <Text style={styles.warningText}>Tu n'as encore aucune boutique. Crée-en une d'abord dans "Mes boutiques".</Text>
        </Animated.View>
      )}

      <Animated.View entering={FadeInDown.delay(100).springify()} style={pulseStyle}>
        <AnimatedButton style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? <Image source={{ uri: imageUri }} style={styles.imagePreview} /> : <Text style={styles.imagePickerText}>📷 Ajouter une photo</Text>}
        </AnimatedButton>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(160)}>
        <TextInput style={styles.input} placeholder="Titre du produit" value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(200)}>
        <TextInput style={[styles.input, styles.textarea]} placeholder="Description" multiline numberOfLines={4} value={form.description} onChangeText={(v) => setForm({ ...form, description: v })} />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(240)} style={styles.row}>
        <TextInput style={[styles.input, { flex: 1 }]} placeholder="Prix (€)" keyboardType="decimal-pad" value={form.price} onChangeText={(v) => setForm({ ...form, price: v })} />
        <TextInput style={[styles.input, { flex: 1 }]} placeholder="Stock" keyboardType="number-pad" value={form.stock} onChangeText={(v) => setForm({ ...form, stock: v })} />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(280)} style={styles.pickerWrapper}>
        <Picker selectedValue={form.shop_id} onValueChange={(v) => setForm({ ...form, shop_id: v })}>
          <Picker.Item label="Choisir une boutique" value="" />
          {shops.map((s) => <Picker.Item key={s.id} label={s.name} value={String(s.id)} />)}
        </Picker>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(320)} style={styles.pickerWrapper}>
        <Picker selectedValue={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
          <Picker.Item label="Choisir une catégorie" value="" />
          {categories.map((c) => <Picker.Item key={c.id} label={c.name} value={String(c.id)} />)}
        </Picker>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(360)}>
        <AnimatedButton style={styles.button} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Publication..." : "Publier l'annonce"}</Text>
        </AnimatedButton>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FBEEF3" },
  title: { fontSize: 20, fontWeight: "bold" },
  warningBox: { backgroundColor: "#FEF3C7", padding: 12, borderRadius: 10 },
  warningText: { color: "#92400E", fontSize: 13 },
  imagePicker: { height: 160, backgroundColor: "white", borderRadius: 10, borderWidth: 1, borderColor: "#e5e7eb", borderStyle: "dashed", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  imagePickerText: { color: "#7A2048" },
  imagePreview: { width: "100%", height: "100%" },
  input: { backgroundColor: "white", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: "#e5e7eb" },
  textarea: { height: 90, textAlignVertical: "top" },
  row: { flexDirection: "row", gap: 12 },
  pickerWrapper: { backgroundColor: "white", borderRadius: 8, borderWidth: 1, borderColor: "#e5e7eb" },
  button: { backgroundColor: "#7A2048", paddingVertical: 14, borderRadius: 10, alignItems: "center", marginTop: 8 },
  buttonText: { color: "white", fontWeight: "600", fontSize: 16 },
});

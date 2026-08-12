import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api, Category, Product } from "@/lib/api";

export default function EditProductScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = Number(id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
  });
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [newImageUri, setNewImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => setCategories([]));
    api.getProduct(productId).then((p: Product) => {
      setForm({
        title: p.title,
        description: p.description,
        price: p.price,
        stock: String(p.stock),
        category_id: p.category ? String(p.category.id) : "",
      });
      setCurrentImage(p.image);
      setLoading(false);
    });
  }, [productId]);

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission refusée", "Autorise l'accès à tes photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setNewImageUri(result.assets[0].uri);
    }
  }

  async function handleSubmit() {
    setSaving(true);
    try {
      await api.updateProduct(productId, {
        title: form.title,
        description: form.description,
        price: form.price,
        stock: Number(form.stock),
        category_id: Number(form.category_id),
      });

      if (newImageUri) {
        await api.uploadProductImage(productId, newImageUri);
      }

      Alert.alert("Modifications enregistrées");
      router.replace("/vendeur");
    } catch {
      Alert.alert("Erreur", "La modification a échoué.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#c2477a" size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={styles.title}>Modifier l'annonce</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {newImageUri || currentImage ? (
          <Image source={{ uri: newImageUri || currentImage! }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imagePickerText}>📷 Ajouter une photo</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Titre du produit"
        value={form.title}
        onChangeText={(v) => setForm({ ...form, title: v })}
      />
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Description"
        multiline
        numberOfLines={4}
        value={form.description}
        onChangeText={(v) => setForm({ ...form, description: v })}
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Prix (€)"
          keyboardType="decimal-pad"
          value={form.price}
          onChangeText={(v) => setForm({ ...form, price: v })}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Stock"
          keyboardType="number-pad"
          value={form.stock}
          onChangeText={(v) => setForm({ ...form, stock: v })}
        />
      </View>

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={form.category_id}
          onValueChange={(v) => setForm({ ...form, category_id: v })}
        >
          <Picker.Item label="Choisir une catégorie" value="" />
          {categories.map((c) => (
            <Picker.Item key={c.id} label={c.name} value={String(c.id)} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={saving}>
        <Text style={styles.buttonText}>
          {saving ? "Enregistrement..." : "Enregistrer les modifications"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf2f6" },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fdf2f6" },
  title: { fontSize: 20, fontWeight: "bold" },
  imagePicker: {
    height: 160,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  imagePickerText: { color: "#a3355f" },
  imagePreview: { width: "100%", height: "100%" },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  textarea: { height: 90, textAlignVertical: "top" },
  row: { flexDirection: "row", gap: 12 },
  pickerWrapper: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  button: {
    backgroundColor: "#c2477a",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "white", fontWeight: "600", fontSize: 16 },
});

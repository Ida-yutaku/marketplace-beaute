import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Switch, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSequence, withTiming } from "react-native-reanimated";
import { api, ApiError } from "@/lib/api";
import { colors } from "@/lib/theme";
import { showAlert } from "@/lib/alert";
import AnimatedButton from "@/components/AnimatedButton";

export default function RegisterScreen() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "", is_seller: true, shop_name: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const shake = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));

  function triggerShake() {
    shake.value = withSequence(
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(-6, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  }

  async function handleSubmit() {
    setErrors({});
    setLoading(true);
    try {
      await api.register(form);
      showAlert("Compte créé", "Tu peux maintenant te connecter.");
      router.replace("/login");
    } catch (err) {
      triggerShake();
      if (err instanceof ApiError) {
        setErrors(err.fields);
      } else {
        const message = err instanceof Error ? err.message : String(err);
        setErrors({ detail: [`Erreur réseau : ${message}`] });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 24, gap: 8, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text style={styles.title}>{form.is_seller ? "Créer un compte vendeur" : "Créer un compte acheteur"}</Text>
        </Animated.View>

        <Animated.View style={shakeStyle}>
          {!!errors.detail && <Text style={styles.errorBanner}>{errors.detail[0]}</Text>}

          <Animated.View entering={FadeInDown.delay(80).duration(400)}>
            <Text style={styles.label}>Nom d'utilisateur</Text>
            <TextInput style={[styles.input, errors.username && styles.inputError]} placeholder="Nom d'utilisateur" placeholderTextColor={colors.textMuted} value={form.username} onChangeText={(v) => setForm({ ...form, username: v })} />
          </Animated.View>
          {!!errors.username && <Text style={styles.fieldError}>{errors.username[0]}</Text>}

          <Animated.View entering={FadeInDown.delay(140).duration(400)}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={[styles.input, errors.email && styles.inputError]} placeholder="Email" placeholderTextColor={colors.textMuted} autoCapitalize="none" keyboardType="email-address" value={form.email} onChangeText={(v) => setForm({ ...form, email: v })} />
          </Animated.View>
          {!!errors.email && <Text style={styles.fieldError}>{errors.email[0]}</Text>}

          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <Text style={styles.label}>Mot de passe (8 caractères min.)</Text>
            <TextInput style={[styles.input, errors.password && styles.inputError]} placeholder="Mot de passe" placeholderTextColor={colors.textMuted} secureTextEntry value={form.password} onChangeText={(v) => setForm({ ...form, password: v })} />
          </Animated.View>
          {!!errors.password && <Text style={styles.fieldError}>{errors.password[0]}</Text>}
          {form.password.length > 0 && <Text style={styles.hint}>{form.password.length} caractère(s) saisi(s)</Text>}

          <Animated.View entering={FadeInDown.delay(260).duration(400)}>
            <Text style={styles.label}>Nom de la boutique</Text>
            <TextInput style={styles.input} placeholder="Nom de la boutique" placeholderTextColor={colors.textMuted} value={form.shop_name} onChangeText={(v) => setForm({ ...form, shop_name: v })} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(320).duration(400)} style={styles.switchRow}>
            <Text style={{ color: colors.text }}>Compte vendeur</Text>
            <Switch value={form.is_seller} onValueChange={(v) => setForm({ ...form, is_seller: v })} trackColor={{ true: colors.primary }} />
          </Animated.View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(380).duration(400)}>
          <AnimatedButton style={styles.button} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Création..." : "S'inscrire"}</Text>
          </AnimatedButton>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: { fontSize: 24, fontWeight: "800", color: colors.text, marginBottom: 12 },
  label: { fontSize: 12, fontWeight: "600", color: colors.textMuted, marginBottom: 4, marginLeft: 2 },
  input: { backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: colors.border },
  inputError: { borderColor: colors.danger },
  fieldError: { color: colors.danger, fontSize: 12, marginTop: 2, marginLeft: 4 },
  hint: { color: colors.textMuted, fontSize: 11, marginTop: 2, marginLeft: 4 },
  errorBanner: { backgroundColor: colors.dangerBg, color: colors.danger, padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 8 },
  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 },
  button: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 14, alignItems: "center", marginTop: 8 },
  buttonText: { color: "white", fontWeight: "700", fontSize: 16 },
});

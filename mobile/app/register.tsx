import { useState } from "react";
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSequence, withTiming } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { api, ApiError } from "@/lib/api";
import { colors } from "@/lib/theme";
import { showAlert } from "@/lib/alert";

export default function RegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  const isVendeuse = params.role === "vendeuse";

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    is_seller: isVendeuse,
    shop_name: "",
  });
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
      if (err instanceof ApiError) setErrors(err.fields);
      else setErrors({ detail: [`Erreur : ${err instanceof Error ? err.message : String(err)}`] });
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={colors.onSurface} />
        </TouchableOpacity>

        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <View style={styles.logoWrap}>
            <Text style={styles.logo}>LUMINA</Text>
          </View>
          <View style={[styles.roleBadge, { backgroundColor: isVendeuse ? colors.primary : colors.roseLight }]}>
            <Ionicons name={isVendeuse ? "storefront" : "bag-handle"} size={16} color={isVendeuse ? colors.onPrimary : colors.primary} />
            <Text style={[styles.roleBadgeText, { color: isVendeuse ? colors.onPrimary : colors.primary }]}>
              {isVendeuse ? "Compte Vendeuse" : "Compte Acheteuse"}
            </Text>
          </View>
          <Text style={styles.title}>Créez votre compte</Text>
          <Text style={styles.subtitle}>Rejoignez la communauté LUMINA</Text>
        </Animated.View>

        <Animated.View style={shakeStyle}>
          {!!errors.detail && <Text style={styles.errorBanner}>{errors.detail[0]}</Text>}

          <Animated.View entering={FadeInDown.delay(80).duration(400)}>
            <Text style={styles.label}>Nom d'utilisateur</Text>
            <TextInput style={[styles.input, errors.username && styles.inputError]} placeholder="Votre nom" placeholderTextColor={colors.outline} value={form.username} onChangeText={(v) => setForm({ ...form, username: v })} />
            {!!errors.username && <Text style={styles.fieldError}>{errors.username[0]}</Text>}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(140).duration(400)}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={[styles.input, errors.email && styles.inputError]} placeholder="votre@email.com" placeholderTextColor={colors.outline} autoCapitalize="none" keyboardType="email-address" value={form.email} onChangeText={(v) => setForm({ ...form, email: v })} />
            {!!errors.email && <Text style={styles.fieldError}>{errors.email[0]}</Text>}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <Text style={styles.label}>Mot de passe (8 caractères min.)</Text>
            <TextInput style={[styles.input, errors.password && styles.inputError]} placeholder="••••••••" placeholderTextColor={colors.outline} secureTextEntry value={form.password} onChangeText={(v) => setForm({ ...form, password: v })} />
            {!!errors.password && <Text style={styles.fieldError}>{errors.password[0]}</Text>}
            {form.password.length > 0 && <Text style={styles.hint}>{form.password.length} caractère(s)</Text>}
          </Animated.View>

          {form.is_seller && (
            <Animated.View entering={FadeInDown.delay(260).duration(400)}>
              <Text style={styles.label}>Nom de la boutique</Text>
              <TextInput style={styles.input} placeholder="Mon Salon" placeholderTextColor={colors.outline} value={form.shop_name} onChangeText={(v) => setForm({ ...form, shop_name: v })} />
            </Animated.View>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(320).duration(400)}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading} activeOpacity={0.85}>
            <Text style={styles.buttonText}>{loading ? "Création..." : "S'inscrire"}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/login")} style={styles.linkBtn}>
            <Text style={styles.link}>Déjà un compte ? <Text style={styles.linkBold}>Se connecter</Text></Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.roseBg },
  content: { padding: 20, gap: 6, paddingBottom: 60 },
  back: { position: "absolute", top: 50, left: 20, zIndex: 1 },
  header: { marginBottom: 20, marginTop: 20, alignItems: "center" },
  logoWrap: { marginBottom: 12 },
  logo: { fontSize: 28, fontWeight: "700", color: colors.primary, letterSpacing: 6 },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
  },
  roleBadgeText: { fontSize: 12, fontWeight: "600" },
  title: { fontSize: 24, fontWeight: "700", color: colors.onSurface, textAlign: "center" },
  subtitle: { fontSize: 14, color: colors.outline, marginTop: 4, textAlign: "center" },
  label: { fontSize: 12, fontWeight: "600", color: colors.onSurfaceVariant, marginBottom: 6, marginLeft: 2 },
  input: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.rose,
    fontSize: 15,
    color: colors.onSurface,
    marginBottom: 4,
  },
  inputError: { borderColor: colors.error },
  fieldError: { color: colors.error, fontSize: 12, marginTop: 2, marginLeft: 4, marginBottom: 6 },
  hint: { color: colors.outline, fontSize: 11, marginTop: 2, marginLeft: 4 },
  errorBanner: {
    backgroundColor: colors.errorContainer,
    color: colors.onErrorContainer,
    padding: 12,
    borderRadius: 10,
    fontSize: 13,
    marginBottom: 8,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonText: { color: colors.onPrimary, fontWeight: "700", fontSize: 15 },
  linkBtn: { marginTop: 16, alignItems: "center", marginBottom: 20 },
  link: { color: colors.outline, fontWeight: "500", fontSize: 14 },
  linkBold: { color: colors.primary, fontWeight: "700" },
});

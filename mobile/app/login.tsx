import { useState } from "react";
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSequence, withTiming } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { api, ApiError } from "@/lib/api";
import { colors } from "@/lib/theme";

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  const isVendeuse = params.role === "vendeuse";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      await api.login(email, password);
      const me = await api.me();
      router.replace(me.is_seller ? "/vendeur" : "/home");
    } catch (err) {
      triggerShake();
      if (err instanceof ApiError) setErrors(err.fields);
      else setErrors({ detail: [`Erreur : ${err instanceof Error ? err.message : String(err)}`] });
    } finally {
      setLoading(false);
    }
  }

  function switchRole() {
    router.replace({ pathname: "/login", params: { role: isVendeuse ? "acheteuse" : "vendeuse" } });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Back */}
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={colors.onSurface} />
        </TouchableOpacity>

        {/* Login Card */}
        <View style={styles.card}>
          <Animated.View entering={FadeInDown.duration(400)}>
            {/* Role Badge */}
            <View style={[styles.roleBadge, { backgroundColor: isVendeuse ? colors.primary : colors.roseLight }]}>
              <Ionicons name={isVendeuse ? "storefront" : "bag-handle"} size={16} color={isVendeuse ? colors.onPrimary : colors.primary} />
              <Text style={[styles.roleBadgeText, { color: isVendeuse ? colors.onPrimary : colors.primary }]}>
                {isVendeuse ? "Espace Vendeuse" : "Espace Acheteuse"}
              </Text>
            </View>

            <Text style={styles.welcome}>Connexion</Text>
            <Text style={styles.subtitle}>
              {isVendeuse
                ? "Accédez à votre tableau de bord vendeuse."
                : "Connectez-vous pour explorer nos produits beauté."}
            </Text>
          </Animated.View>

          <Animated.View style={shakeStyle}>
            {!!errors.detail && <Text style={styles.errorBanner}>{errors.detail[0]}</Text>}

            <Animated.View entering={FadeInDown.delay(100).duration(400)}>
              <Text style={styles.label}>Adresse Email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="votre@email.com"
                placeholderTextColor={colors.outline}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              {!!errors.email && <Text style={styles.fieldError}>{errors.email[0]}</Text>}
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(180).duration(400)}>
              <Text style={styles.label}>Mot de Passe</Text>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="••••••••"
                placeholderTextColor={colors.outline}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              {!!errors.password && <Text style={styles.fieldError}>{errors.password[0]}</Text>}
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(260).duration(400)}>
              <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading} activeOpacity={0.85}>
                <Text style={styles.buttonText}>{loading ? "Connexion..." : "Se Connecter"}</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(340).duration(400)} style={styles.footer}>
            <TouchableOpacity onPress={switchRole} style={styles.switchRoleBtn}>
              <Text style={styles.switchRoleText}>
                {isVendeuse ? "Vous êtes acheteuse ? " : "Vous êtes vendeuse ? "}
                <Text style={styles.switchRoleLink}>Changer</Text>
              </Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <Text style={styles.footerText}>
              Nouveau sur Lumina ?{" "}
              <Text style={styles.footerLink} onPress={() => router.push({ pathname: "/register", params: { role: params.role } })}>Créer un compte</Text>
            </Text>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, justifyContent: "center", padding: 16 },
  back: { position: "absolute", top: 50, left: 20, zIndex: 1 },
  card: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 16,
    padding: 32,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 16,
  },
  roleBadgeText: { fontSize: 12, fontWeight: "600" },
  welcome: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.secondary,
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.onSurface,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.onSurface,
    marginBottom: 4,
  },
  inputError: { backgroundColor: colors.errorContainer },
  fieldError: { color: colors.error, fontSize: 12, marginTop: 2, marginBottom: 6 },
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
    marginTop: 16,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonText: { color: colors.onPrimary, fontWeight: "700", fontSize: 14, letterSpacing: 0.5 },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  switchRoleBtn: { marginBottom: 16 },
  switchRoleText: { color: colors.secondary, fontSize: 13 },
  switchRoleLink: { color: colors.primary, fontWeight: "700" },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: colors.outlineVariant,
    marginBottom: 16,
  },
  footerText: { color: colors.secondary, fontSize: 14 },
  footerLink: { color: colors.primary, fontWeight: "700" },
});

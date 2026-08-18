import { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSequence, withTiming } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { api, ApiError } from "@/lib/api";
import { colors } from "@/lib/theme";

export default function IndexScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const shake = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));

  useEffect(() => {
    api.isLoggedIn().then((logged) => {
      if (logged) {
        api.me().then((me) => {
          router.replace(me.is_seller ? "/vendeur" : "/home");
        }).catch(() => {});
      }
    });
  }, []);

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

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <View style={{ width: 40 }} />
          <Text style={styles.logo}>LUMINA</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Ionicons name="person-outline" size={22} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/cart")}>
              <Ionicons name="bag-outline" size={22} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Card */}
        <View style={styles.card}>
          <Animated.View entering={FadeInDown.duration(500)}>
            <Text style={styles.welcome}>Bienvenue</Text>
            <Text style={styles.subtitle}>Connectez-vous à votre compte Lumina{'\n'}pour une expérience sur mesure.</Text>
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
            <Text style={styles.footerText}>
              Nouveau sur Lumina ?{" "}
              <Text style={styles.footerLink} onPress={() => router.push("/register")}>Créer un compte</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    paddingVertical: 12,
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    zIndex: 1,
  },
  logo: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 4,
  },
  headerRight: { flexDirection: "row", gap: 12, width: 40, justifyContent: "flex-end" },
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
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    alignItems: "center",
  },
  footerText: { color: colors.secondary, fontSize: 14 },
  footerLink: { color: colors.primary, fontWeight: "700" },
});

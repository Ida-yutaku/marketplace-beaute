import { useState } from "react";
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSequence, withTiming } from "react-native-reanimated";
import { api, ApiError } from "@/lib/api";
import { colors } from "@/lib/theme";
import AnimatedButton from "@/components/AnimatedButton";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const shake = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

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
      router.replace(me.is_seller ? "/vendeur" : "/catalog");
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
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 24, gap: 8, justifyContent: "center", flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text style={styles.title}>Connexion</Text>
        </Animated.View>

        <Animated.View style={shakeStyle}>
          {!!errors.detail && <Text style={styles.errorBanner}>{errors.detail[0]}</Text>}

          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Email"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </Animated.View>
          {!!errors.email && <Text style={styles.fieldError}>{errors.email[0]}</Text>}

          <Animated.View entering={FadeInDown.delay(180).duration(400)}>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Mot de passe"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </Animated.View>
          {!!errors.password && <Text style={styles.fieldError}>{errors.password[0]}</Text>}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(260).duration(400)}>
          <AnimatedButton style={styles.button} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Connexion..." : "Se connecter"}</Text>
          </AnimatedButton>
          <AnimatedButton style={{ marginTop: 16 }} onPress={() => router.push("/register")}>
            <Text style={styles.link}>Pas encore de compte ? S'inscrire</Text>
          </AnimatedButton>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: { fontSize: 24, fontWeight: "800", color: colors.text, marginBottom: 12 },
  input: { backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 8 },
  inputError: { borderColor: colors.danger },
  fieldError: { color: colors.danger, fontSize: 12, marginTop: -4, marginLeft: 4, marginBottom: 8 },
  errorBanner: { backgroundColor: colors.dangerBg, color: colors.danger, padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 8 },
  button: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 14, alignItems: "center", marginTop: 8 },
  buttonText: { color: "white", fontWeight: "700", fontSize: 16 },
  link: { color: colors.primaryDark, textAlign: "center", fontWeight: "600" },
});

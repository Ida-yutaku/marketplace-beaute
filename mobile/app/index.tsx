import { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/lib/api";
import { colors } from "@/lib/theme";
import { TextAnimate } from "@/components/TextAnimate";

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    api.isLoggedIn().then((logged) => {
      if (logged) {
        api.me().then((me) => {
          router.replace(me.is_seller ? "/vendeur" : "/home");
        }).catch(() => {});
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TextAnimate
            text="LUMINA"
            delay={300}
            stagger={80}
            duration={600}
            style={styles.logo}
          />
        </View>

        {/* Hero */}
        <View style={styles.heroSection}>
          <Animated.View entering={FadeInDown.duration(500)} style={styles.heroContent}>
            <Text style={styles.heroLabel}>ETHÉREAL GRACE</Text>
            <Text style={styles.heroTitle}>Bienvenue sur{'\n'}LUMINA</Text>
            <Text style={styles.heroSubtitle}>La marketplace beauté de référence.{'\n'}Choisissez votre espace pour commencer.</Text>
          </Animated.View>
        </View>

        {/* Role Selection */}
        <View style={styles.choices}>
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <TouchableOpacity
              style={styles.choiceCard}
              onPress={() => router.push({ pathname: "/login", params: { role: "acheteuse" } })}
              activeOpacity={0.85}
            >
              <View style={[styles.choiceIcon, { backgroundColor: colors.roseLight }]}>
                <Ionicons name="bag-handle-outline" size={28} color={colors.primary} />
              </View>
              <Text style={styles.choiceTitle}>Je suis acheteuse</Text>
              <Text style={styles.choiceDesc}>Explorez nos produits beauté et trouvez vos essentiels.</Text>
              <View style={styles.choiceArrow}>
                <Ionicons name="arrow-forward" size={18} color={colors.primary} />
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <TouchableOpacity
              style={styles.choiceCard}
              onPress={() => router.push({ pathname: "/login", params: { role: "vendeuse" } })}
              activeOpacity={0.85}
            >
              <View style={[styles.choiceIcon, { backgroundColor: colors.primaryContainer }]}>
                <Ionicons name="storefront-outline" size={28} color={colors.onPrimaryContainer} />
              </View>
              <Text style={styles.choiceTitle}>Je suis vendeuse</Text>
              <Text style={styles.choiceDesc}>Créez votre boutique et vendez vos produits beauté.</Text>
              <View style={styles.choiceArrow}>
                <Ionicons name="arrow-forward" size={18} color={colors.primary} />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Footer */}
        <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.footer}>
          <Text style={styles.footerText}>
            Nouveau sur Lumina ?{" "}
            <Text style={styles.footerLink} onPress={() => router.push("/register")}>Créer un compte</Text>
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 16 },
  header: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 8,
  },
  logo: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 6,
  },
  heroSection: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  heroContent: { alignItems: "center" },
  heroLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.outline,
    letterSpacing: 3,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.onSurface,
    textAlign: "center",
    lineHeight: 40,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.secondary,
    textAlign: "center",
    lineHeight: 22,
  },
  choices: {
    gap: 16,
  },
  choiceCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  choiceIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  choiceTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.onSurface,
    marginBottom: 4,
    width: "100%",
  },
  choiceDesc: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
    flex: 1,
  },
  choiceArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.roseLight,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    marginTop: "auto",
    alignItems: "center",
    paddingVertical: 20,
  },
  footerText: { color: colors.secondary, fontSize: 14 },
  footerLink: { color: colors.primary, fontWeight: "700" },
});

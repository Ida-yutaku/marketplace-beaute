import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { api } from "@/lib/api";
import { colors } from "@/lib/theme";
import { FadeInItem } from "@/components/FadeIn";
import AnimatedButton from "@/components/AnimatedButton";

const steps = [
  { number: "1", title: "Crée ta boutique", text: "Donne un nom à ta boutique, ajoute une description. Tu peux en créer plusieurs." },
  { number: "2", title: "Publie tes produits", text: "Titre, prix, stock, photo — ton annonce est en ligne en quelques secondes." },
  { number: "3", title: "Vends et suis tes ventes", text: "Gère tes stocks, modifie tes annonces, suis tes commandes depuis ton dashboard." },
];

export default function HomeScreen() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    api.isLoggedIn().then(setLoggedIn);
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.hero}>
        <Animated.View entering={ZoomIn.delay(100).springify().damping(12)}>
          <Text style={styles.kicker}>MARKETPLACE BEAUTÉ</Text>
        </Animated.View>
        <Animated.View entering={FadeIn.delay(250).duration(500)}>
          <Text style={styles.heroTitle}>Vends mieux,{"\n"}gagne plus !</Text>
        </Animated.View>
        <Animated.View entering={FadeIn.delay(400).duration(500)}>
          <Text style={styles.heroSubtitle}>
            Publie tes produits de beauté, gère tes boutiques et suis tes ventes — tout depuis ton téléphone.
          </Text>
        </Animated.View>

        <FadeInItem delay={550} style={{ width: "100%", marginTop: 8, gap: 10 }}>
          {loggedIn ? (
            <AnimatedButton style={styles.button} onPress={() => router.push("/vendeur")}>
              <Text style={styles.buttonText}>Voir mes annonces</Text>
            </AnimatedButton>
          ) : (
            <>
              <AnimatedButton style={styles.button} onPress={() => router.push("/register")}>
                <Text style={styles.buttonText}>Commencer à vendre</Text>
              </AnimatedButton>
              <AnimatedButton style={styles.buttonOutline} onPress={() => router.push("/login")}>
                <Text style={styles.buttonOutlineText}>J'ai déjà un compte</Text>
              </AnimatedButton>
            </>
          )}
        </FadeInItem>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comment ça marche ?</Text>
        {steps.map((step, i) => (
          <FadeInItem key={step.number} delay={700 + i * 120} style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{step.number}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepText}>{step.text}</Text>
            </View>
          </FadeInItem>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  hero: { paddingTop: 40, paddingHorizontal: 24, paddingBottom: 28, alignItems: "flex-start" },
  kicker: { color: colors.primaryDark, fontSize: 12, fontWeight: "800", letterSpacing: 1.2 },
  heroTitle: { fontSize: 34, fontWeight: "900", color: colors.text, marginTop: 8, lineHeight: 40 },
  heroSubtitle: { fontSize: 15, color: colors.textMuted, marginTop: 12, lineHeight: 21 },
  button: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 14, alignItems: "center", width: "100%" },
  buttonText: { color: "white", fontWeight: "700", fontSize: 16 },
  buttonOutline: { borderWidth: 1.5, borderColor: colors.primary, paddingVertical: 16, borderRadius: 14, alignItems: "center", width: "100%" },
  buttonOutlineText: { color: colors.primaryDark, fontWeight: "700", fontSize: 16 },
  section: { backgroundColor: colors.primaryLight, marginHorizontal: 16, borderRadius: 24, padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: colors.primaryDark, marginBottom: 16 },
  stepCard: { flexDirection: "row", gap: 14, backgroundColor: "white", borderRadius: 16, padding: 14, marginBottom: 12 },
  stepNumber: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  stepNumberText: { color: "white", fontWeight: "800" },
  stepTitle: { fontWeight: "700", fontSize: 15, color: colors.text },
  stepText: { color: colors.textMuted, fontSize: 13, marginTop: 2, lineHeight: 18 },
});

import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api } from "@/lib/api";
import { COLORS } from "@/constants/theme";

export default function CartSuccessScreen() {
  const { order_id } = useLocalSearchParams<{ order_id: string }>();
  const router = useRouter();
  const [status, setStatus] = useState<string>("pending");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!order_id) return;
    const interval = setInterval(async () => {
      try {
        const order: any = await api.verifyOrder(Number(order_id));
        setStatus(order.status);
        if (order.status !== "pending") {
          setChecking(false);
          clearInterval(interval);
        }
      } catch {
        // on continue d'essayer
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [order_id]);

  return (
    <View style={styles.container}>
      {checking && <ActivityIndicator color={COLORS.primaryDark} size="large" />}
      <Text style={styles.title}>
        {status === "paid" ? "Paiement confirmé 🎉" : status === "canceled" ? "Paiement annulé" : "En attente de confirmation..."}
      </Text>
      <Text style={styles.subtitle}>Commande #{order_id}</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.replace("/catalog")}>
        <Text style={styles.buttonText}>Retour au catalogue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  title: { fontSize: 20, fontWeight: "800", color: COLORS.primaryText, textAlign: "center" },
  subtitle: { color: COLORS.textMuted },
  button: { backgroundColor: COLORS.primaryDark, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 14, marginTop: 20 },
  buttonText: { color: "white", fontWeight: "700" },
});

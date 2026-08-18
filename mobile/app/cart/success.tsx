import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/lib/api";
import { colors } from "@/lib/theme";

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
      } catch {}
    }, 3000);
    return () => clearInterval(interval);
  }, [order_id]);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons
          name={status === "paid" ? "checkmark-circle" : status === "canceled" ? "close-circle" : "time-outline"}
          size={64}
          color={status === "paid" ? colors.success : status === "canceled" ? colors.error : colors.primary}
        />
      </View>
      <Text style={styles.title}>
        {status === "paid" ? "Paiement confirmé" : status === "canceled" ? "Paiement annulé" : "En attente..."}
      </Text>
      <Text style={styles.subtitle}>Commande #{order_id}</Text>
      {checking && <ActivityIndicator color={colors.primary} style={{ marginTop: 16 }} />}

      <TouchableOpacity style={styles.button} onPress={() => router.replace("/home")} activeOpacity={0.85}>
        <Text style={styles.buttonText}>Retour à l'accueil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", padding: 24, gap: 8 },
  iconWrap: { marginBottom: 12 },
  title: { fontSize: 22, fontWeight: "700", color: colors.onSurface, textAlign: "center" },
  subtitle: { color: colors.outline, fontSize: 14 },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 999,
    marginTop: 24,
  },
  buttonText: { color: colors.onPrimary, fontWeight: "700" },
});

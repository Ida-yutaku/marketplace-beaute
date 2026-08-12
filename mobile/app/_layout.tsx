import { Stack } from "expo-router";
import { CartProvider } from "@/contexts/CartContext";

export default function RootLayout() {
  return (
    <CartProvider>
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#fdf2f6" },
        headerTintColor: "#a3355f",
        headerTitleStyle: { fontWeight: "bold" },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Marketplace Beauté" }} />
      <Stack.Screen name="login" options={{ title: "Connexion" }} />
      <Stack.Screen name="register" options={{ title: "Créer un compte" }} />
      <Stack.Screen name="vendeur/index" options={{ title: "Mes annonces" }} />
      <Stack.Screen name="vendeur/nouveau" options={{ title: "Nouvelle annonce" }} />
      <Stack.Screen name="vendeur/boutiques/index" options={{ title: "Mes boutiques" }} />
      <Stack.Screen name="vendeur/[id]" options={{ title: "Modifier l'annonce" }} />
    </Stack>
    </CartProvider>
  );
}

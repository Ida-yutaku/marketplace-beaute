import { Stack } from "expo-router";
import { CartProvider } from "@/contexts/CartContext";

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="vendeuse-info" />
        <Stack.Screen name="acheteuse-info" />
        <Stack.Screen name="vendeur/index" />
        <Stack.Screen name="vendeur/nouveau" />
        <Stack.Screen name="vendeur/boutiques/index" />
        <Stack.Screen name="vendeur/[id]" />
      </Stack>
    </CartProvider>
  );
}

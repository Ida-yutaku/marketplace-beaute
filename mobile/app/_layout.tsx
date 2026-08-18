import { Stack } from "expo-router";
import { CartProvider } from "@/contexts/CartContext";

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="home" />
        <Stack.Screen name="catalog" />
        <Stack.Screen name="cart" />
        <Stack.Screen name="vendeur" />
      </Stack>
    </CartProvider>
  );
}

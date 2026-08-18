import { Platform } from "react-native";

const IS_WEB = Platform.OS === "web";

export const FONTS = {
  display: IS_WEB ? "Playfair Display" : undefined,
  body: IS_WEB ? "Hanken Grotesk" : undefined,
};

export const colors = {
  primary: "#8a4853",
  primaryContainer: "#c98693",
  onPrimary: "#ffffff",
  onPrimaryContainer: "#fffbff",
  inversePrimary: "#ffb2bc",

  secondary: "#675c58",
  secondaryContainer: "#ebddd7",
  onSecondary: "#ffffff",
  onSecondaryContainer: "#6b605c",

  tertiary: "#615b52",
  tertiaryContainer: "#7b736a",

  background: "#fcf9f8",
  surface: "#fcf9f8",
  surfaceDim: "#dcd9d9",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f6f3f2",
  surfaceContainer: "#f0eded",
  surfaceContainerHigh: "#eae7e7",
  surfaceContainerHighest: "#e5e2e1",
  surfaceVariant: "#e5e2e1",

  onSurface: "#1b1c1c",
  onSurfaceVariant: "#524345",
  onBackground: "#1b1c1c",

  outline: "#857374",
  outlineVariant: "#d7c1c3",

  error: "#ba1a1a",
  onError: "#ffffff",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",

  success: "#16a34a",

  rose: "#f4c2c2",
  roseLight: "#fce4e8",
  roseDark: "#d4868f",
  roseBg: "#fdf0f2",
};

export const COLORS = {
  background: "#FFF1F6",
  card: "#FFFFFF",
  primaryDark: "#BE185D",
  primaryText: "#880E4F",
  textMuted: "#9ca3af",
  interactive: "#FBCFE8",
  capsuleSoft: "#FBCFE8",
  capsuleMedium: "#F48FB1",
  capsuleStrong: "#EC4899",
  error: "#C62828",
  white: "#FFFFFF",
} as const;

export const CAPSULE_VARIANTS = [COLORS.capsuleSoft, COLORS.capsuleMedium, COLORS.capsuleStrong] as const;

export const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 } as const;
export const RADIUS = { sm: 12, md: 16, lg: 20, pill: 999 } as const;
export const FONTS = { price: undefined } as const;
export const TYPE_SCALE = { display: 22, title: 18, body: 14, caption: 12 } as const;

// Design System Tokens & Utilities
// 8px grid, consistent scales, semantic naming.
// Mirrors the CSS custom properties defined in src/index.css.
// The landing page ships dark-first with a full light theme (`html.light`).

export const tokens = {
  colors: {
    bg: "#09090b",
    bgElevated: "#0e0e10",
    bgPanel: "#141416",
    bgPanelHover: "#1b1b1e",

    border: "rgba(255, 255, 255, 0.07)",
    borderStrong: "rgba(255, 255, 255, 0.12)",
    borderFocus: "rgba(217, 119, 6, 0.7)",

    text: "#fafafa",
    textMuted: "#a1a1aa",
    textFaint: "#82828b",
    textInverse: "#09090b",

    accent: "#d97706",
    accentHover: "#b45309",
    accentSoft: "rgba(217, 119, 6, 0.1)",
    accentGlow: "rgba(217, 119, 6, 0.22)",

    success: "#22c55e",
    successSoft: "rgba(34, 197, 94, 0.12)",
    warning: "#d97706",
    warningSoft: "rgba(217, 119, 6, 0.12)",
    error: "#ef4444",
    errorSoft: "rgba(239, 68, 68, 0.12)",

    overlay: "rgba(0, 0, 0, 0.6)",
    overlayStrong: "rgba(0, 0, 0, 0.8)",
  },

  colorsLight: {
    bg: "#fafafa",
    bgElevated: "#f4f4f5",
    bgPanel: "#ffffff",
    bgPanelHover: "#f4f4f5",
    border: "rgba(9, 9, 11, 0.07)",
    borderStrong: "rgba(9, 9, 11, 0.12)",
    borderFocus: "rgba(180, 83, 9, 0.7)",

    text: "#0a0a0a",
    textMuted: "#52525b",
    textFaint: "#71717a",
    textInverse: "#fafafa",

    accent: "#b45309",
    accentHover: "#92400e",
    accentSoft: "rgba(180, 83, 9, 0.08)",
    accentGlow: "rgba(180, 83, 9, 0.18)",

    success: "#16a34a",
    successSoft: "rgba(22, 163, 74, 0.1)",
    warning: "#b45309",
    warningSoft: "rgba(180, 83, 9, 0.1)",
    error: "#dc2626",
    errorSoft: "rgba(220, 38, 38, 0.08)",

    overlay: "rgba(9, 9, 11, 0.5)",
    overlayStrong: "rgba(9, 9, 11, 0.72)",
  },

  space: {
    0: "0",
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    7: "28px",
    8: "32px",
    10: "40px",
    12: "48px",
    16: "64px",
    20: "80px",
    24: "96px",
    32: "128px",
  },

  typography: {
    fontFamily: {
      sans: '"Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      display: '"Space Grotesk", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: '"JetBrains Mono", ui-monospace, Menlo, monospace',
    },
    fontSize: {
      xs: ["12px", { lineHeight: "16px", letterSpacing: "0" }],
      sm: ["14px", { lineHeight: "20px", letterSpacing: "0" }],
      base: ["16px", { lineHeight: "24px", letterSpacing: "0" }],
      lg: ["18px", { lineHeight: "28px", letterSpacing: "0" }],
      xl: ["20px", { lineHeight: "28px", letterSpacing: "0" }],
      "2xl": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em" }],
      "3xl": ["30px", { lineHeight: "36px", letterSpacing: "-0.02em" }],
      "4xl": ["36px", { lineHeight: "40px", letterSpacing: "-0.02em" }],
      "5xl": ["48px", { lineHeight: "52px", letterSpacing: "-0.03em" }],
      "6xl": ["60px", { lineHeight: "64px", letterSpacing: "-0.04em" }],
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      black: "900",
    },
  },

  radius: {
    none: "0",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "32px",
    full: "9999px",
  },

  shadows: {
    xs: "0 1px 2px rgba(0, 0, 0, 0.3)",
    sm: "0 1px 3px rgba(0, 0, 0, 0.32)",
    md: "0 4px 12px rgba(0, 0, 0, 0.34)",
    lg: "0 8px 24px rgba(0, 0, 0, 0.36)",
    xl: "0 16px 48px rgba(0, 0, 0, 0.38)",
    "2xl": "0 24px 80px rgba(0, 0, 0, 0.42)",
    inner: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
    accent: "0 8px 24px rgba(0, 0, 0, 0.3)",
    focus: "0 0 0 3px rgba(217, 119, 6, 0.3)",
  },

  transitions: {
    fast: "160ms cubic-bezier(0.16, 1, 0.3, 1)",
    normal: "240ms cubic-bezier(0.16, 1, 0.3, 1)",
    slow: "400ms cubic-bezier(0.16, 1, 0.3, 1)",
    slower: "640ms cubic-bezier(0.16, 1, 0.3, 1)",
  },

  zIndex: {
    base: "0",
    floating: "10",
    dropdown: "30",
    sticky: "50",
    modal: "80",
    overlay: "90",
    toast: "100",
  },

  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1400px",
  },

  container: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1200px",
    "2xl": "1360px",
    full: "100%",
  },
};

export const cssVar = (path) => {
  const keys = path.split(".");
  let value = tokens;
  for (const key of keys) {
    value = value[key];
    if (value === undefined) return undefined;
  }
  return value;
};

export const generateCSSVars = (theme = "dark") => {
  const colors = theme === "light" ? tokens.colorsLight : tokens.colors;
  const vars = {};
  Object.entries(colors).forEach(([key, value]) => {
    vars[`--color-${key}`] = value;
  });
  return vars;
};

export const mq = {
  sm: `@media (min-width: ${tokens.breakpoints.sm})`,
  md: `@media (min-width: ${tokens.breakpoints.md})`,
  lg: `@media (min-width: ${tokens.breakpoints.lg})`,
  xl: `@media (min-width: ${tokens.breakpoints.xl})`,
  "2xl": `@media (min-width: ${tokens.breakpoints["2xl"]})`,
  reducedMotion: "@media (prefers-reduced-motion: reduce)",
};

export const gsapPresets = {
  ease: "expo.out",
  easeInOut: "expo.inOut",
  easeOut: "expo.out",
  duration: { fast: 0.3, normal: 0.55, slow: 0.85, slower: 1.2 },
  stagger: { fast: 0.05, normal: 0.09, slow: 0.14 },
};

export const getColor = (colorPath, theme = "dark") => {
  const colors = theme === "light" ? tokens.colorsLight : tokens.colors;
  const keys = colorPath.split(".");
  let value = colors;
  for (const key of keys) {
    value = value[key];
    if (value === undefined) return tokens.colors[colorPath] || colorPath;
  }
  return value;
};

export default tokens;
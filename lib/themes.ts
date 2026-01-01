export const themes = {
  light: {
    name: 'Light',
    background: 255,
    mold: { r: 0, g: 0, b: 0, a: 180 },
    food: { r: 0, g: 0, b: 0, a: 150 },
    isDarkMode: false,
  },
  dark: {
    name: 'Dark',
    background: 0,
    mold: { r: 255, g: 255, b: 255, a: 180 },
    food: { r: 255, g: 255, b: 255, a: 150 },
    isDarkMode: true,
  },
};

export type ThemeName = keyof typeof themes;
export type Theme = typeof themes.light;
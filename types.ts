export interface ThemeConfig {
  id: string;
  name: string;
  background: string;
  textColor: string;
  accentColor: string;
  cardBg: string;
  cardBorder: string;
  quoteBg: string;
  shadowColor?: string;
}

export interface TypographyConfig {
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  lineHeight: 'tight' | 'normal' | 'relaxed' | 'loose';
}

export interface EditorState {
  content: string;
  theme: ThemeConfig;
  typography: TypographyConfig;
}

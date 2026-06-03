// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  mode: ThemeMode;
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  textLight: string;
  textWhite: string;
  border: string;
  borderLight: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  accent: string;
  accentLight: string;
  warning: string;
  danger: string;
  dangerLight: string;
  success: string;

  // Semantic
  headerBg: string;
  tabBg: string;
  inputBg: string;
  chipBg: string;
  chipActiveBg: string;
  cardShadow: string;
}

const lightTheme: ThemeColors = {
  mode: 'light',
  background: '#f8f9fa',
  surface: '#ffffff',
  card: '#ffffff',
  text: '#1a1a2e',
  textSecondary: '#666666',
  textLight: '#999999',
  textWhite: '#ffffff',
  border: '#e8e8e8',
  borderLight: '#f0f0f0',
  primary: '#FF6B35',
  primaryLight: '#FFF3EE',
  primaryDark: '#E55A2B',
  secondary: '#4CAF50',
  secondaryLight: '#E8F5E9',
  accent: '#2196F3',
  accentLight: '#E3F2FD',
  warning: '#FFC107',
  danger: '#e74c3c',
  dangerLight: '#fff0f0',
  success: '#4CAF50',

  headerBg: '#FF6B35',
  tabBg: '#ffffff',
  inputBg: '#ffffff',
  chipBg: '#f0f0f0',
  chipActiveBg: '#FF6B35',
  cardShadow: 'rgba(0,0,0,0.06)',
};

const darkTheme: ThemeColors = {
  mode: 'dark',
  background: '#121212',
  surface: '#1e1e1e',
  card: '#1e1e1e',
  text: '#e8e8e8',
  textSecondary: '#a0a0a0',
  textLight: '#666666',
  textWhite: '#e8e8e8',
  border: '#333333',
  borderLight: '#2a2a2a',
  primary: '#FF8A5C',
  primaryLight: '#2a1f1a',
  primaryDark: '#FF6B35',
  secondary: '#66BB6A',
  secondaryLight: '#1a2e1c',
  accent: '#42A5F5',
  accentLight: '#1a2a3a',
  warning: '#FFD54F',
  danger: '#EF5350',
  dangerLight: '#2a1a1a',
  success: '#66BB6A',

  headerBg: '#1e1e1e',
  tabBg: '#1e1e1e',
  inputBg: '#2a2a2a',
  chipBg: '#333333',
  chipActiveBg: '#FF6B35',
  cardShadow: 'rgba(0,0,0,0.3)',
};

interface ThemeContextType {
  theme: ThemeColors;
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  mode: 'light',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');

  const toggleTheme = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

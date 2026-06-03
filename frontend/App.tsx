import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { I18nContext, getTranslation, Lang } from './src/i18n';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [lang, setLang] = useState<Lang>('es');

  useEffect(() => {
    cargarIdioma();
  }, []);

  async function cargarIdioma() {
    const stored = await AsyncStorage.getItem('idioma');
    if (stored === 'en' || stored === 'es') {
      setLang(stored);
    }
  }

  async function cambiarIdioma(nuevo: Lang) {
    setLang(nuevo);
    await AsyncStorage.setItem('idioma', nuevo);
  }

  return (
    <I18nContext.Provider value={{ lang, t: getTranslation(lang), setLang: cambiarIdioma }}>
      <ThemeProvider>
        <AuthProvider>
          <StatusBar style="light" backgroundColor="#FF6B35" />
          <AppNavigator />
          <Toast />
        </AuthProvider>
      </ThemeProvider>
    </I18nContext.Provider>
  );
}

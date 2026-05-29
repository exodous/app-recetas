// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n';

export default function LoginScreen() {
  const { t } = useI18n();
  const { login, registrar } = useAuth();
  const [esRegistro, setEsRegistro] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [idioma, setIdioma] = useState<'es' | 'en'>('es');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    setError('');
    setCargando(true);
    try {
      if (esRegistro) {
        await registrar(email, password, nombre, idioma);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error de conexión');
    } finally {
      setCargando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.card}>
        <Text style={styles.emoji}>🍳</Text>
        <Text style={styles.titulo}>{esRegistro ? t.auth.registro : t.auth.inicio_sesion}</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {esRegistro && (
          <>
            <TextInput
              style={styles.input}
              placeholder={t.auth.nombre}
              value={nombre}
              onChangeText={setNombre}
              autoCapitalize="words"
            />
            <View style={styles.idiomaRow}>
              <TouchableOpacity
                style={[styles.idiomaBtn, idioma === 'es' && styles.idiomaActivo]}
                onPress={() => setIdioma('es')}
              >
                <Text>🇪🇸 ES</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.idiomaBtn, idioma === 'en' && styles.idiomaActivo]}
                onPress={() => setIdioma('en')}
              >
                <Text>🇬🇧 EN</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder={t.auth.email}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder={t.auth.contrasena}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.boton} onPress={handleSubmit} disabled={cargando}>
          {cargando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botonTexto}>{esRegistro ? t.auth.registro : t.auth.inicio_sesion}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { setEsRegistro(!esRegistro); setError(''); }}>
          <Text style={styles.link}>
            {esRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  emoji: { fontSize: 48, textAlign: 'center', marginBottom: 8 },
  titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 24, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, marginBottom: 12, fontSize: 16, backgroundColor: '#fafafa' },
  idiomaRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  idiomaBtn: { flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  idiomaActivo: { borderColor: '#FF6B35', backgroundColor: '#FFF3EE' },
  boton: { backgroundColor: '#FF6B35', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 8 },
  botonTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { textAlign: 'center', color: '#FF6B35', marginTop: 16, fontSize: 14 },
  error: { color: '#e74c3c', textAlign: 'center', marginBottom: 12, fontSize: 14 },
});

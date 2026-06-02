// src/screens/HomeScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useI18n } from '../i18n';
import * as api from '../services/api';
import { Receta, Categoria } from '../types';
import { useFocusEffect } from '@react-navigation/native';

import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }: any) {
  const { t, lang } = useI18n();
  const { logout } = useAuth();
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSel, setCategoriaSel] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);

  const getNombre = (obj: { es: string; en: string }) => obj[lang] || obj.es;

  const cargarDatos = async () => {
    try {
      const params: any = {};
      if (categoriaSel) params.categoria = categoriaSel;
      const [recetasRes, categoriasRes] = await Promise.all([
        api.getRecetas(params),
        api.getCategorias(),
      ]);
      setRecetas(recetasRes.recetas);
      setCategorias(categoriasRes);
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      setCargando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [categoriaSel])
  );

  const onRefresh = async () => {
    setRefrescando(true);
    await cargarDatos();
    setRefrescando(false);
  };

  const recetasFiltradas = recetas.filter((r) =>
    !busqueda || getNombre(r.nombre).toLowerCase().includes(busqueda.toLowerCase())
  );

  const todasCategoria = { id: 'todas', nombre: { es: t.home.todas_categorias, en: t.home.todas_categorias }, icono: '🍽️', slug: '', orden: 0 };
  const listaCategorias = [todasCategoria, ...categorias];

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.btnLogout} onPress={logout}>
          <Text style={styles.btnLogoutText}>⟳</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.buscador}
        placeholder={t.common.buscar}
        value={busqueda}
        onChangeText={setBusqueda}
      />

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={listaCategorias}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.categoriasContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoriaChip, categoriaSel === (item.id === 'todas' ? null : item.slug) && styles.categoriaActiva]}
            onPress={() => setCategoriaSel(item.id === 'todas' ? null : item.slug)}
          >
            <Text style={styles.categoriaTexto}>{item.icono} {getNombre(item.nombre)}</Text>
          </TouchableOpacity>
        )}
      />

      {cargando ? (
        <ActivityIndicator size="large" color="#FF6B35" style={styles.loader} />
      ) : recetasFiltradas.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🍳</Text>
          <Text style={styles.emptyTexto}>{t.home.sin_recetas}</Text>
          <TouchableOpacity style={styles.botonNueva} onPress={() => navigation.navigate('NuevaReceta')}>
            <Text style={styles.botonNuevaTexto}>+ {t.home.tu_primera_receta}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={recetasFiltradas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.recetaCard}
              onPress={() => navigation.navigate('DetalleReceta', { id: item.id })}
            >
              <View style={styles.recetaHeader}>
                <Text style={styles.recetaNombre}>{getNombre(item.nombre)}</Text>
                {item.publica && <Text style={styles.badge}>🌐</Text>}
              </View>
              <View style={styles.recetaInfo}>
                <Text style={styles.recetaCategoria}>
                  {item.categoria?.icono} {item.categoria ? getNombre(item.categoria.nombre) : ''}
                </Text>
                {item.tiempoMin && <Text style={styles.recetaTiempo}>⏱ {item.tiempoMin} min</Text>}
              </View>
              {item.porciones && <Text style={styles.recetaPorciones}>🍽 {item.porciones} porciones</Text>}
            </TouchableOpacity>
          )}
          refreshControl={<RefreshControl refreshing={refrescando} onRefresh={onRefresh} colors={['#FF6B35']} />}
          contentContainerStyle={styles.lista}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  topBar: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 12, paddingTop: 4 },
  btnLogout: { padding: 8 },
  btnLogoutText: { fontSize: 22, color: '#999' },
  buscador: { backgroundColor: '#fff', margin: 12, padding: 12, borderRadius: 10, fontSize: 16, borderWidth: 1, borderColor: '#eee' },
  categoriasContainer: { paddingHorizontal: 12, paddingBottom: 8 },
  categoriaChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', marginRight: 8, borderWidth: 1, borderColor: '#eee' },
  categoriaActiva: { backgroundColor: '#FF6B35', borderColor: '#FF6B35' },
  categoriaTexto: { fontSize: 14, color: '#333' },
  loader: { flex: 1 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTexto: { fontSize: 16, color: '#999', marginBottom: 24 },
  botonNueva: { backgroundColor: '#FF6B35', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  botonNuevaTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  lista: { paddingHorizontal: 12 },
  recetaCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  recetaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recetaNombre: { fontSize: 18, fontWeight: 'bold', color: '#333', flex: 1 },
  badge: { fontSize: 14, marginLeft: 4 },
  recetaInfo: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  recetaCategoria: { fontSize: 14, color: '#666' },
  recetaTiempo: { fontSize: 14, color: '#666' },
  recetaPorciones: { fontSize: 13, color: '#999', marginTop: 4 },
});

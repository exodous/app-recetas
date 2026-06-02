// src/screens/HomeScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useI18n } from '../i18n';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import { Receta, Categoria } from '../types';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';

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

  const todasCategoria = {
    id: 'todas',
    nombre: { es: 'Todas', en: 'All' },
    icono: '🍽️',
    slug: '',
    orden: 0,
  };
  const listaCategorias = [todasCategoria, ...categorias];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🍳 Mis Recetas</Text>
          <Text style={styles.headerSubtitle}>{recetas.length} recetas disponibles</Text>
        </View>
        <TouchableOpacity style={styles.btnLogout} onPress={logout}>
          <Text style={styles.btnLogoutIcon}>⟳</Text>
        </TouchableOpacity>
      </View>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar receta..."
          placeholderTextColor={colors.textLight}
          value={busqueda}
          onChangeText={setBusqueda}
        />
        {busqueda.length > 0 && (
          <TouchableOpacity onPress={() => setBusqueda('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Categorías */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={listaCategorias}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.categoriasContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoriaChip,
              categoriaSel === (item.id === 'todas' ? null : item.slug) && styles.categoriaActiva,
            ]}
            onPress={() => setCategoriaSel(item.id === 'todas' ? null : item.slug)}
          >
            <Text style={styles.catIcon}>{item.icono}</Text>
            <Text
              style={[
                styles.categoriaTexto,
                categoriaSel === (item.id === 'todas' ? null : item.slug) && styles.categoriaTextoActivo,
              ]}
            >
              {getNombre(item.nombre)}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Contenido */}
      {cargando ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : recetasFiltradas.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🍳</Text>
          <Text style={styles.emptyTitle}>No hay recetas</Text>
          <Text style={styles.emptyTexto}>
            {busqueda ? 'No se encontraron resultados' : 'Crea tu primera receta para empezar'}
          </Text>
          <TouchableOpacity
            style={styles.botonNueva}
            onPress={() => navigation.navigate('NuevaReceta')}
          >
            <Text style={styles.botonNuevaTexto}>+ Nueva Receta</Text>
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
              activeOpacity={0.7}
            >
              <View style={styles.recetaHeader}>
                <View style={styles.recetaHeaderLeft}>
                  <Text style={styles.recetaNombre}>{getNombre(item.nombre)}</Text>
                  {item.categoria && (
                    <View style={styles.categoriaBadge}>
                      <Text style={styles.categoriaBadgeText}>
                        {item.categoria.icono} {getNombre(item.categoria.nombre)}
                      </Text>
                    </View>
                  )}
                </View>
                {item.publica && (
                  <View style={styles.publicaBadge}>
                    <Text style={styles.publicaBadgeText}>🌐</Text>
                  </View>
                )}
              </View>

              <View style={styles.recetaInfo}>
                {item.tiempoMin && (
                  <View style={styles.infoChip}>
                    <Text style={styles.infoChipText}>⏱ {item.tiempoMin} min</Text>
                  </View>
                )}
                {item.porciones && (
                  <View style={styles.infoChip}>
                    <Text style={styles.infoChipText}>🍽 {item.porciones} pax</Text>
                  </View>
                )}
                {item.ingredientes && (
                  <View style={styles.infoChip}>
                    <Text style={styles.infoChipText}>🧂 {item.ingredientes.length} ings</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl refreshing={refrescando} onRefresh={onRefresh} colors={[colors.primary]} />
          }
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      {!cargando && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('NuevaReceta')}
          activeOpacity={0.8}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  headerSubtitle: { fontSize: 13, color: colors.textLight, marginTop: 2 },
  btnLogout: { padding: 8 },
  btnLogoutIcon: { fontSize: 22, color: colors.textLight },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: colors.text },
  clearIcon: { fontSize: 16, color: colors.textLight, padding: 4 },

  categoriasContainer: { paddingHorizontal: 16, paddingBottom: 12 },
  categoriaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoriaActiva: { backgroundColor: colors.primary, borderColor: colors.primary },
  catIcon: { fontSize: 16, marginRight: 4 },
  categoriaTexto: { fontSize: 13, color: colors.text, fontWeight: '500' },
  categoriaTextoActivo: { color: colors.textWhite },

  loader: { flex: 1 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  emptyTexto: { fontSize: 14, color: colors.textLight, marginBottom: 24, textAlign: 'center' },
  botonNueva: { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  botonNuevaTexto: { color: colors.textWhite, fontSize: 16, fontWeight: 'bold' },

  lista: { paddingHorizontal: 16, paddingBottom: 80 },

  recetaCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  recetaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  recetaHeaderLeft: { flex: 1 },
  recetaNombre: { fontSize: 17, fontWeight: 'bold', color: colors.text, marginBottom: 6 },
  categoriaBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  categoriaBadgeText: { fontSize: 12, color: colors.primary, fontWeight: '600' },
  publicaBadge: { marginLeft: 8 },

  recetaInfo: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  infoChip: {
    backgroundColor: colors.borderLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  infoChipText: { fontSize: 12, color: colors.textSecondary },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: { color: colors.textWhite, fontSize: 28, lineHeight: 30 },
});

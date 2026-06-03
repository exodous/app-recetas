// src/screens/HomeScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useI18n } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import * as api from '../services/api';
import { Receta, Categoria } from '../types';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeColors } from '../context/ThemeContext';

export default function HomeScreen({ navigation }: any) {
  const { t, lang } = useI18n();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSel, setCategoriaSel] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const s = styles(theme);

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

  useFocusEffect(useCallback(() => { cargarDatos(); }, [categoriaSel]));

  const onRefresh = async () => {
    setRefrescando(true);
    await cargarDatos();
    setRefrescando(false);
  };

  const recetasFiltradas = recetas.filter((r) =>
    !busqueda || getNombre(r.nombre).toLowerCase().includes(busqueda.toLowerCase())
  );

  const todasCategoria = { id: 'todas', nombre: { es: 'Todas', en: 'All' }, icono: '🍽️', slug: '', orden: 0 };
  const listaCategorias = [todasCategoria, ...categorias];

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>🍳 Mis Recetas</Text>
          <Text style={s.headerSubtitle}>{recetas.length} recetas disponibles</Text>
        </View>
        <View style={s.headerButtons}>
          <TouchableOpacity style={s.btnTheme} onPress={toggleTheme}>
            <Text style={s.btnThemeIcon}>{theme.mode === 'light' ? '🌙' : '☀️'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.btnLogout} onPress={logout}>
            <Text style={s.btnLogoutIcon}>⟳</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={s.searchContainer}>
        <Text style={s.searchIcon}>🔍</Text>
        <TextInput
          style={s.searchInput}
          placeholder="Buscar receta..."
          placeholderTextColor={theme.textLight}
          value={busqueda}
          onChangeText={setBusqueda}
        />
        {busqueda.length > 0 && (
          <TouchableOpacity onPress={() => setBusqueda('')}>
            <Text style={s.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={s.categoriasWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={listaCategorias}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.categoriasContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[s.categoriaChip, categoriaSel === (item.id === 'todas' ? null : item.slug) && s.categoriaActiva]}
              onPress={() => setCategoriaSel(item.id === 'todas' ? null : item.slug)}
            >
              <Text style={s.catIcon}>{item.icono}</Text>
              <Text style={[s.categoriaTexto, categoriaSel === (item.id === 'todas' ? null : item.slug) && s.categoriaTextoActivo]}>
                {getNombre(item.nombre)}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {cargando ? (
        <ActivityIndicator size="large" color={theme.primary} style={s.loader} />
      ) : recetasFiltradas.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyEmoji}>🍳</Text>
          <Text style={s.emptyTitle}>No hay recetas</Text>
          <Text style={s.emptyTexto}>
            {busqueda ? 'No se encontraron resultados' : 'Crea tu primera receta para empezar'}
          </Text>
          <TouchableOpacity style={s.botonNueva} onPress={() => navigation.navigate('NuevaReceta')}>
            <Text style={s.botonNuevaTexto}>+ Nueva Receta</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={recetasFiltradas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={s.recetaCard} onPress={() => navigation.navigate('DetalleReceta', { id: item.id })} activeOpacity={0.7}>
              <View style={s.recetaHeader}>
                <View style={s.recetaHeaderLeft}>
                  <Text style={s.recetaNombre}>{getNombre(item.nombre)}</Text>
                  {item.categoria && (
                    <View style={s.categoriaBadge}>
                      <Text style={s.categoriaBadgeText}>{item.categoria.icono} {getNombre(item.categoria.nombre)}</Text>
                    </View>
                  )}
                </View>
                {item.publica && <Text style={s.publicaBadge}>🌐</Text>}
              </View>
              <View style={s.recetaInfo}>
                {item.tiempoMin && <View style={s.infoChip}><Text style={s.infoChipText}>⏱ {item.tiempoMin} min</Text></View>}
                {item.porciones && <View style={s.infoChip}><Text style={s.infoChipText}>🍽 {item.porciones} pax</Text></View>}
                {item.ingredientes && <View style={s.infoChip}><Text style={s.infoChipText}>🧂 {item.ingredientes.length} ings</Text></View>}
              </View>
            </TouchableOpacity>
          )}
          refreshControl={<RefreshControl refreshing={refrescando} onRefresh={onRefresh} colors={[theme.primary]} />}
          contentContainerStyle={s.lista}
          showsVerticalScrollIndicator={false}
        />
      )}

      {!cargando && (
        <TouchableOpacity style={s.fab} onPress={() => navigation.navigate('NuevaReceta')} activeOpacity={0.8}>
          <Text style={s.fabIcon}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function styles(theme: ThemeColors) {
  const c = theme;
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: c.text },
    headerSubtitle: { fontSize: 13, color: c.textLight, marginTop: 2 },
    headerButtons: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    btnTheme: { padding: 8 },
    btnThemeIcon: { fontSize: 22 },
    btnLogout: { padding: 8 },
    btnLogoutIcon: { fontSize: 22, color: c.textLight },

    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: c.card, marginHorizontal: 16, marginBottom: 12, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: c.border },
    searchIcon: { fontSize: 16, marginRight: 8 },
    searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: c.text },
    clearIcon: { fontSize: 16, color: c.textLight, padding: 4 },

    categoriasWrapper: { minHeight: 44, marginBottom: 4 },
    categoriasContainer: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 4 },
    categoriaChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: c.card, marginRight: 8, marginBottom: 4, borderWidth: 1, borderColor: c.border },
    categoriaActiva: { backgroundColor: c.primary, borderColor: c.primary },
    catIcon: { fontSize: 16, marginRight: 4 },
    categoriaTexto: { fontSize: 13, color: c.text, fontWeight: '500' },
    categoriaTextoActivo: { color: c.mode === 'dark' ? c.textWhite : '#fff' },

    loader: { flex: 1 },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    emptyEmoji: { fontSize: 64, marginBottom: 16 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: c.text, marginBottom: 8 },
    emptyTexto: { fontSize: 14, color: c.textLight, marginBottom: 24, textAlign: 'center' },
    botonNueva: { backgroundColor: c.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
    botonNuevaTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    lista: { paddingHorizontal: 16, paddingBottom: 80 },

    recetaCard: { backgroundColor: c.card, borderRadius: 16, padding: 16, marginBottom: 10, shadowColor: c.cardShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 8, elevation: 3, borderLeftWidth: 4, borderLeftColor: c.primary },
    recetaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    recetaHeaderLeft: { flex: 1 },
    recetaNombre: { fontSize: 17, fontWeight: 'bold', color: c.text, marginBottom: 6 },
    categoriaBadge: { backgroundColor: c.primaryLight, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
    categoriaBadgeText: { fontSize: 12, color: c.primary, fontWeight: '600' },
    publicaBadge: { fontSize: 16, marginLeft: 8 },

    recetaInfo: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
    infoChip: { backgroundColor: c.borderLight, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
    infoChipText: { fontSize: 12, color: c.textSecondary },

    fab: { position: 'absolute', right: 20, bottom: 80, width: 56, height: 56, borderRadius: 28, backgroundColor: c.primary, justifyContent: 'center', alignItems: 'center', shadowColor: c.cardShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 8, elevation: 8 },
    fabIcon: { color: '#fff', fontSize: 28, lineHeight: 30 },
  });
}

// src/screens/DescargasScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { useI18n } from '../i18n';
import * as api from '../services/api';
import { Receta } from '../types';
import { useFocusEffect } from '@react-navigation/native';

interface DescargaItem {
  id: string;
  receta: Receta;
  descargadaEn: string;
}

export default function DescargasScreen({ navigation }: any) {
  const { t, lang } = useI18n();
  const [descargas, setDescargas] = useState<DescargaItem[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);

  const getNombre = (obj: { es: string; en: string }) => obj[lang] || obj.es;

  const cargar = async () => {
    try {
      const data = await api.getDescargas();
      setDescargas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [])
  );

  const onRefresh = async () => {
    setRefrescando(true);
    await cargar();
    setRefrescando(false);
  };

  async function eliminarDescarga(recetaId: string) {
    Alert.confirm ? null : null;
    try {
      await api.eliminarDescarga(recetaId);
      cargar();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <View style={styles.container}>
      {cargando ? (
        <ActivityIndicator size="large" color="#FF6B35" style={styles.loader} />
      ) : descargas.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📥</Text>
          <Text style={styles.emptyTexto}>{t.descargas.sin_descargas}</Text>
        </View>
      ) : (
        <FlatList
          data={descargas}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refrescando} onRefresh={onRefresh} colors={['#FF6B35']} />}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('DetalleReceta', { id: item.receta.id })}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.nombre}>{getNombre(item.receta.nombre)}</Text>
              </View>
              <Text style={styles.categoria}>
                {item.receta.categoria?.icono} {item.receta.categoria ? getNombre(item.receta.categoria.nombre) : ''}
              </Text>
              <Text style={styles.fecha}>
                📥 {t.descargas.descargada_el} {new Date(item.descargadaEn).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US')}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  loader: { flex: 1 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTexto: { fontSize: 16, color: '#999' },
  lista: { padding: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nombre: { fontSize: 18, fontWeight: 'bold', color: '#333', flex: 1 },
  categoria: { fontSize: 14, color: '#666', marginTop: 4 },
  fecha: { fontSize: 12, color: '#999', marginTop: 6 },
});

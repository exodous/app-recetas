// src/screens/IngredientesScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Modal, Alert, ActivityIndicator,
} from 'react-native';
import { useI18n } from '../i18n';
import * as api from '../services/api';
import { Ingrediente } from '../types';
import { useFocusEffect } from '@react-navigation/native';

export default function IngredientesScreen() {
  const { t, lang } = useI18n();
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [buscar, setBuscar] = useState('');
  const [cargando, setCargando] = useState(true);
  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoNombreEn, setNuevoNombreEn] = useState('');
  const [nuevaUnidad, setNuevaUnidad] = useState('g');
  const [guardando, setGuardando] = useState(false);

  const getNombre = (obj: { es: string; en: string }) => obj[lang] || obj.es;

  const cargar = async () => {
    try {
      setCargando(true);
      const data = await api.getIngredientes(buscar || undefined);
      setIngredientes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [buscar])
  );

  async function crearIngrediente() {
    if (!nuevoNombre.trim()) return;
    setGuardando(true);
    try {
      await api.crearIngrediente({
        nombre: { es: nuevoNombre, en: nuevoNombreEn || nuevoNombre },
        unidadBase: nuevaUnidad,
      });
      setMostrarNuevo(false);
      setNuevoNombre('');
      setNuevoNombreEn('');
      setNuevaUnidad('g');
      cargar();
    } catch (err: any) {
      Alert.alert(t.common.error, err.response?.data?.error || 'Error');
    } finally {
      setGuardando(false);
    }
  }

  const unidades = [
    { value: 'g', label: 'g' },
    { value: 'kg', label: 'kg' },
    { value: 'ml', label: 'ml' },
    { value: 'l', label: 'l' },
    { value: 'ud', label: 'ud' },
    { value: 'taza', label: t.ingredientes.taza },
    { value: 'cucharada', label: t.ingredientes.cucharada },
    { value: 'cucharadita', label: t.ingredientes.cucharadita },
    { value: 'pizca', label: t.ingredientes.pizca },
  ];

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.buscador}
        placeholder={t.ingredientes.buscar_ingrediente}
        value={buscar}
        onChangeText={setBuscar}
      />

      {cargando ? (
        <ActivityIndicator size="large" color="#FF6B35" style={styles.loader} />
      ) : (
        <FlatList
          data={ingredientes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.nombre}>{getNombre(item.nombre)}</Text>
              <Text style={styles.unidad}>{item.unidadBase}</Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTexto}>🧂 {t.ingredientes.sin_ingredientes}</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => setMostrarNuevo(true)}>
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>

      <Modal visible={mostrarNuevo} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>+ {t.ingredientes.nuevo}</Text>

            <Text style={styles.label}>🇪🇸 {t.ingredientes.nombre}</Text>
            <TextInput style={styles.input} value={nuevoNombre} onChangeText={setNuevoNombre} placeholder="Tomate" />

            <Text style={styles.label}>🇬🇧 {t.ingredientes.nombre}</Text>
            <TextInput style={styles.input} value={nuevoNombreEn} onChangeText={setNuevoNombreEn} placeholder="Tomato" />

            <Text style={styles.label}>{t.ingredientes.unidad_base}</Text>
            <View style={styles.unidadesRow}>
              {unidades.map((u) => (
                <TouchableOpacity
                  key={u.value}
                  style={[styles.unidadChip, nuevaUnidad === u.value && styles.unidadActiva]}
                  onPress={() => setNuevaUnidad(u.value)}
                >
                  <Text style={styles.unidadTexto}>{u.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalBotones}>
              <TouchableOpacity style={styles.btnCancelar} onPress={() => setMostrarNuevo(false)}>
                <Text>{t.common.cancelar}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnGuardar} onPress={crearIngrediente} disabled={guardando}>
                {guardando ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.btnGuardarTexto}>{t.common.guardar}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  buscador: { backgroundColor: '#fff', margin: 12, padding: 12, borderRadius: 10, fontSize: 16, borderWidth: 1, borderColor: '#eee' },
  loader: { flex: 1 },
  lista: { paddingHorizontal: 12 },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 6 },
  nombre: { fontSize: 16, color: '#333' },
  unidad: { fontSize: 14, color: '#999', backgroundColor: '#f0f0f0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  emptyTexto: { fontSize: 16, color: '#999' },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#FF6B35', justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 4 },
  fabTexto: { color: '#fff', fontSize: 28, lineHeight: 30 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 4, marginTop: 8 },
  input: { backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 8 },
  unidadesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  unidadChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#f0f0f0' },
  unidadActiva: { backgroundColor: '#FF6B35' },
  unidadTexto: { fontSize: 13, color: '#333' },
  modalBotones: { flexDirection: 'row', gap: 10 },
  btnCancelar: { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  btnGuardar: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: '#FF6B35', alignItems: 'center' },
  btnGuardarTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

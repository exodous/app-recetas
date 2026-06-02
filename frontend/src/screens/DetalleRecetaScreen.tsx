// src/screens/DetalleRecetaScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Share, Modal, TextInput,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { getReceta, descargarReceta, actualizarReceta, eliminarReceta } from '../services/api';
import { useI18n } from '../i18n';
import { useAuth } from '../context/AuthContext';
import type { Receta } from '../types';
import { colors } from '../theme/colors';

export default function DetalleRecetaScreen({ route, navigation }: any) {
  const { id } = route.params as { id: string };
  const { t, lang } = useI18n();
  const { usuario } = useAuth();
  const nav = useNavigation<any>();

  const [receta, setReceta] = useState<Receta | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [eliConfirm, setEliConfirm] = useState(false);

  // Form de edición
  const [editNombre, setEditNombre] = useState('');
  const [editNombreEn, setEditNombreEn] = useState('');
  const [editInst, setEditInst] = useState('');
  const [editInstEn, setEditInstEn] = useState('');
  const [editTiempo, setEditTiempo] = useState('');
  const [editPorciones, setEditPorciones] = useState('');

  const cargarReceta = useCallback(async () => {
    setLoading(true);
    try {
      const data: Receta = await getReceta(id);
      setReceta(data);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Error al cargar la receta');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { cargarReceta(); }, [cargarReceta]);
  useFocusEffect(useCallback(() => { cargarReceta(); }, [cargarReceta]));

  function getNombre(obj: { es: string; en: string } | undefined) {
    if (!obj) return '';
    return obj[lang] ?? obj.es;
  }

  // Calcular nutrición total
  function calcularNutricion() {
    if (!receta?.ingredientes) return null;
    let cal = 0, prot = 0, hc = 0, gras = 0, fib = 0;
    for (const ri of receta.ingredientes) {
      const factor = (ri.cantidad || 0) / 100; // nutrición por 100g
      const ing = ri.ingrediente;
      if (!ing) continue;
      cal += (ing.calorias || 0) * factor;
      prot += (ing.proteinas || 0) * factor;
      hc += (ing.hidratos || 0) * factor;
      gras += (ing.grasas || 0) * factor;
      fib += (ing.fibra || 0) * factor;
    }
    return { cal: Math.round(cal), prot: Math.round(prot), hc: Math.round(hc), gras: Math.round(gras), fib: Math.round(fib) };
  }

  function abrirEditar() {
    if (!receta) return;
    setEditNombre(receta.nombre.es);
    setEditNombreEn(receta.nombre.en || '');
    setEditInst((receta.instrucciones as any).es);
    setEditInstEn((receta.instrucciones as any).en || '');
    setEditTiempo(receta.tiempoMin?.toString() || '');
    setEditPorciones(receta.porciones?.toString() || '');
    setEditando(true);
  }

  async function guardarEdicion() {
    if (!editNombre.trim() || !editInst.trim()) {
      Alert.alert('Error', 'Nombre e instrucciones son obligatorios');
      return;
    }
    setGuardando(true);
    try {
      await actualizarReceta(id, {
        nombre: { es: editNombre, en: editNombreEn || editNombre },
        instrucciones: { es: editInst, en: editInstEn || editInst },
        tiempoMin: editTiempo ? parseInt(editTiempo) : null,
        porciones: editPorciones ? parseInt(editPorciones) : null,
      });
      setEditando(false);
      cargarReceta();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  }

  async function handleEliminar() {
    try {
      await eliminarReceta(id);
      Alert.alert('✅', 'Receta eliminada');
      nav.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || 'Error al eliminar');
    }
  }

  async function handleDescargar() {
    setDownloading(true);
    try {
      await descargarReceta(id);
      Alert.alert('✅', 'Receta descargada offline');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Error al descargar');
    } finally {
      setDownloading(false);
    }
  }

  async function handleCompartir() {
    if (!receta) return;
    const nombre = getNombre(receta.nombre);
    const inst = getNombre(receta.instrucciones);
    const ings = receta.ingredientes?.map(ri =>
      `• ${ri.cantidad} ${ri.unidad} ${ri.ingrediente?.nombre ? getNombre(ri.ingrediente.nombre) : ''}`
    ).join('\n') || '';
    const mensaje = `🍳 ${nombre}\n\n📋 Ingredientes:\n${ings}\n\n👨‍🍳 Preparación:\n${inst}`;
    try { await Share.share({ message: mensaje, title: nombre }); } catch {}
  }

  const esPropietario = receta && usuario && receta.usuarioId === usuario.id;
  const nutricion = calcularNutricion();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (!receta) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Receta no encontrada</Text>
        <TouchableOpacity style={styles.btnPrimary} onPress={cargarReceta}>
          <Text style={styles.btnPrimaryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header con gradiente simulado */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            {receta.categoria && (
              <View style={styles.catBadge}>
                <Text style={styles.catBadgeText}>
                  {receta.categoria.icono} {getNombre(receta.categoria.nombre)}
                </Text>
              </View>
            )}
            <Text style={styles.titulo}>{getNombre(receta.nombre)}</Text>
            <View style={styles.metaRow}>
              {receta.tiempoMin && (
                <View style={styles.metaChip}>
                  <Text style={styles.metaText}>⏱ {receta.tiempoMin} min</Text>
                </View>
              )}
              {receta.porciones && (
                <View style={styles.metaChip}>
                  <Text style={styles.metaText}>🍽 {receta.porciones} pax</Text>
                </View>
              )}
              <View style={styles.metaChip}>
                <Text style={styles.metaText}>🧂 {receta.ingredientes?.length || 0} ings</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Valor nutricional */}
        {nutricion && (
          <View style={styles.nutricionCard}>
            <Text style={styles.nutricionTitulo}>📊 Valor nutricional (total receta)</Text>
            <View style={styles.nutricionGrid}>
              <View style={styles.nutItem}>
                <Text style={styles.nutValor}>{nutricion.cal}</Text>
                <Text style={styles.nutLabel}>kcal</Text>
              </View>
              <View style={styles.nutItem}>
                <Text style={[styles.nutValor, { color: '#4CAF50' }]}>{nutricion.prot}g</Text>
                <Text style={styles.nutLabel}>Proteínas</Text>
              </View>
              <View style={styles.nutItem}>
                <Text style={[styles.nutValor, { color: '#2196F3' }]}>{nutricion.hc}g</Text>
                <Text style={styles.nutLabel}>Hidratos</Text>
              </View>
              <View style={styles.nutItem}>
                <Text style={[styles.nutValor, { color: '#FFC107' }]}>{nutricion.gras}g</Text>
                <Text style={styles.nutLabel}>Grasas</Text>
              </View>
              <View style={styles.nutItem}>
                <Text style={[styles.nutValor, { color: '#9C27B0' }]}>{nutricion.fib}g</Text>
                <Text style={styles.nutLabel}>Fibra</Text>
              </View>
            </View>
          </View>
        )}

        {/* Ingredientes */}
        {receta.ingredientes && receta.ingredientes.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🧂 Ingredientes</Text>
            {receta.ingredientes.map((ri, index) => {
              const nombreIng = ri.ingrediente?.nombre ? getNombre(ri.ingrediente.nombre) : '';
              return (
                <View key={index} style={styles.ingRow}>
                  <View style={styles.ingDot} />
                  <Text style={styles.ingText}>
                    <Text style={styles.ingCantidad}>{ri.cantidad} {ri.unidad}</Text>
                    {'  '}{nombreIng}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Instrucciones */}
        {getNombre(receta.instrucciones) ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>👨‍🍳 Preparación</Text>
            <Text style={styles.instTexto}>{getNombre(receta.instrucciones)}</Text>
          </View>
        ) : null}

        {/* Botones de acción */}
        <View style={styles.botonesContainer}>
          <TouchableOpacity style={styles.btnAccion} onPress={handleDescargar} disabled={downloading}>
            {downloading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.btnAccionText}>📥 Descargar</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnAccionSec} onPress={handleCompartir}>
            <Text style={styles.btnAccionSecText}>🔗 Compartir</Text>
          </TouchableOpacity>

          {esPropietario && (
            <>
              <TouchableOpacity style={styles.btnAccionSec} onPress={abrirEditar}>
                <Text style={styles.btnAccionSecText}>✏️ Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnEliminar} onPress={() => setEliConfirm(true)}>
                <Text style={styles.btnEliminarText}>🗑 Eliminar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Modal Editar */}
      <Modal visible={editando} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitulo}>✏️ Editar receta</Text>

              <Text style={styles.label}>🇪🇸 Nombre *</Text>
              <TextInput style={styles.input} value={editNombre} onChangeText={setEditNombre} />

              <Text style={styles.label}>🇬🇧 Nombre (EN)</Text>
              <TextInput style={styles.input} value={editNombreEn} onChangeText={setEditNombreEn} />

              <View style={styles.row2}>
                <View style={styles.half}>
                  <Text style={styles.label}>⏱ Tiempo (min)</Text>
                  <TextInput style={styles.input} value={editTiempo} onChangeText={setEditTiempo} keyboardType="numeric" />
                </View>
                <View style={styles.half}>
                  <Text style={styles.label}>🍽 Porciones</Text>
                  <TextInput style={styles.input} value={editPorciones} onChangeText={setEditPorciones} keyboardType="numeric" />
                </View>
              </View>

              <Text style={styles.label}>🇪🇸 Instrucciones *</Text>
              <TextInput style={[styles.input, styles.textArea]} value={editInst} onChangeText={setEditInst} multiline numberOfLines={6} />

              <Text style={styles.label}>🇬🇧 Instrucciones (EN)</Text>
              <TextInput style={[styles.input, styles.textArea]} value={editInstEn} onChangeText={setEditInstEn} multiline numberOfLines={6} />

              <View style={styles.modalBotones}>
                <TouchableOpacity style={styles.btnCancelar} onPress={() => setEditando(false)}>
                  <Text>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnGuardar} onPress={guardarEdicion} disabled={guardando}>
                  {guardando ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.btnGuardarTexto}>Guardar</Text>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Confirmar Eliminar */}
      <Modal visible={eliConfirm} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitulo}>🗑 Eliminar receta</Text>
            <Text style={styles.confirmTexto}>¿Estás seguro? Esta acción no se puede deshacer.</Text>
            <View style={styles.confirmBotones}>
              <TouchableOpacity style={styles.btnCancelar} onPress={() => setEliConfirm(false)}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnEliminarConfirm} onPress={handleEliminar}>
                <Text style={styles.btnEliminarConfirmText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  loadingText: { marginTop: 12, fontSize: 16, color: colors.textSecondary },
  errorText: { fontSize: 16, color: colors.danger, marginBottom: 16 },
  btnPrimary: { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12 },
  btnPrimaryText: { color: '#fff', fontWeight: '600', fontSize: 15 },

  header: {
    backgroundColor: colors.primary,
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {},
  catBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  catBadgeText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metaChip: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  metaText: { color: '#fff', fontSize: 13, fontWeight: '500' },

  nutricionCard: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  nutricionTitulo: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 12 },
  nutricionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  nutItem: {
    flex: 1,
    minWidth: 60,
    alignItems: 'center',
    backgroundColor: colors.borderLight,
    borderRadius: 12,
    paddingVertical: 10,
  },
  nutValor: { fontSize: 18, fontWeight: 'bold', color: colors.primary },
  nutLabel: { fontSize: 11, color: colors.textLight, marginTop: 2 },

  card: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.primary, marginBottom: 12 },

  ingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  ingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginRight: 10 },
  ingText: { fontSize: 15, color: colors.text, flex: 1 },
  ingCantidad: { fontWeight: '600', color: colors.primary },

  instTexto: { fontSize: 15, color: colors.text, lineHeight: 24 },

  botonesContainer: { paddingHorizontal: 16, marginTop: 20, gap: 10 },
  btnAccion: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnAccionText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnAccionSec: {
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  btnAccionSecText: { color: colors.primary, fontSize: 15, fontWeight: '600' },
  btnEliminar: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  btnEliminarText: { color: colors.danger, fontSize: 15, fontWeight: '600' },

  bottomSpacer: { height: 24 },

  // Modales
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: colors.text },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 4, marginTop: 8 },
  input: {
    backgroundColor: colors.borderLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: colors.text,
    marginBottom: 6,
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  row2: { flexDirection: 'row', gap: 8 },
  half: { flex: 1 },
  modalBotones: { flexDirection: 'row', gap: 10, marginTop: 16 },
  btnCancelar: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  btnGuardar: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center' },
  btnGuardarTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // Confirmar eliminar
  confirmBox: {
    backgroundColor: '#fff',
    margin: 40,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  confirmTitulo: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  confirmTexto: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', marginBottom: 20 },
  confirmBotones: { flexDirection: 'row', gap: 12, width: '100%' },
  btnEliminarConfirm: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: colors.danger, alignItems: 'center' },
  btnEliminarConfirmText: { color: '#fff', fontWeight: 'bold' },
});

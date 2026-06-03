// src/screens/DetalleRecetaScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Share, Modal, TextInput,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { getReceta, descargarReceta, actualizarReceta, eliminarReceta } from '../services/api';
import { useI18n } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import type { Receta } from '../types';

export default function DetalleRecetaScreen({ route, navigation }: any) {
  const { id } = route.params as { id: string };
  const { t, lang } = useI18n();
  const { usuario } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const nav = useNavigation<any>();
  const s = styles(theme);

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
  const [editComidaTipo, setEditComidaTipo] = useState<string[]>([]);

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

  function calcularNutricionPorPorcion() {
    const total = calcularNutricion();
    if (!total) return null;
    const p = receta?.porciones && receta.porciones > 0 ? receta.porciones : 1;
    return {
      cal: Math.round(total.cal / p),
      prot: Math.round(total.prot / p),
      hc: Math.round(total.hc / p),
      gras: Math.round(total.gras / p),
      fib: Math.round(total.fib / p),
    };
  }

  function abrirEditar() {
    if (!receta) return;
    setEditNombre(receta.nombre.es);
    setEditNombreEn(receta.nombre.en || '');
    setEditInst((receta.instrucciones as any).es);
    setEditInstEn((receta.instrucciones as any).en || '');
    setEditTiempo(receta.tiempoMin?.toString() || '');
    setEditPorciones(receta.porciones?.toString() || '');
    setEditComidaTipo(receta.comidaTipo || []);
    setEditando(true);
  }

  async function guardarEdicion() {
    console.log('📤 Guardando edición receta:', { id, editNombre, editInst, editTiempo, editPorciones, editComidaTipo });
    if (!editNombre.trim() || !editInst.trim()) {
      Alert.alert('Error', 'Nombre e instrucciones son obligatorios');
      return;
    }
    if (!id) {
      Alert.alert('Error', 'ID de receta no encontrado');
      return;
    }
    setGuardando(true);
    try {
      const result = await actualizarReceta(id, {
        nombre: { es: editNombre, en: editNombreEn || editNombre },
        instrucciones: { es: editInst, en: editInstEn || editInst },
        tiempoMin: editTiempo ? parseInt(editTiempo) : null,
        porciones: editPorciones ? parseInt(editPorciones) : null,
        comidaTipo: editComidaTipo,
      });
      console.log('✅ Receta actualizada:', result);
      setEditando(false);
      cargarReceta();
    } catch (err: any) {
      console.error('❌ Error guardando receta:', err);
      Alert.alert('Error', err.response?.data?.error || err.message || 'Error al guardar');
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
  const nutricionPorPorcion = calcularNutricionPorPorcion();

  if (loading) {
    return (
      <View style={s.centered}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={s.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (!receta) {
    return (
      <View style={s.centered}>
        <Text style={s.errorText}>Receta no encontrada</Text>
        <TouchableOpacity style={s.btnPrimary} onPress={cargarReceta}>
          <Text style={s.btnPrimaryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header con gradiente simulado */}
        <View style={s.header}>
          <View style={s.headerRow}>
            <Text style={s.headerTitle}>{getNombre(receta.nombre)}</Text>
            <TouchableOpacity onPress={toggleTheme} style={s.themeToggle}>
              <Text style={s.themeToggleText}>{theme.mode === 'light' ? '🌙' : '☀️'}</Text>
            </TouchableOpacity>
          </View>
          {receta.categoria && (
            <View style={s.catBadge}>
              <Text style={s.catBadgeText}>
                {receta.categoria.icono} {getNombre(receta.categoria.nombre)}
              </Text>
            </View>
          )}
          {receta.comidaTipo && receta.comidaTipo.length > 0 && (
            <View style={s.mealTypeRow}>
              {receta.comidaTipo.map((tipo) => (
                <View key={tipo} style={s.mealTypeBadge}>
                  <Text style={s.mealTypeBadgeText}>
                    {tipo === 'almuerzo' ? '☀️ Almuerzo' : '🌙 Cena'}
                  </Text>
                </View>
              ))}
            </View>
          )}
          <View style={s.metaRow}>
            {receta.tiempoMin && (
              <View style={s.metaChip}>
                <Text style={s.metaText}>⏱ {receta.tiempoMin} min</Text>
              </View>
            )}
            {receta.porciones && (
              <View style={s.metaChip}>
                <Text style={s.metaText}>🍽 {receta.porciones} pax</Text>
              </View>
            )}
            <View style={s.metaChip}>
              <Text style={s.metaText}>🧂 {receta.ingredientes?.length || 0} ings</Text>
            </View>
          </View>
        </View>

        {/* Valor nutricional */}
        {nutricion && (
          <View style={s.nutricionCard}>
            <Text style={s.nutricionTitulo}>📊 Valor nutricional (total receta)</Text>
            <View style={s.nutricionGrid}>
              <View style={s.nutItem}>
                <Text style={s.nutValor}>{nutricion.cal}</Text>
                <Text style={s.nutLabel}>kcal</Text>
              </View>
              <View style={s.nutItem}>
                <Text style={[s.nutValor, { color: theme.secondary }]}>{nutricion.prot}g</Text>
                <Text style={s.nutLabel}>Proteínas</Text>
              </View>
              <View style={s.nutItem}>
                <Text style={[s.nutValor, { color: theme.accent }]}>{nutricion.hc}g</Text>
                <Text style={s.nutLabel}>Hidratos</Text>
              </View>
              <View style={s.nutItem}>
                <Text style={[s.nutValor, { color: theme.warning }]}>{nutricion.gras}g</Text>
                <Text style={s.nutLabel}>Grasas</Text>
              </View>
              <View style={s.nutItem}>
                <Text style={[s.nutValor, { color: '#9C27B0' }]}>{nutricion.fib}g</Text>
                <Text style={s.nutLabel}>Fibra</Text>
              </View>
            </View>

            {receta.porciones && receta.porciones > 0 && nutricionPorPorcion && (
              <>
                <View style={s.nutricionDivider} />
                <Text style={s.nutricionTitulo}>📊 Por porción ({receta.porciones} pax)</Text>
                <View style={s.nutricionGrid}>
                  <View style={s.nutItem}>
                    <Text style={s.nutValor}>{nutricionPorPorcion.cal}</Text>
                    <Text style={s.nutLabel}>kcal</Text>
                  </View>
                  <View style={s.nutItem}>
                    <Text style={[s.nutValor, { color: theme.secondary }]}>{nutricionPorPorcion.prot}g</Text>
                    <Text style={s.nutLabel}>Proteínas</Text>
                  </View>
                  <View style={s.nutItem}>
                    <Text style={[s.nutValor, { color: theme.accent }]}>{nutricionPorPorcion.hc}g</Text>
                    <Text style={s.nutLabel}>Hidratos</Text>
                  </View>
                  <View style={s.nutItem}>
                    <Text style={[s.nutValor, { color: theme.warning }]}>{nutricionPorPorcion.gras}g</Text>
                    <Text style={s.nutLabel}>Grasas</Text>
                  </View>
                  <View style={s.nutItem}>
                    <Text style={[s.nutValor, { color: '#9C27B0' }]}>{nutricionPorPorcion.fib}g</Text>
                    <Text style={s.nutLabel}>Fibra</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        )}

        {/* Ingredientes */}
        {receta.ingredientes && receta.ingredientes.length > 0 && (
          <View style={s.card}>
            <Text style={s.cardTitle}>🧂 Ingredientes</Text>
            {receta.ingredientes.map((ri, index) => {
              const nombreIng = ri.ingrediente?.nombre ? getNombre(ri.ingrediente.nombre) : '';
              return (
                <View key={index} style={s.ingRow}>
                  <View style={s.ingDot} />
                  <Text style={s.ingText}>
                    <Text style={s.ingCantidad}>{ri.cantidad} {ri.unidad}</Text>
                    {'  '}{nombreIng}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Instrucciones */}
        {getNombre(receta.instrucciones) ? (
          <View style={s.card}>
            <Text style={s.cardTitle}>👨‍🍳 Preparación</Text>
            <Text style={s.instTexto}>{getNombre(receta.instrucciones)}</Text>
          </View>
        ) : null}

        {/* Botones de acción */}
        <View style={s.botonesContainer}>
          <TouchableOpacity style={s.btnAccion} onPress={handleDescargar} disabled={downloading}>
            {downloading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.btnAccionText}>📥 Descargar</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={s.btnAccionSec} onPress={handleCompartir}>
            <Text style={s.btnAccionSecText}>🔗 Compartir</Text>
          </TouchableOpacity>

          {esPropietario && (
            <>
              <TouchableOpacity style={s.btnAccionSec} onPress={abrirEditar}>
                <Text style={s.btnAccionSecText}>✏️ Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={s.btnEliminar} onPress={() => setEliConfirm(true)}>
                <Text style={s.btnEliminarText}>🗑 Eliminar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={s.bottomSpacer} />
      </ScrollView>

      {/* Modal Editar */}
      <Modal visible={editando} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={s.modalTitulo}>✏️ Editar receta</Text>

              <Text style={s.label}>🇪🇸 Nombre *</Text>
              <TextInput style={s.input} value={editNombre} onChangeText={setEditNombre} />

              <Text style={s.label}>🇬🇧 Nombre (EN)</Text>
              <TextInput style={s.input} value={editNombreEn} onChangeText={setEditNombreEn} />

              <View style={s.row2}>
                <View style={s.half}>
                  <Text style={s.label}>⏱ Tiempo (min)</Text>
                  <TextInput style={s.input} value={editTiempo} onChangeText={setEditTiempo} keyboardType="numeric" />
                </View>
                <View style={s.half}>
                  <Text style={s.label}>🍽 Porciones</Text>
                  <TextInput style={s.input} value={editPorciones} onChangeText={setEditPorciones} keyboardType="numeric" />
                </View>
              </View>

              <Text style={s.label}>🕐 Tipo de comida</Text>
              <View style={s.toggleRow}>
                {(['almuerzo', 'cena'] as const).map((tipo) => {
                  const selected = editComidaTipo.includes(tipo);
                  return (
                    <TouchableOpacity
                      key={tipo}
                      style={[s.toggleBtn, selected && s.toggleBtnActive]}
                      onPress={() => {
                        setEditComidaTipo((prev) =>
                          selected ? prev.filter((t) => t !== tipo) : [...prev, tipo]
                        );
                      }}
                    >
                      <Text style={[s.toggleBtnText, selected && s.toggleBtnTextActive]}>
                        {tipo === 'almuerzo' ? '☀️ Almuerzo' : '🌙 Cena'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={s.label}>🇪🇸 Instrucciones *</Text>
              <TextInput style={[s.input, s.textArea]} value={editInst} onChangeText={setEditInst} multiline numberOfLines={6} />

              <Text style={s.label}>🇬🇧 Instrucciones (EN)</Text>
              <TextInput style={[s.input, s.textArea]} value={editInstEn} onChangeText={setEditInstEn} multiline numberOfLines={6} />

              <View style={s.modalBotones}>
                <TouchableOpacity style={s.btnCancelar} onPress={() => setEditando(false)}>
                  <Text>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.btnGuardar} onPress={guardarEdicion} disabled={guardando}>
                  {guardando ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.btnGuardarTexto}>Guardar</Text>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Confirmar Eliminar */}
      <Modal visible={eliConfirm} animationType="fade" transparent>
        <View style={s.modalOverlay}>
          <View style={s.confirmBox}>
            <Text style={s.confirmTitulo}>🗑 Eliminar receta</Text>
            <Text style={s.confirmTexto}>¿Estás seguro? Esta acción no se puede deshacer.</Text>
            <View style={s.confirmBotones}>
              <TouchableOpacity style={s.btnCancelar} onPress={() => setEliConfirm(false)}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.btnEliminarConfirm} onPress={handleEliminar}>
                <Text style={s.btnEliminarConfirmText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function styles(theme: any) {
return StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  scrollContent: { paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background },
  loadingText: { marginTop: 12, fontSize: 16, color: theme.textSecondary },
  errorText: { fontSize: 16, color: theme.danger, marginBottom: 16 },
  btnPrimary: { backgroundColor: theme.primary, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12 },
  btnPrimaryText: { color: '#fff', fontWeight: '600', fontSize: 15 },

  header: {
    backgroundColor: theme.headerBg,
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: theme.textWhite, flex: 1 },
  themeToggle: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  themeToggleText: { fontSize: 22 },
  catBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  catBadgeText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metaChip: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  metaText: { color: '#fff', fontSize: 13, fontWeight: '500' },

  mealTypeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  mealTypeBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  mealTypeBadgeText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  nutricionCard: {
    backgroundColor: theme.card,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: theme.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  nutricionTitulo: { fontSize: 15, fontWeight: '600', color: theme.text, marginBottom: 12 },
  nutricionDivider: { height: 1, backgroundColor: theme.borderLight, marginVertical: 14 },
  nutricionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  nutItem: {
    flex: 1,
    minWidth: 60,
    alignItems: 'center',
    backgroundColor: theme.borderLight,
    borderRadius: 12,
    paddingVertical: 10,
  },
  nutValor: { fontSize: 18, fontWeight: 'bold', color: theme.primary },
  nutLabel: { fontSize: 11, color: theme.textLight, marginTop: 2 },

  card: {
    backgroundColor: theme.card,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: theme.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: theme.primary, marginBottom: 12 },

  ingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  ingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.primary, marginRight: 10 },
  ingText: { fontSize: 15, color: theme.text, flex: 1 },
  ingCantidad: { fontWeight: '600', color: theme.primary },

  instTexto: { fontSize: 15, color: theme.text, lineHeight: 24 },

  botonesContainer: { paddingHorizontal: 16, marginTop: 20, gap: 10 },
  btnAccion: {
    backgroundColor: theme.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnAccionText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnAccionSec: {
    backgroundColor: theme.card,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.primary,
  },
  btnAccionSecText: { color: theme.primary, fontSize: 15, fontWeight: '600' },
  btnEliminar: {
    backgroundColor: theme.card,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.danger,
  },
  btnEliminarText: { color: theme.danger, fontSize: 15, fontWeight: '600' },

  bottomSpacer: { height: 24 },

  // Modales
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: theme.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: theme.text },
  label: { fontSize: 13, fontWeight: '600', color: theme.text, marginBottom: 4, marginTop: 8 },
  input: {
    backgroundColor: theme.borderLight,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: theme.text,
    marginBottom: 6,
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  row2: { flexDirection: 'row', gap: 8 },
  half: { flex: 1 },
  modalBotones: { flexDirection: 'row', gap: 10, marginTop: 16 },
  btnCancelar: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: theme.border, alignItems: 'center' },
  btnGuardar: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: theme.primary, alignItems: 'center' },
  btnGuardarTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  toggleRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.border,
    alignItems: 'center',
    backgroundColor: theme.borderLight,
  },
  toggleBtnActive: {
    borderColor: theme.primary,
    backgroundColor: theme.primary + '20',
  },
  toggleBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  toggleBtnTextActive: {
    color: theme.primary,
  },

  // Confirmar eliminar
  confirmBox: {
    backgroundColor: theme.card,
    margin: 40,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  confirmTitulo: { fontSize: 20, fontWeight: 'bold', color: theme.text, marginBottom: 8 },
  confirmTexto: { fontSize: 15, color: theme.textSecondary, textAlign: 'center', marginBottom: 20 },
  confirmBotones: { flexDirection: 'row', gap: 12, width: '100%' },
  btnEliminarConfirm: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: theme.danger, alignItems: 'center' },
  btnEliminarConfirmText: { color: '#fff', fontWeight: 'bold' },
});
}

import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Modal, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { useI18n } from '../i18n';
import * as api from '../services/api';
import { Ingrediente, TipoIngrediente } from '../types';
import { useFocusEffect } from '@react-navigation/native';

const SUPERMERCADOS = [
  { value: 'mercadona', label: 'Mercadona' },
  { value: 'carrefour', label: 'Carrefour' },
  { value: 'dia', label: 'DIA' },
  { value: 'lidl', label: 'Lidl' },
  { value: 'aldi', label: 'Aldi' },
];

export default function IngredientesScreen() {
  const { t, lang } = useI18n();
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [tipos, setTipos] = useState<TipoIngrediente[]>([]);
  const [buscar, setBuscar] = useState('');
  const [cargando, setCargando] = useState(true);
  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [expandido, setExpandido] = useState<string | null>(null);

  // Form state
  const [fNombre, setFNombre] = useState('');
  const [fNombreEn, setFNombreEn] = useState('');
  const [fUnidad, setFUnidad] = useState('g');
  const [fTipoId, setFTipoId] = useState('');
  const [fCalorias, setFCalorias] = useState('');
  const [fProteinas, setFProteinas] = useState('');
  const [fHidratos, setFHidratos] = useState('');
  const [fGrasas, setFGrasas] = useState('');
  const [fFibra, setFFibra] = useState('');
  const [fPrecios, setFPrecios] = useState<any[]>([]);
  const [guardando, setGuardando] = useState(false);

  const getNombre = (obj: { es: string; en: string }) => obj[lang] || obj.es;

  const cargar = async () => {
    try {
      setCargando(true);
      const [ingsData, tiposData] = await Promise.all([
        api.getIngredientes(buscar || undefined),
        api.getTiposIngrediente(),
      ]);
      setIngredientes(ingsData);
      setTipos(tiposData);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useFocusEffect(useCallback(() => { cargar(); }, [buscar]));

  function resetForm() {
    setFNombre(''); setFNombreEn(''); setFUnidad('g'); setFTipoId('');
    setFCalorias(''); setFProteinas(''); setFHidratos(''); setFGrasas(''); setFFibra('');
    setFPrecios([]);
  }

  function addPrecio() {
    setFPrecios([...fPrecios, { supermercado: 'mercadona', precio: '', unidad: 'kg' }]);
  }

  function removePrecio(idx: number) {
    setFPrecios(fPrecios.filter((_, i) => i !== idx));
  }

  function updatePrecio(idx: number, campo: string, valor: string) {
    const updated = [...fPrecios];
    updated[idx] = { ...updated[idx], [campo]: valor };
    setFPrecios(updated);
  }

  async function crearIngrediente() {
    if (!fNombre.trim()) return;
    setGuardando(true);
    try {
      const data: any = {
        nombre: { es: fNombre, en: fNombreEn || fNombre },
        unidadBase: fUnidad,
        tipoId: fTipoId || undefined,
        calorias: fCalorias ? parseFloat(fCalorias) : undefined,
        proteinas: fProteinas ? parseFloat(fProteinas) : undefined,
        hidratos: fHidratos ? parseFloat(fHidratos) : undefined,
        grasas: fGrasas ? parseFloat(fGrasas) : undefined,
        fibra: fFibra ? parseFloat(fFibra) : undefined,
        precios: fPrecios.filter(p => p.precio).map(p => ({
          supermercado: p.supermercado,
          precio: parseFloat(p.precio),
          unidad: p.unidad,
        })),
      };
      await api.crearIngrediente(data);
      setMostrarNuevo(false);
      resetForm();
      cargar();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || 'Error al crear');
    } finally {
      setGuardando(false);
    }
  }

  function mejorPrecio(ing: Ingrediente) {
    if (!ing.precios || ing.precios.length === 0) return null;
    const sorted = [...ing.precios].sort((a, b) => {
      // Normalizar a precio por kg/l/ud para comparar
      return a.precio - b.precio;
    });
    return sorted[0];
  }

  function renderItem({ item }: { item: Ingrediente }) {
    const isExpanded = expandido === item.id;
    const tipo = item.tipo;
    const mp = mejorPrecio(item);

    return (
      <View>
        <TouchableOpacity
          style={styles.item}
          onPress={() => setExpandido(isExpanded ? null : item.id)}
        >
          <View style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemNombre}>{getNombre(item.nombre)}</Text>
              {tipo && (
                <Text style={styles.itemTipo}>{tipo.icono} {getNombre(tipo.nombre)}</Text>
              )}
              {item.calorias != null && (
                <Text style={styles.itemNutricion}>
                  🔥 {item.calorias} kcal | P: {item.proteinas ?? '-'}g | HC: {item.hidratos ?? '-'}g | G: {item.grasas ?? '-'}g
                </Text>
              )}
              {mp && (
                <Text style={styles.itemPrecio}>
                  🛒 {mp.supermercado.charAt(0).toUpperCase() + mp.supermercado.slice(1)} {mp.precio.toFixed(2)} €/{mp.unidad}
                </Text>
              )}
            </View>
            <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandido}>
            {/* Nutrición */}
            {(item.calorias != null || item.proteinas != null) && (
              <View style={styles.seccion}>
                <Text style={styles.seccionTitulo}>📊 Valor nutricional (por 100g)</Text>
                <FilaNutriente label="Calorías" valor={item.calorias} unidad="kcal" color="#FF6B35" />
                <FilaNutriente label="Proteínas" valor={item.proteinas} unidad="g" color="#4CAF50" />
                <FilaNutriente label="Hidratos" valor={item.hidratos} unidad="g" color="#2196F3" />
                <FilaNutriente label="Grasas" valor={item.grasas} unidad="g" color="#FFC107" />
                <FilaNutriente label="Fibra" valor={item.fibra} unidad="g" color="#9C27B0" />
              </View>
            )}

            {/* Precios */}
            {item.precios && item.precios.length > 0 && (
              <View style={styles.seccion}>
                <Text style={styles.seccionTitulo}>🛒 Precios en supermercados</Text>
                {item.precios
                  .sort((a, b) => a.precio - b.precio)
                  .map((p, i) => (
                    <View key={i} style={styles.precioRow}>
                      <Text style={styles.precioNombre}>
                        {p.supermercado.charAt(0).toUpperCase() + p.supermercado.slice(1)}
                      </Text>
                      <Text style={[styles.precioValor, i === 0 && styles.precioMejor]}>
                        {p.precio.toFixed(2)} €/{p.unidad}
                      </Text>
                    </View>
                  ))}
              </View>
            )}
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.buscador}
        placeholder="Buscar ingrediente..."
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
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTexto}>🧂 No hay ingredientes</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => { resetForm(); setMostrarNuevo(true); }}>
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>

      {/* Modal nuevo ingrediente */}
      <Modal visible={mostrarNuevo} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitulo}>+ Nuevo ingrediente</Text>

              <Text style={styles.label}>🇪🇸 Nombre *</Text>
              <TextInput style={styles.input} value={fNombre} onChangeText={setFNombre} placeholder="Tomate" />

              <Text style={styles.label}>🇬🇧 Nombre (EN)</Text>
              <TextInput style={styles.input} value={fNombreEn} onChangeText={setFNombreEn} placeholder="Tomato" />

              <Text style={styles.label}>Tipo</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tiposRow}>
                {tipos.map(tipo => (
                  <TouchableOpacity
                    key={tipo.id}
                    style={[styles.tipoChip, fTipoId === tipo.id && styles.tipoActivo]}
                    onPress={() => setFTipoId(fTipoId === tipo.id ? '' : tipo.id)}
                  >
                    <Text>{tipo.icono} {getNombre(tipo.nombre)}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Unidad base</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tiposRow}>
                {['g', 'kg', 'ml', 'l', 'ud', 'taza', 'cucharada', 'pizca'].map(u => (
                  <TouchableOpacity
                    key={u}
                    style={[styles.tipoChip, fUnidad === u && styles.tipoActivo]}
                    onPress={() => setFUnidad(u)}
                  >
                    <Text>{u}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>📊 Valor nutricional (por 100g)</Text>
              <View style={styles.row2}>
                <View style={styles.half}>
                  <Text style={styles.sublabel}>Kcal</Text>
                  <TextInput style={styles.input} value={fCalorias} onChangeText={setFCalorias} placeholder="18" keyboardType="numeric" />
                </View>
                <View style={styles.half}>
                  <Text style={styles.sublabel}>Proteínas (g)</Text>
                  <TextInput style={styles.input} value={fProteinas} onChangeText={setFProteinas} placeholder="0.9" keyboardType="numeric" />
                </View>
              </View>
              <View style={styles.row2}>
                <View style={styles.half}>
                  <Text style={styles.sublabel}>Hidratos (g)</Text>
                  <TextInput style={styles.input} value={fHidratos} onChangeText={setFHidratos} placeholder="3.9" keyboardType="numeric" />
                </View>
                <View style={styles.half}>
                  <Text style={styles.sublabel}>Grasas (g)</Text>
                  <TextInput style={styles.input} value={fGrasas} onChangeText={setFGrasas} placeholder="0.2" keyboardType="numeric" />
                </View>
              </View>
              <Text style={styles.sublabel}>Fibra (g)</Text>
              <TextInput style={styles.input} value={fFibra} onChangeText={setFFibra} placeholder="1.2" keyboardType="numeric" />

              <Text style={styles.label}>🛒 Precios</Text>
              {fPrecios.map((p, i) => (
                <View key={i} style={styles.precioForm}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.supermercadosRow}>
                    {SUPERMERCADOS.map(s => (
                      <TouchableOpacity
                        key={s.value}
                        style={[styles.supChip, p.supermercado === s.value && styles.supActivo]}
                        onPress={() => updatePrecio(i, 'supermercado', s.value)}
                      >
                        <Text style={styles.supText}>{s.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <View style={styles.row2}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      value={p.precio}
                      onChangeText={v => updatePrecio(i, 'precio', v)}
                      placeholder="2.19"
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={[styles.input, { width: 60 }]}
                      value={p.unidad}
                      onChangeText={v => updatePrecio(i, 'unidad', v)}
                      placeholder="kg"
                    />
                    <TouchableOpacity onPress={() => removePrecio(i)} style={styles.btnRemove}>
                      <Text style={{ color: '#e74c3c' }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <TouchableOpacity style={styles.btnAddPrecio} onPress={addPrecio}>
                <Text style={styles.btnAddPrecioTexto}>+ Añadir precio</Text>
              </TouchableOpacity>

              <View style={styles.modalBotones}>
                <TouchableOpacity style={styles.btnCancelar} onPress={() => { setMostrarNuevo(false); resetForm(); }}>
                  <Text>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnGuardar} onPress={crearIngrediente} disabled={guardando}>
                  {guardando ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.btnGuardarTexto}>Guardar</Text>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Componente para barra nutricional
function FilaNutriente({ label, valor, unidad, color }: { label: string; valor?: number; unidad: string; color: string }) {
  const ancho = Math.min(((valor || 0) / 100) * 100, 100);
  return (
    <View style={styles.filaNut}>
      <Text style={styles.filaLabel}>{label}</Text>
      <View style={styles.barraContainer}>
        <View style={[styles.barra, { width: `${Math.max(ancho, 2)}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.filaValor}>{valor != null ? valor : '-'}{unidad}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  buscador: { backgroundColor: '#fff', margin: 12, padding: 12, borderRadius: 10, fontSize: 16, borderWidth: 1, borderColor: '#eee' },
  loader: { flex: 1 },
  lista: { paddingHorizontal: 12 },
  item: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 6 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemInfo: { flex: 1 },
  itemNombre: { fontSize: 16, fontWeight: '600', color: '#333' },
  itemTipo: { fontSize: 12, color: '#888', marginTop: 2 },
  itemNutricion: { fontSize: 12, color: '#666', marginTop: 3 },
  itemPrecio: { fontSize: 13, color: '#FF6B35', marginTop: 2, fontWeight: '500' },
  chevron: { fontSize: 14, color: '#ccc', marginLeft: 8 },
  expandido: { backgroundColor: '#fff', borderBottomLeftRadius: 12, borderBottomRightRadius: 12, padding: 14, marginTop: -6, marginBottom: 6, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  seccion: { marginBottom: 14 },
  seccionTitulo: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  filaNut: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  filaLabel: { width: 70, fontSize: 13, color: '#666' },
  barraContainer: { flex: 1, height: 8, backgroundColor: '#f0f0f0', borderRadius: 4, marginHorizontal: 8 },
  barra: { height: 8, borderRadius: 4 },
  filaValor: { width: 60, textAlign: 'right', fontSize: 13, fontWeight: '500', color: '#333' },
  precioRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  precioNombre: { fontSize: 14, color: '#333', textTransform: 'capitalize' },
  precioValor: { fontSize: 14, fontWeight: '500', color: '#666' },
  precioMejor: { color: '#FF6B35', fontWeight: 'bold' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  emptyTexto: { fontSize: 16, color: '#999' },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#FF6B35', justifyContent: 'center', alignItems: 'center', elevation: 6 },
  fabTexto: { color: '#fff', fontSize: 28, lineHeight: 30 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 4, marginTop: 10 },
  sublabel: { fontSize: 12, color: '#666', marginBottom: 2 },
  input: { backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 10, fontSize: 15, marginBottom: 6 },
  tiposRow: { marginBottom: 8 },
  tipoChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, backgroundColor: '#f0f0f0', marginRight: 6 },
  tipoActivo: { backgroundColor: '#FF6B35' },
  row2: { flexDirection: 'row', gap: 8 },
  half: { flex: 1 },
  supChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, backgroundColor: '#f0f0f0', marginRight: 4 },
  supActivo: { backgroundColor: '#FF6B35' },
  supText: { fontSize: 11 },
  supermercadosRow: { marginBottom: 6 },
  precioForm: { backgroundColor: '#f8f9fa', borderRadius: 8, padding: 8, marginBottom: 8 },
  btnRemove: { padding: 8, justifyContent: 'center' },
  btnAddPrecio: { borderWidth: 1, borderColor: '#FF6B35', borderStyle: 'dashed', borderRadius: 8, padding: 10, alignItems: 'center', marginBottom: 16 },
  btnAddPrecioTexto: { color: '#FF6B35', fontWeight: '600' },
  modalBotones: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btnCancelar: { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  btnGuardar: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: '#FF6B35', alignItems: 'center' },
  btnGuardarTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

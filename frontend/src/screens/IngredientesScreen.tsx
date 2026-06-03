import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Modal, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { useI18n } from '../i18n';
import * as api from '../services/api';
import { Ingrediente, TipoIngrediente } from '../types';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const SUPERMERCADOS_PRINCIPALES = ['mercadona', 'lidl'];
const SUPERMERCADOS = [
  { value: 'mercadona', label: 'Mercadona' },
  { value: 'lidl', label: 'Lidl' },
  { value: 'carrefour', label: 'Carrefour' },
  { value: 'dia', label: 'DIA' },
  { value: 'aldi', label: 'Aldi' },
];

export default function IngredientesScreen() {
  const { t, lang } = useI18n();
  const { theme } = useTheme();
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [ingredientesSistema, setIngredientesSistema] = useState<Ingrediente[]>([]);
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

  // Estado para editar ingrediente existente
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [mostrarEditar, setMostrarEditar] = useState(false);

  // Autocomplete state
  const [sugerencias, setSugerencias] = useState<Ingrediente[]>([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const fNombreRef = useRef<TextInput>(null);

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

  // Cargar todos los ingredientes del sistema (sin filtro) para autocompletado
  const cargarIngredientesSistema = async () => {
    try {
      const todos = await api.getIngredientes();
      setIngredientesSistema(todos);
    } catch (err) {
      console.error('Error cargando ingredientes del sistema:', err);
    }
  };

  useEffect(() => {
    cargarIngredientesSistema();
  }, []);

  useFocusEffect(useCallback(() => { cargar(); }, [buscar]));

  function resetForm() {
    setFNombre(''); setFNombreEn(''); setFUnidad('g'); setFTipoId('');
    setFCalorias(''); setFProteinas(''); setFHidratos(''); setFGrasas(''); setFFibra('');
    setFPrecios([]);
    setSugerencias([]);
    setMostrarSugerencias(false);
  }

  // Manejar cambio en campo nombre: filtrar sugerencias
  function handleNombreChange(text: string) {
    setFNombre(text);
    if (text.trim().length >= 2) {
      const query = text.toLowerCase().trim();
      // Filtrar ingredientes del sistema que coincidan, excluyendo los que ya están en la lista principal
      const filtrados = ingredientesSistema.filter(ing => {
        const nombreIng = getNombre(ing.nombre).toLowerCase();
        return nombreIng.includes(query);
      });
      setSugerencias(filtrados.slice(0, 6));
      setMostrarSugerencias(filtrados.length > 0);
    } else {
      setSugerencias([]);
      setMostrarSugerencias(false);
    }
  }

  // Seleccionar un ingrediente de las sugerencias
  function seleccionarIngrediente(ing: Ingrediente) {
    setFNombre(getNombre(ing.nombre));
    setFNombreEn(ing.nombre.en || '');
    setFUnidad(ing.unidadBase || 'g');
    setFTipoId(ing.tipoId || '');
    setFCalorias(ing.calorias != null ? String(ing.calorias) : '');
    setFProteinas(ing.proteinas != null ? String(ing.proteinas) : '');
    setFHidratos(ing.hidratos != null ? String(ing.hidratos) : '');
    setFGrasas(ing.grasas != null ? String(ing.grasas) : '');
    setFFibra(ing.fibra != null ? String(ing.fibra) : '');
    // Autocompletar precios
    if (ing.precios && ing.precios.length > 0) {
      setFPrecios(ing.precios.map(p => ({
        supermercado: p.supermercado,
        precio: String(p.precio),
        unidad: p.unidad,
      })));
    } else {
      setFPrecios([]);
    }
    setSugerencias([]);
    setMostrarSugerencias(false);
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

  // Cargar datos de un ingrediente existente en el formulario para editar
  function abrirEditar(ing: Ingrediente) {
    setEditandoId(ing.id);
    setFNombre(getNombre(ing.nombre));
    setFNombreEn(ing.nombre.en || '');
    setFUnidad(ing.unidadBase || 'g');
    setFTipoId(ing.tipoId || '');
    setFCalorias(ing.calorias != null ? String(ing.calorias) : '');
    setFProteinas(ing.proteinas != null ? String(ing.proteinas) : '');
    setFHidratos(ing.hidratos != null ? String(ing.hidratos) : '');
    setFGrasas(ing.grasas != null ? String(ing.grasas) : '');
    setFFibra(ing.fibra != null ? String(ing.fibra) : '');
    setFPrecios(ing.precios?.map(p => ({
      supermercado: p.supermercado,
      precio: String(p.precio),
      unidad: p.unidad,
    })) || []);
    setExpandido(null);
    setMostrarEditar(true);
  }

  async function guardarEdicion() {
    if (!fNombre.trim() || !editandoId) return;
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
      await api.actualizarIngrediente(editandoId, data);
      setMostrarEditar(false);
      resetForm();
      cargar();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarIngrediente(ingId: string) {
    Alert.alert(
      'Eliminar ingrediente',
      '¿Estás seguro? Esto puede afectar a recetas que lo usen.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.eliminarIngrediente(ingId);
              cargar();
            } catch (err: any) {
              Alert.alert('Error', err.response?.data?.error || 'Error al eliminar');
            }
          },
        },
      ]
    );
  }

  function preciosPrincipales(ing: Ingrediente) {
    if (!ing.precios) return [];
    return ing.precios.filter(p => SUPERMERCADOS_PRINCIPALES.includes(p.supermercado));
  }

  function preciosSecundarios(ing: Ingrediente) {
    if (!ing.precios) return [];
    return ing.precios.filter(p => !SUPERMERCADOS_PRINCIPALES.includes(p.supermercado));
  }

  function mejorPrecio(ing: Ingrediente) {
    if (!ing.precios || ing.precios.length === 0) return null;
    const sorted = [...ing.precios].sort((a, b) => a.precio - b.precio);
    return sorted[0];
  }

  function renderSugerencia({ item }: { item: Ingrediente }) {
    return (
      <TouchableOpacity
        style={[styles.sugerenciaItem, {
          backgroundColor: theme.surface,
          borderBottomColor: theme.borderLight,
        }]}
        onPress={() => seleccionarIngrediente(item)}
        activeOpacity={0.7}
      >
        <Text style={[styles.sugerenciaNombre, { color: theme.text }]}>
          {getNombre(item.nombre)}
        </Text>
        <Text style={[styles.sugerenciaDetalle, { color: theme.textSecondary }]}>
          {item.unidadBase && `${item.unidadBase} · `}
          {item.calorias != null ? `${item.calorias} kcal` : ''}
          {item.tipo ? ` · ${item.tipo.icono}` : ''}
        </Text>
        {item.precios && item.precios.length > 0 && (
          <Text style={[styles.sugerenciaPrecio, { color: theme.primary }]}>
            🛒 {item.precios.length} precio{item.precios.length > 1 ? 's' : ''} disponible{item.precios.length > 1 ? 's' : ''}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  function renderItem({ item }: { item: Ingrediente }) {
    const isExpanded = expandido === item.id;
    const tipo = item.tipo;
    const mp = mejorPrecio(item);

    return (
      <View>
        <TouchableOpacity
          style={[styles.item, { backgroundColor: theme.card }]}
          onPress={() => setExpandido(isExpanded ? null : item.id)}
        >
          <View style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemNombre, { color: theme.text }]}>{getNombre(item.nombre)}</Text>
              {tipo && (
                <Text style={[styles.itemTipo, { color: theme.textSecondary }]}>{tipo.icono} {getNombre(tipo.nombre)}</Text>
              )}
              {item.calorias != null && (
                <Text style={[styles.itemNutricion, { color: theme.textSecondary }]}>
                  🔥 {item.calorias} kcal | P: {item.proteinas ?? '-'}g | HC: {item.hidratos ?? '-'}g | G: {item.grasas ?? '-'}g
                </Text>
              )}
              {mp && (
                <Text style={[styles.itemPrecio, { color: theme.primary }]}>
                  🛒 {mp.supermercado.charAt(0).toUpperCase() + mp.supermercado.slice(1)} {mp.precio.toFixed(2)} €/{mp.unidad}
                </Text>
              )}
            </View>
            <Text style={[styles.chevron, { color: theme.textLight }]}>{isExpanded ? '▲' : '▼'}</Text>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={[styles.expandido, {
            backgroundColor: theme.card,
            borderTopColor: theme.borderLight,
          }]}>
            {/* Nutrición */}
            {(item.calorias != null || item.proteinas != null) && (
              <View style={styles.seccion}>
                <Text style={[styles.seccionTitulo, { color: theme.text }]}>📊 Valor nutricional (por 100g)</Text>
                <FilaNutriente label="Calorías" valor={item.calorias} unidad="kcal" color={theme.primary} />
                <FilaNutriente label="Proteínas" valor={item.proteinas} unidad="g" color={theme.success} />
                <FilaNutriente label="Hidratos" valor={item.hidratos} unidad="g" color={theme.accent} />
                <FilaNutriente label="Grasas" valor={item.grasas} unidad="g" color={theme.warning} />
                <FilaNutriente label="Fibra" valor={item.fibra} unidad="g" color="#9C27B0" />
              </View>
            )}

            {/* Precios principales: Lidl y Mercadona */}
            {(() => {
              const pp = preciosPrincipales(item);
              const ps = preciosSecundarios(item);
              if (pp.length === 0 && ps.length === 0) return null;
              const orden = ['mercadona', 'lidl'];
              pp.sort((a, b) => orden.indexOf(a.supermercado) - orden.indexOf(b.supermercado));
              return (
                <View style={styles.seccion}>
                  <Text style={[styles.seccionTitulo, { color: theme.text }]}>🛒 Precios</Text>
                  {pp.map((p, i) => (
                    <View key={i} style={[styles.precioRow, { borderBottomColor: theme.borderLight }]}>
                      <Text style={[styles.precioNombre, { color: theme.text }]}>
                        {p.supermercado === 'mercadona' ? '🏪 Mercadona' : '🔵 Lidl'}
                      </Text>
                      <Text style={[styles.precioValor, { color: theme.primary }]}>
                        {p.precio.toFixed(2)} €/{p.unidad}
                      </Text>
                    </View>
                  ))}
                  {ps.length > 0 && (
                    <View>
                      <Text style={[styles.precioOtros, { color: theme.textLight }]}>
                        + {ps.length} supermercado{ps.length > 1 ? 's' : ''} más
                      </Text>
                      {ps.sort((a, b) => a.precio - b.precio).map((p, i) => (
                        <View key={`s${i}`} style={styles.precioRowSec}>
                          <Text style={[styles.precioNombreSec, { color: theme.textSecondary }]}>
                            {p.supermercado.charAt(0).toUpperCase() + p.supermercado.slice(1)}
                          </Text>
                          <Text style={[styles.precioValorSec, { color: theme.textSecondary }]}>
                            {p.precio.toFixed(2)} €/{p.unidad}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })()}
            {/* Botones editar/eliminar */}
            <View style={styles.botonesRow}>
              <TouchableOpacity style={[styles.btnEditar, { backgroundColor: theme.accentLight, borderColor: theme.accent }]} onPress={() => abrirEditar(item)}>
                <Text style={[styles.btnEditarTexto, { color: theme.accent }]}>✏️ Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnEliminar, { backgroundColor: theme.dangerLight || '#fff0f0', borderColor: theme.danger }]} onPress={() => eliminarIngrediente(item.id)}>
                <Text style={[styles.btnEliminarTexto, { color: theme.danger }]}>🗑 Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TextInput
        style={[styles.buscador, {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          color: theme.text,
        }]}
        placeholder="Buscar ingrediente..."
        placeholderTextColor={theme.textLight}
        value={buscar}
        onChangeText={setBuscar}
      />

      {cargando ? (
        <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={ingredientes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={[styles.emptyTexto, { color: theme.textLight }]}>🧂 No hay ingredientes</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={() => { resetForm(); setMostrarNuevo(true); }}
      >
        <Text style={[styles.fabTexto, { color: theme.textWhite }]}>+</Text>
      </TouchableOpacity>

      {/* Modal nuevo ingrediente */}
      <Modal visible={mostrarNuevo} animationType="slide" transparent>
        <View style={[styles.modalOverlay]}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitulo, { color: theme.text }]}>+ Nuevo ingrediente</Text>

              <Text style={[styles.label, { color: theme.text }]}>🇪🇸 Nombre *</Text>
              <View>
                <TextInput
                  ref={fNombreRef}
                  style={[styles.input, {
                    backgroundColor: theme.inputBg,
                    borderColor: theme.border,
                    color: theme.text,
                  }]}
                  value={fNombre}
                  onChangeText={handleNombreChange}
                  placeholder="Tomate"
                  placeholderTextColor={theme.textLight}
                  onFocus={() => {
                    if (fNombre.trim().length >= 2 && sugerencias.length > 0) {
                      setMostrarSugerencias(true);
                    }
                  }}
                />
                {/* Dropdown de sugerencias */}
                {mostrarSugerencias && sugerencias.length > 0 && (
                  <View style={[styles.sugerenciasContainer, {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  }]}>
                    <FlatList
                      data={sugerencias}
                      keyExtractor={(item) => item.id}
                      renderItem={renderSugerencia}
                      keyboardShouldPersistTaps="handled"
                      scrollEnabled={false}
                    />
                    <TouchableOpacity
                      style={[styles.sugerenciasCerrar, {
                        borderTopColor: theme.borderLight,
                      }]}
                      onPress={() => setMostrarSugerencias(false)}
                    >
                      <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                        ✕ Cerrar sugerencias
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <Text style={[styles.label, { color: theme.text }]}>🇬🇧 Nombre (EN)</Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.border,
                  color: theme.text,
                }]}
                value={fNombreEn}
                onChangeText={setFNombreEn}
                placeholder="Tomato"
                placeholderTextColor={theme.textLight}
              />

              <Text style={[styles.label, { color: theme.text }]}>Tipo</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tiposRow}>
                {tipos.map(tipo => (
                  <TouchableOpacity
                    key={tipo.id}
                    style={[styles.tipoChip, {
                      backgroundColor: fTipoId === tipo.id ? theme.chipActiveBg : theme.chipBg,
                    }]}
                    onPress={() => setFTipoId(fTipoId === tipo.id ? '' : tipo.id)}
                  >
                    <Text style={{ color: fTipoId === tipo.id ? theme.textWhite : theme.text }}>
                      {tipo.icono} {getNombre(tipo.nombre)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={[styles.label, { color: theme.text }]}>Unidad base</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tiposRow}>
                {['g', 'kg', 'ml', 'l', 'ud', 'taza', 'cucharada', 'pizca'].map(u => (
                  <TouchableOpacity
                    key={u}
                    style={[styles.tipoChip, {
                      backgroundColor: fUnidad === u ? theme.chipActiveBg : theme.chipBg,
                    }]}
                    onPress={() => setFUnidad(u)}
                  >
                    <Text style={{ color: fUnidad === u ? theme.textWhite : theme.text }}>{u}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={[styles.label, { color: theme.text }]}>📊 Valor nutricional (por 100g)</Text>
              <View style={styles.row2}>
                <View style={styles.half}>
                  <Text style={[styles.sublabel, { color: theme.textSecondary }]}>Kcal</Text>
                  <TextInput
                    style={[styles.input, {
                      backgroundColor: theme.inputBg,
                      borderColor: theme.border,
                      color: theme.text,
                    }]}
                    value={fCalorias}
                    onChangeText={setFCalorias}
                    placeholder="18"
                    placeholderTextColor={theme.textLight}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.half}>
                  <Text style={[styles.sublabel, { color: theme.textSecondary }]}>Proteínas (g)</Text>
                  <TextInput
                    style={[styles.input, {
                      backgroundColor: theme.inputBg,
                      borderColor: theme.border,
                      color: theme.text,
                    }]}
                    value={fProteinas}
                    onChangeText={setFProteinas}
                    placeholder="0.9"
                    placeholderTextColor={theme.textLight}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <View style={styles.row2}>
                <View style={styles.half}>
                  <Text style={[styles.sublabel, { color: theme.textSecondary }]}>Hidratos (g)</Text>
                  <TextInput
                    style={[styles.input, {
                      backgroundColor: theme.inputBg,
                      borderColor: theme.border,
                      color: theme.text,
                    }]}
                    value={fHidratos}
                    onChangeText={setFHidratos}
                    placeholder="3.9"
                    placeholderTextColor={theme.textLight}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.half}>
                  <Text style={[styles.sublabel, { color: theme.textSecondary }]}>Grasas</Text>
                  <TextInput
                    style={[styles.input, {
                      backgroundColor: theme.inputBg,
                      borderColor: theme.border,
                      color: theme.text,
                    }]}
                    value={fGrasas}
                    onChangeText={setFGrasas}
                    placeholder="0.2"
                    placeholderTextColor={theme.textLight}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <Text style={[styles.sublabel, { color: theme.textSecondary }]}>Fibra (g)</Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.border,
                  color: theme.text,
                }]}
                value={fFibra}
                onChangeText={setFFibra}
                placeholder="1.2"
                placeholderTextColor={theme.textLight}
                keyboardType="numeric"
              />

              <Text style={[styles.label, { color: theme.text }]}>🛒 Precios</Text>
              {fPrecios.map((p, i) => (
                <View key={i} style={[styles.precioForm, { backgroundColor: theme.inputBg }]}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.supermercadosRow}>
                    {SUPERMERCADOS.map(s => (
                      <TouchableOpacity
                        key={s.value}
                        style={[styles.supChip, {
                          backgroundColor: p.supermercado === s.value ? theme.chipActiveBg : theme.chipBg,
                        }]}
                        onPress={() => updatePrecio(i, 'supermercado', s.value)}
                      >
                        <Text style={[styles.supText, {
                          color: p.supermercado === s.value ? theme.textWhite : theme.text,
                        }]}>{s.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <View style={styles.row2}>
                    <TextInput
                      style={[styles.input, {
                        flex: 1,
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                        color: theme.text,
                      }]}
                      value={p.precio}
                      onChangeText={v => updatePrecio(i, 'precio', v)}
                      placeholder="2.19"
                      placeholderTextColor={theme.textLight}
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={[styles.input, {
                        width: 60,
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                        color: theme.text,
                      }]}
                      value={p.unidad}
                      onChangeText={v => updatePrecio(i, 'unidad', v)}
                      placeholder="kg"
                      placeholderTextColor={theme.textLight}
                    />
                    <TouchableOpacity onPress={() => removePrecio(i)} style={styles.btnRemove}>
                      <Text style={{ color: theme.danger }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <TouchableOpacity
                style={[styles.btnAddPrecio, { borderColor: theme.primary }]}
                onPress={addPrecio}
              >
                <Text style={[styles.btnAddPrecioTexto, { color: theme.primary }]}>+ Añadir precio</Text>
              </TouchableOpacity>

              <View style={styles.modalBotones}>
                <TouchableOpacity
                  style={[styles.btnCancelar, { borderColor: theme.border }]}
                  onPress={() => { setMostrarNuevo(false); resetForm(); }}
                >
                  <Text style={{ color: theme.text }}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btnGuardar, { backgroundColor: theme.primary }]}
                  onPress={crearIngrediente}
                  disabled={guardando}
                >
                  {guardando ? (
                    <ActivityIndicator color={theme.textWhite} size="small" />
                  ) : (
                    <Text style={[styles.btnGuardarTexto, { color: theme.textWhite }]}>Guardar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal editar ingrediente - reutiliza el mismo formulario */}
      <Modal visible={mostrarEditar} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitulo, { color: theme.text }]}>✏️ Editar ingrediente</Text>

              <Text style={[styles.label, { color: theme.text }]}>🇪🇸 Nombre *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
                value={fNombre}
                onChangeText={setFNombre}
                placeholder="Tomate"
                placeholderTextColor={theme.textLight}
              />

              <Text style={[styles.label, { color: theme.text }]}>🇬🇧 Nombre (EN)</Text>
              <TextInput style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]} value={fNombreEn} onChangeText={setFNombreEn} placeholder="Tomato" placeholderTextColor={theme.textLight} />

              <Text style={[styles.label, { color: theme.text }]}>Tipo</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tiposRow}>
                {tipos.map(tipo => (
                  <TouchableOpacity key={tipo.id} style={[styles.tipoChip, { backgroundColor: fTipoId === tipo.id ? theme.chipActiveBg : theme.chipBg }]} onPress={() => setFTipoId(fTipoId === tipo.id ? '' : tipo.id)}>
                    <Text style={{ color: fTipoId === tipo.id ? theme.textWhite : theme.text }}>{tipo.icono} {getNombre(tipo.nombre)}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={[styles.label, { color: theme.text }]}>Unidad base</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tiposRow}>
                {['g', 'kg', 'ml', 'l', 'ud', 'taza', 'cucharada', 'pizca'].map(u => (
                  <TouchableOpacity key={u} style={[styles.tipoChip, { backgroundColor: fUnidad === u ? theme.chipActiveBg : theme.chipBg }]} onPress={() => setFUnidad(u)}>
                    <Text style={{ color: fUnidad === u ? theme.textWhite : theme.text }}>{u}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={[styles.label, { color: theme.text }]}>📊 Valor nutricional (por 100g)</Text>
              <View style={styles.row2}>
                <View style={styles.half}>
                  <Text style={[styles.sublabel, { color: theme.textSecondary }]}>Kcal</Text>
                  <TextInput style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]} value={fCalorias} onChangeText={setFCalorias} keyboardType="numeric" placeholder="18" placeholderTextColor={theme.textLight} />
                </View>
                <View style={styles.half}>
                  <Text style={[styles.sublabel, { color: theme.textSecondary }]}>Proteínas (g)</Text>
                  <TextInput style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]} value={fProteinas} onChangeText={setFProteinas} keyboardType="numeric" placeholder="0.9" placeholderTextColor={theme.textLight} />
                </View>
              </View>
              <View style={styles.row2}>
                <View style={styles.half}>
                  <Text style={[styles.sublabel, { color: theme.textSecondary }]}>Hidratos (g)</Text>
                  <TextInput style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]} value={fHidratos} onChangeText={setFHidratos} keyboardType="numeric" placeholder="3.9" placeholderTextColor={theme.textLight} />
                </View>
                <View style={styles.half}>
                  <Text style={[styles.sublabel, { color: theme.textSecondary }]}>Grasas</Text>
                  <TextInput style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]} value={fGrasas} onChangeText={setFGrasas} keyboardType="numeric" placeholder="0.2" placeholderTextColor={theme.textLight} />
                </View>
              </View>
              <Text style={[styles.sublabel, { color: theme.textSecondary }]}>Fibra (g)</Text>
              <TextInput style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]} value={fFibra} onChangeText={setFFibra} keyboardType="numeric" placeholder="1.2" placeholderTextColor={theme.textLight} />

              <Text style={[styles.label, { color: theme.text }]}>🛒 Precios</Text>
              {fPrecios.map((p, i) => (
                <View key={i} style={[styles.precioForm, { backgroundColor: theme.inputBg }]}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.supermercadosRow}>
                    {SUPERMERCADOS.map(s => (
                      <TouchableOpacity key={s.value} style={[styles.supChip, { backgroundColor: p.supermercado === s.value ? theme.chipActiveBg : theme.chipBg }]} onPress={() => updatePrecio(i, 'supermercado', s.value)}>
                        <Text style={[styles.supText, { color: p.supermercado === s.value ? theme.textWhite : theme.text }]}>{s.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <View style={styles.row2}>
                    <TextInput style={[styles.input, { flex: 1, backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]} value={p.precio} onChangeText={v => updatePrecio(i, 'precio', v)} placeholder="2.19" placeholderTextColor={theme.textLight} keyboardType="numeric" />
                    <TextInput style={[styles.input, { width: 60, backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]} value={p.unidad} onChangeText={v => updatePrecio(i, 'unidad', v)} placeholder="kg" placeholderTextColor={theme.textLight} />
                    <TouchableOpacity onPress={() => removePrecio(i)} style={styles.btnRemove}>
                      <Text style={{ color: theme.danger }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <TouchableOpacity style={[styles.btnAddPrecio, { borderColor: theme.primary }]} onPress={addPrecio}>
                <Text style={[styles.btnAddPrecioTexto, { color: theme.primary }]}>+ Añadir precio</Text>
              </TouchableOpacity>

              <View style={styles.modalBotones}>
                <TouchableOpacity style={[styles.btnCancelar, { borderColor: theme.border }]} onPress={() => { setMostrarEditar(false); setEditandoId(null); resetForm(); }}>
                  <Text style={{ color: theme.text }}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnGuardar, { backgroundColor: theme.primary }]} onPress={guardarEdicion} disabled={guardando}>
                  {guardando ? <ActivityIndicator color={theme.textWhite} size="small" /> : <Text style={[styles.btnGuardarTexto, { color: theme.textWhite }]}>Guardar</Text>}
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
  const { theme } = useTheme();
  return (
    <View style={styles.filaNut}>
      <Text style={[styles.filaLabel, { color: theme.textSecondary }]}>{label}</Text>
      <View style={[styles.barraContainer, { backgroundColor: theme.borderLight }]}>
        <View style={[styles.barra, { width: `${Math.max(ancho, 2)}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.filaValor, { color: theme.text }]}>{valor != null ? valor : '-'}{unidad}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  buscador: { margin: 12, padding: 12, borderRadius: 10, fontSize: 16, borderWidth: 1 },
  loader: { flex: 1 },
  lista: { paddingHorizontal: 12 },
  item: { borderRadius: 12, padding: 14, marginBottom: 6 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemInfo: { flex: 1 },
  itemNombre: { fontSize: 16, fontWeight: '600' },
  itemTipo: { fontSize: 12, marginTop: 2 },
  itemNutricion: { fontSize: 12, marginTop: 3 },
  itemPrecio: { fontSize: 13, marginTop: 2, fontWeight: '500' },
  chevron: { fontSize: 14, marginLeft: 8 },
  expandido: { borderBottomLeftRadius: 12, borderBottomRightRadius: 12, padding: 14, marginTop: -6, marginBottom: 6, borderTopWidth: 1 },
  seccion: { marginBottom: 14 },
  seccionTitulo: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  filaNut: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  filaLabel: { width: 70, fontSize: 13 },
  barraContainer: { flex: 1, height: 8, borderRadius: 4, marginHorizontal: 8 },
  barra: { height: 8, borderRadius: 4 },
  filaValor: { width: 60, textAlign: 'right', fontSize: 13, fontWeight: '500' },
  precioRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1 },
  precioNombre: { fontSize: 14, textTransform: 'capitalize' },
  precioValor: { fontSize: 14, fontWeight: '500' },
  precioMejor: { fontWeight: 'bold' },
  precioOtros: { fontSize: 12, marginTop: 8, marginBottom: 4, fontStyle: 'italic' },
  precioRowSec: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, paddingLeft: 12 },
  precioNombreSec: { fontSize: 13, textTransform: 'capitalize' },
  precioValorSec: { fontSize: 13 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  emptyTexto: { fontSize: 16 },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 6 },
  fabTexto: { fontSize: 28, lineHeight: 30 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 4, marginTop: 10 },
  sublabel: { fontSize: 12, marginBottom: 2 },
  input: { borderWidth: 1, borderRadius: 10, padding: 10, fontSize: 15, marginBottom: 6 },
  tiposRow: { marginBottom: 8 },
  tipoChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, marginRight: 6 },
  row2: { flexDirection: 'row', gap: 8 },
  half: { flex: 1 },
  supChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 4 },
  supText: { fontSize: 11 },
  supermercadosRow: { marginBottom: 6 },
  precioForm: { borderRadius: 8, padding: 8, marginBottom: 8 },
  btnRemove: { padding: 8, justifyContent: 'center' },
  btnAddPrecio: { borderWidth: 1, borderStyle: 'dashed', borderRadius: 8, padding: 10, alignItems: 'center', marginBottom: 16 },
  btnAddPrecioTexto: { fontWeight: '600' },
  modalBotones: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btnCancelar: { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  btnGuardar: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center' },
  btnGuardarTexto: { fontWeight: 'bold', fontSize: 16 },
  // Autocomplete styles
  sugerenciasContainer: {
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 6,
    maxHeight: 220,
    zIndex: 100,
    elevation: 5,
  },
  sugerenciaItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  sugerenciaNombre: {
    fontSize: 15,
    fontWeight: '600',
  },
  sugerenciaDetalle: {
    fontSize: 12,
    marginTop: 2,
  },
  sugerenciaPrecio: {
    fontSize: 12,
    marginTop: 1,
    fontWeight: '500',
  },
  sugerenciasCerrar: { paddingVertical: 8, alignItems: 'center', borderTopWidth: 1 },
  botonesRow: { flexDirection: 'row', gap: 8, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#eee' },
  btnEditar: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1 },
  btnEditarTexto: { fontSize: 13, fontWeight: '600' },
  btnEliminar: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1 },
  btnEliminarTexto: { fontSize: 13, fontWeight: '600' },
});

import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, FlatList, Alert,
} from 'react-native';
import { useI18n } from '../i18n';
import { useFocusEffect } from '@react-navigation/native';
import * as api from '../services/api';
import { Categoria, Ingrediente } from '../types';

export default function NuevaRecetaScreen({ navigation, route }: any) {
  const { t, lang } = useI18n();
  const [nombre, setNombre] = useState('');
  const [nombreEn, setNombreEn] = useState('');
  const [instrucciones, setInstrucciones] = useState('');
  const [instruccionesEn, setInstruccionesEn] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [tiempoMin, setTiempoMin] = useState('');
  const [porciones, setPorciones] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [ingredientes, setIngredientes] = useState<any[]>([]);
  const [listaIngredientes, setListaIngredientes] = useState<Ingrediente[]>([]);
  const [mostrarIngredientes, setMostrarIngredientes] = useState(false);
  const [mostrarNuevoIng, setMostrarNuevoIng] = useState(false);
  const [buscarIng, setBuscarIng] = useState('');
  const [nuevoIngNombre, setNuevoIngNombre] = useState('');
  const [nuevoIngNombreEn, setNuevoIngNombreEn] = useState('');
  const [nuevoIngUnidad, setNuevoIngUnidad] = useState('g');
  const [cargando, setCargando] = useState(false);
  const [seleccionado, setSeleccionado] = useState<Ingrediente | null>(null);
  const [cantidad, setCantidad] = useState('');
  const [unidad, setUnidad] = useState('g');

  // Resetear campos y cargar datos al entrar a la pantalla
  useFocusEffect(
    useCallback(() => {
      setNombre('');
      setNombreEn('');
      setInstrucciones('');
      setInstruccionesEn('');
      setCategoriaId('');
      setTiempoMin('');
      setPorciones('');
      setIngredientes([]);
      setMostrarIngredientes(false);
      setMostrarNuevoIng(false);
      setBuscarIng('');
      setNuevoIngNombre('');
      setNuevoIngNombreEn('');
      setNuevoIngUnidad('g');
      setCargando(false);
      setSeleccionado(null);
      setCantidad('');
      setUnidad('g');

      // Cargar categorías e ingredientes
      (async () => {
        try {
          const [cats, ings] = await Promise.all([api.getCategorias(), api.getIngredientes()]);
          setCategorias(cats);
          setListaIngredientes(ings);
        } catch (err) {
          console.error('Error cargando datos:', err);
        }
      })();
    }, [])
  );

  function getNombre(obj: { es: string; en: string }) {
    return obj[lang] || obj.es;
  }

  function abrirSelectorIngrediente() {
    setBuscarIng('');
    setMostrarIngredientes(true);
  }

  function seleccionarIngrediente(ing: Ingrediente) {
    setSeleccionado(ing);
    setUnidad(ing.unidadBase);
    setMostrarIngredientes(false);
  }

  function confirmarIngrediente() {
    if (!seleccionado || !cantidad) return;
    setIngredientes([...ingredientes, {
      ingredienteId: seleccionado.id,
      cantidad: parseFloat(cantidad),
      unidad,
      nombre: seleccionado.nombre,
    }]);
    setSeleccionado(null);
    setCantidad('');
    setUnidad('g');
  }

  function eliminarIngrediente(index: number) {
    setIngredientes(ingredientes.filter((_, i) => i !== index));
  }

  async function crearIngrediente() {
    if (!nuevoIngNombre.trim()) return;
    try {
      const nuevo = await api.crearIngrediente({
        nombre: { es: nuevoIngNombre, en: nuevoIngNombreEn || nuevoIngNombre },
        unidadBase: nuevoIngUnidad,
      });
      setListaIngredientes([...listaIngredientes, nuevo]);
      setSeleccionado(nuevo);
      setUnidad(nuevoIngUnidad);
      setMostrarNuevoIng(false);
      setNuevoIngNombre('');
      setNuevoIngNombreEn('');
    } catch (err: any) {
      Alert.alert(t.common.error, err.response?.data?.error || 'Error');
    }
  }

  async function guardarReceta() {
    if (!nombre.trim() || !instrucciones.trim() || !categoriaId || ingredientes.length === 0) {
      Alert.alert(t.common.error, 'Completa todos los campos obligatorios');
      return;
    }
    setCargando(true);
    try {
      console.log('📤 Enviando receta:', { nombre, instrucciones, categoriaId, tiempoMin, porciones, ingredientes });
      const resultado = await api.crearReceta({
        nombre: { es: nombre, en: nombreEn || nombre },
        instrucciones: { es: instrucciones, en: instruccionesEn || instrucciones },
        categoriaId,
        tiempoMin: tiempoMin ? parseInt(tiempoMin) : undefined,
        porciones: porciones ? parseInt(porciones) : undefined,
        ingredientes: ingredientes.map((ing) => ({
          ingredienteId: ing.ingredienteId,
          cantidad: ing.cantidad,
          unidad: ing.unidad,
        })),
      });
      console.log('✅ Receta creada:', resultado);
      navigation.goBack();
    } catch (err: any) {
      console.error('❌ Error guardando receta:', err);
      console.error('❌ Response:', err.response?.data);
      Alert.alert(t.common.error, err.response?.data?.error || err.message || 'Error al guardar');
    } finally {
      setCargando(false);
    }
  }

  const unidades = [
    { value: 'g', label: t.ingredientes.g },
    { value: 'kg', label: t.ingredientes.kg },
    { value: 'ml', label: t.ingredientes.ml },
    { value: 'l', label: t.ingredientes.l },
    { value: 'ud', label: t.ingredientes.ud },
    { value: 'taza', label: t.ingredientes.taza },
    { value: 'cucharada', label: t.ingredientes.cucharada },
    { value: 'cucharadita', label: t.ingredientes.cucharadita },
    { value: 'pizca', label: t.ingredientes.pizca },
  ];

  const filtrados = buscarIng
    ? listaIngredientes.filter((ing) =>
        getNombre(ing.nombre).toLowerCase().includes(buscarIng.toLowerCase())
      )
    : listaIngredientes;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Nombre */}
        <Text style={styles.label}>🇪🇸 {t.nueva_receta.nombre} *</Text>
        <TextInput style={styles.input} placeholder={t.nueva_receta.nombre_placeholder} value={nombre} onChangeText={setNombre} />

        <Text style={styles.label}>🇬🇧 {t.nueva_receta.nombre} (EN)</Text>
        <TextInput style={styles.input} placeholder="E.g.: Paella" value={nombreEn} onChangeText={setNombreEn} />

        {/* Categoría */}
        <Text style={styles.label}>{t.receta.categoria} *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriasScroll}>
          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catBtn, categoriaId === cat.id && styles.catBtnActiva]}
              onPress={() => setCategoriaId(cat.id)}
            >
              <Text style={styles.catBtnTexto}>{cat.icono} {getNombre(cat.nombre)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tiempo y porciones */}
        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>{t.receta.tiempo} (min)</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={tiempoMin} onChangeText={setTiempoMin} placeholder="30" />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>{t.receta.porciones}</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={porciones} onChangeText={setPorciones} placeholder="4" />
          </View>
        </View>

        {/* Ingredientes */}
        <Text style={styles.label}>{t.receta.ingredientes} *</Text>
        {ingredientes.map((ing, i) => (
          <View key={i} style={styles.ingItem}>
            <Text style={styles.ingTexto}>{ing.cantidad} {ing.unidad} — {getNombre(ing.nombre)}</Text>
            <TouchableOpacity onPress={() => eliminarIngrediente(i)}>
              <Text style={styles.eliminar}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Selector de ingrediente */}
        {seleccionado ? (
          <View style={styles.selectorIng}>
            <Text style={styles.seleccionadoNombre}>📦 {getNombre(seleccionado.nombre)}</Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder={t.nueva_receta.cantidad}
                value={cantidad}
                onChangeText={setCantidad}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.unidadBtn} onPress={() => {
                const idx = unidades.findIndex((u) => u.value === unidad);
                setUnidad(unidades[(idx + 1) % unidades.length].value);
              }}>
                <Text>{unidad}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <TouchableOpacity style={styles.btnSec} onPress={() => setSeleccionado(null)}>
                <Text>{t.common.cancelar}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrim} onPress={confirmarIngrediente}>
                <Text style={styles.btnPrimTexto}>{t.common.aceptar}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.btnAnadir} onPress={abrirSelectorIngrediente}>
            <Text style={styles.btnAnadirTexto}>+ {t.nueva_receta.anadir_ingrediente}</Text>
          </TouchableOpacity>
        )}

        {/* Instrucciones */}
        <Text style={styles.label}>🇪🇸 {t.receta.instrucciones} *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={6}
          placeholder={t.nueva_receta.instrucciones_placeholder}
          value={instrucciones}
          onChangeText={setInstrucciones}
        />

        <Text style={styles.label}>🇬🇧 {t.receta.instrucciones} (EN)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={6}
          placeholder="Write the preparation steps..."
          value={instruccionesEn}
          onChangeText={setInstruccionesEn}
        />

        {/* Botón guardar */}
        <TouchableOpacity style={styles.btnGuardar} onPress={guardarReceta} disabled={cargando}>
          {cargando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnGuardarTexto}>💾 {t.common.guardar}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Modal seleccionar ingrediente */}
      <Modal visible={mostrarIngredientes} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>{t.nueva_receta.seleccionar_ingrediente}</Text>
            <TextInput
              style={styles.input}
              placeholder={t.ingredientes.buscar_ingrediente}
              value={buscarIng}
              onChangeText={setBuscarIng}
            />
            <FlatList
              data={filtrados}
              keyExtractor={(item) => item.id}
              style={styles.listaIng}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.ingListaItem} onPress={() => seleccionarIngrediente(item)}>
                  <Text style={styles.ingListaNombre}>{getNombre(item.nombre)}</Text>
                  <Text style={styles.ingListaUnidad}>({item.unidadBase})</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.btnNuevoIng} onPress={() => { setMostrarNuevoIng(true); }}>
              <Text style={styles.btnNuevoIngTexto}>+ {t.ingredientes.nuevo}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCerrarModal} onPress={() => setMostrarIngredientes(false)}>
              <Text>{t.common.cancelar}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal nuevo ingrediente */}
      <Modal visible={mostrarNuevoIng} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>{t.nueva_receta.nuevo_ingrediente}</Text>
            <Text style={styles.label}>🇪🇸 {t.ingredientes.nombre}</Text>
            <TextInput style={styles.input} value={nuevoIngNombre} onChangeText={setNuevoIngNombre} placeholder="Tomate" />
            <Text style={styles.label}>🇬🇧 {t.ingredientes.nombre}</Text>
            <TextInput style={styles.input} value={nuevoIngNombreEn} onChangeText={setNuevoIngNombreEn} placeholder="Tomato" />
            <Text style={styles.label}>{t.ingredientes.unidad_base}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.unidadesScroll}>
              {unidades.map((u) => (
                <TouchableOpacity
                  key={u.value}
                  style={[styles.unidadChip, nuevoIngUnidad === u.value && styles.unidadActiva]}
                  onPress={() => setNuevoIngUnidad(u.value)}
                >
                  <Text>{u.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.row}>
              <TouchableOpacity style={styles.btnSec} onPress={() => { setMostrarNuevoIng(false); }}>
                <Text>{t.common.cancelar}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrim} onPress={crearIngrediente}>
                <Text style={styles.btnPrimTexto}>{t.common.guardar}</Text>
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
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 8 },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  categoriasScroll: { marginBottom: 8 },
  catBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', marginRight: 8, borderWidth: 1, borderColor: '#ddd' },
  catBtnActiva: { backgroundColor: '#FF6B35', borderColor: '#FF6B35' },
  catBtnTexto: { color: '#333', fontSize: 13 },
  ingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 6, borderLeftWidth: 3, borderLeftColor: '#FF6B35' },
  ingTexto: { fontSize: 15, color: '#333', flex: 1 },
  eliminar: { color: '#e74c3c', fontSize: 18, paddingHorizontal: 8 },
  btnAnadir: { borderWidth: 2, borderColor: '#FF6B35', borderStyle: 'dashed', borderRadius: 10, padding: 14, alignItems: 'center', marginBottom: 12 },
  btnAnadirTexto: { color: '#FF6B35', fontSize: 16, fontWeight: '600' },
  selectorIng: { backgroundColor: '#fff3ee', borderRadius: 10, padding: 12, marginBottom: 12 },
  seleccionadoNombre: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  unidadBtn: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center', marginLeft: 8 },
  btnSec: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', alignItems: 'center', marginRight: 6 },
  btnPrim: { flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#FF6B35', alignItems: 'center', marginLeft: 6 },
  btnPrimTexto: { color: '#fff', fontWeight: '600' },
  btnGuardar: { backgroundColor: '#FF6B35', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 20 },
  btnGuardarTexto: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  listaIng: { maxHeight: 300, marginBottom: 12 },
  ingListaItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  ingListaNombre: { fontSize: 16 },
  ingListaUnidad: { fontSize: 14, color: '#999' },
  btnNuevoIng: { borderWidth: 2, borderColor: '#FF6B35', borderStyle: 'dashed', borderRadius: 10, padding: 12, alignItems: 'center', marginBottom: 8 },
  btnNuevoIngTexto: { color: '#FF6B35', fontWeight: '600' },
  btnCerrarModal: { padding: 12, alignItems: 'center' },
  unidadesScroll: { marginBottom: 12 },
  unidadChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, backgroundColor: '#f0f0f0', marginRight: 6 },
  unidadActiva: { backgroundColor: '#FF6B35' },
});

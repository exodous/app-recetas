import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, FlatList, Alert,
} from 'react-native';
import { useI18n } from '../i18n';
import { useFocusEffect } from '@react-navigation/native';
import * as api from '../services/api';
import { Categoria, Ingrediente } from '../types';

const SUPERMERCADOS = ['mercadona', 'lidl', 'carrefour', 'dia', 'aldi', 'eci', 'hiperdino', 'bonpreu', 'condis', 'eroski', 'bm', 'alcampo'];

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
  const [cargando, setCargando] = useState(false);
  const [seleccionado, setSeleccionado] = useState<Ingrediente | null>(null);
  const [cantidad, setCantidad] = useState('');
  const [unidad, setUnidad] = useState('g');
  const [fComidaTipo, setFComidaTipo] = useState<'almuerzo' | 'cena' | 'ambos'>('ambos');

  // Modal nuevo ingrediente - campos
  const [nuevoIngNombre, setNuevoIngNombre] = useState('');
  const [nuevoIngNombreEn, setNuevoIngNombreEn] = useState('');
  const [nuevoIngUnidad, setNuevoIngUnidad] = useState('g');
  const [tiposIng, setTiposIng] = useState<any[]>([]);
  const [nuevoIngTipoId, setNuevoIngTipoId] = useState('');
  const [nuevoIngCalorias, setNuevoIngCalorias] = useState('');
  const [nuevoIngProteinas, setNuevoIngProteinas] = useState('');
  const [nuevoIngHidratos, setNuevoIngHidratos] = useState('');
  const [nuevoIngGrasas, setNuevoIngGrasas] = useState('');
  const [nuevoIngFibra, setNuevoIngFibra] = useState('');
  const [nuevoIngPrecios, setNuevoIngPrecios] = useState<any[]>([]);
  const [mostrarDatosExtra, setMostrarDatosExtra] = useState(false);

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
      setCargando(false);
      setSeleccionado(null);
      setCantidad('');
      setUnidad('g');
      setFComidaTipo('ambos');
      resetNuevoIng();

      // Cargar categorías, ingredientes y tipos
      (async () => {
        try {
          const [cats, ings, tipos] = await Promise.all([
            api.getCategorias(),
            api.getIngredientes(),
            api.getTiposIngrediente(),
          ]);
          setCategorias(cats);
          setListaIngredientes(ings);
          setTiposIng(tipos);
        } catch (err) {
          console.error('Error cargando datos:', err);
        }
      })();
    }, [])
  );

  function resetNuevoIng() {
    setNuevoIngNombre('');
    setNuevoIngNombreEn('');
    setNuevoIngUnidad('g');
    setNuevoIngTipoId('');
    setNuevoIngCalorias('');
    setNuevoIngProteinas('');
    setNuevoIngHidratos('');
    setNuevoIngGrasas('');
    setNuevoIngFibra('');
    setNuevoIngPrecios([]);
    setMostrarDatosExtra(false);
  }

  function getNombre(obj: { es: string; en: string }) {
    return obj?.[lang] || obj?.es || '';
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

  function abrirModalNuevoIngrediente() {
    resetNuevoIng();
    setMostrarNuevoIng(true);
  }

  function anadirPrecioIng() {
    setNuevoIngPrecios([...nuevoIngPrecios, { supermercado: 'mercadona', precio: '', unidad: nuevoIngUnidad }]);
  }

  function quitarPrecioIng(index: number) {
    setNuevoIngPrecios(nuevoIngPrecios.filter((_, i) => i !== index));
  }

  function actualizarPrecioIng(index: number, campo: string, valor: string) {
    const copia = [...nuevoIngPrecios];
    copia[index] = { ...copia[index], [campo]: valor };
    setNuevoIngPrecios(copia);
  }

  async function crearIngrediente() {
    if (!nuevoIngNombre.trim()) return;
    try {
      const preciosLimpios = nuevoIngPrecios
        .filter((p) => p.supermercado && p.precio)
        .map((p) => ({
          supermercado: p.supermercado,
          precio: parseFloat(p.precio),
          unidad: p.unidad || nuevoIngUnidad,
        }));

      const payload: any = {
        nombre: { es: nuevoIngNombre, en: nuevoIngNombreEn || nuevoIngNombre },
        unidadBase: nuevoIngUnidad,
        ...(nuevoIngTipoId ? { tipoId: nuevoIngTipoId } : {}),
        ...(nuevoIngCalorias !== '' ? { calorias: parseFloat(nuevoIngCalorias) } : {}),
        ...(nuevoIngProteinas !== '' ? { proteinas: parseFloat(nuevoIngProteinas) } : {}),
        ...(nuevoIngHidratos !== '' ? { hidratos: parseFloat(nuevoIngHidratos) } : {}),
        ...(nuevoIngGrasas !== '' ? { grasas: parseFloat(nuevoIngGrasas) } : {}),
        ...(nuevoIngFibra !== '' ? { fibra: parseFloat(nuevoIngFibra) } : {}),
        ...(preciosLimpios.length ? { precios: preciosLimpios } : {}),
      };

      const nuevo = await api.crearIngrediente(payload);
      setListaIngredientes([...listaIngredientes, nuevo]);
      setSeleccionado(nuevo);
      setUnidad(nuevoIngUnidad);
      setMostrarNuevoIng(false);
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
      const resultado = await api.crearReceta({
        nombre: { es: nombre, en: nombreEn || nombre },
        instrucciones: { es: instrucciones, en: instruccionesEn || instrucciones },
        categoriaId,
        tiempoMin: tiempoMin ? parseInt(tiempoMin) : undefined,
        porciones: porciones ? parseInt(porciones) : undefined,
        comidaTipo: fComidaTipo === 'ambos' ? ['almuerzo', 'cena'] : [fComidaTipo],
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
              <Text style={[styles.catBtnTexto, categoriaId === cat.id && styles.catBtnTextoActiva]}>{cat.icono} {getNombre(cat.nombre)}</Text>
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

        {/* Tipo de comida */}
        <Text style={styles.label}>Tipo de comida</Text>
        <View style={styles.comidaTipoRow}>
          <TouchableOpacity
            style={[
              styles.comidaTipoBtn,
              (fComidaTipo === 'almuerzo' || fComidaTipo === 'ambos') && styles.comidaTipoBtnActiva,
              fComidaTipo === 'ambos' && styles.comidaTipoBtnAmbos,
            ]}
            onPress={() => setFComidaTipo(fComidaTipo === 'cena' ? 'ambos' : fComidaTipo === 'ambos' ? 'cena' : 'almuerzo')}
          >
            <Text style={[styles.comidaTipoBtnTexto, (fComidaTipo === 'almuerzo' || fComidaTipo === 'ambos') && styles.comidaTipoBtnTextoActiva]}>☀️ Almuerzo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.comidaTipoBtn,
              (fComidaTipo === 'cena' || fComidaTipo === 'ambos') && styles.comidaTipoBtnActiva,
              fComidaTipo === 'ambos' && styles.comidaTipoBtnAmbos,
            ]}
            onPress={() => setFComidaTipo(fComidaTipo === 'almuerzo' ? 'ambos' : fComidaTipo === 'ambos' ? 'almuerzo' : 'cena')}
          >
            <Text style={[styles.comidaTipoBtnTexto, (fComidaTipo === 'cena' || fComidaTipo === 'ambos') && styles.comidaTipoBtnTextoActiva]}>🌙 Cena</Text>
          </TouchableOpacity>
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
            <TouchableOpacity style={styles.btnNuevoIng} onPress={() => { setMostrarIngredientes(false); abrirModalNuevoIngrediente(); }}>
              <Text style={styles.btnNuevoIngTexto}>+ {t.ingredientes.nuevo}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCerrarModal} onPress={() => setMostrarIngredientes(false)}>
              <Text>{t.common.cancelar}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal nuevo ingrediente - AMPLIADO */}
      <Modal visible={mostrarNuevoIng} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '90%' }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitulo}>{t.nueva_receta.nuevo_ingrediente}</Text>

              {/* Nombre */}
              <Text style={styles.label}>🇪🇸 {t.ingredientes.nombre} *</Text>
              <TextInput style={styles.input} value={nuevoIngNombre} onChangeText={setNuevoIngNombre} placeholder="Tomate" />
              <Text style={styles.label}>🇬🇧 {t.ingredientes.nombre} (EN)</Text>
              <TextInput style={styles.input} value={nuevoIngNombreEn} onChangeText={setNuevoIngNombreEn} placeholder="Tomato" />

              {/* Unidad base */}
              <Text style={styles.label}>{t.ingredientes.unidad_base}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.unidadesScroll}>
                {unidades.map((u) => (
                  <TouchableOpacity
                    key={u.value}
                    style={[styles.unidadChip, nuevoIngUnidad === u.value && styles.unidadActiva]}
                    onPress={() => setNuevoIngUnidad(u.value)}
                  >
                    <Text style={nuevoIngUnidad === u.value && styles.unidadActivaTexto}>{u.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Tipo de ingrediente */}
              <Text style={styles.label}>{t.ingredientes.tipo} ({t.ingredientes.opcional})</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.unidadesScroll}>
                <TouchableOpacity
                  style={[styles.unidadChip, !nuevoIngTipoId && styles.unidadActiva]}
                  onPress={() => setNuevoIngTipoId('')}
                >
                  <Text style={!nuevoIngTipoId && styles.unidadActivaTexto}>—</Text>
                </TouchableOpacity>
                {tiposIng.map((tipo) => (
                  <TouchableOpacity
                    key={tipo.id}
                    style={[styles.unidadChip, nuevoIngTipoId === tipo.id && styles.unidadActiva]}
                    onPress={() => setNuevoIngTipoId(tipo.id)}
                  >
                    <Text style={nuevoIngTipoId === tipo.id && styles.unidadActivaTexto}>{tipo.icono} {getNombre(tipo.nombre)}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Botón expandir datos extra */}
              <TouchableOpacity
                style={styles.btnExpandir}
                onPress={() => setMostrarDatosExtra(!mostrarDatosExtra)}
              >
                <Text style={styles.btnExpandirTexto}>
                  {mostrarDatosExtra ? '▾' : '▸'} {t.ingredientes.nutricion} & {t.ingredientes.precios} ({t.ingredientes.opcional})
                </Text>
              </TouchableOpacity>

              {/* Sección expandible: Nutrición y Precios */}
              {mostrarDatosExtra && (
                <View style={styles.datosExtra}>
                  {/* Valor nutricional */}
                  <Text style={styles.seccionTitulo}>{t.ingredientes.nutricion}</Text>
                  <View style={styles.nutricionGrid}>
                    <View style={styles.nutricionItem}>
                      <Text style={styles.nutricionLabel}>🔥 {t.ingredientes.calorias}</Text>
                      <TextInput style={styles.nutricionInput} keyboardType="numeric" value={nuevoIngCalorias} onChangeText={setNuevoIngCalorias} placeholder="0" />
                    </View>
                    <View style={styles.nutricionItem}>
                      <Text style={styles.nutricionLabel}>🥩 {t.ingredientes.proteinas}</Text>
                      <TextInput style={styles.nutricionInput} keyboardType="numeric" value={nuevoIngProteinas} onChangeText={setNuevoIngProteinas} placeholder="0" />
                    </View>
                    <View style={styles.nutricionItem}>
                      <Text style={styles.nutricionLabel}>🍞 {t.ingredientes.hidratos}</Text>
                      <TextInput style={styles.nutricionInput} keyboardType="numeric" value={nuevoIngHidratos} onChangeText={setNuevoIngHidratos} placeholder="0" />
                    </View>
                    <View style={styles.nutricionItem}>
                      <Text style={styles.nutricionLabel}>🧈 {t.ingredientes.grasas}</Text>
                      <TextInput style={styles.nutricionInput} keyboardType="numeric" value={nuevoIngGrasas} onChangeText={setNuevoIngGrasas} placeholder="0" />
                    </View>
                    <View style={styles.nutricionItem}>
                      <Text style={styles.nutricionLabel}>🌿 {t.ingredientes.fibra}</Text>
                      <TextInput style={styles.nutricionInput} keyboardType="numeric" value={nuevoIngFibra} onChangeText={setNuevoIngFibra} placeholder="0" />
                    </View>
                  </View>

                  {/* Precios */}
                  <Text style={styles.seccionTitulo}>{t.ingredientes.precios}</Text>
                  {nuevoIngPrecios.map((precio, i) => (
                    <View key={i} style={styles.precioItem}>
                      <View style={styles.row}>
                        <TouchableOpacity
                          style={[styles.input, { flex: 1, marginRight: 6 }]}
                          onPress={() => {
                            const idx = SUPERMERCADOS.indexOf(precio.supermercado);
                            actualizarPrecioIng(i, 'supermercado', SUPERMERCADOS[(idx + 1) % SUPERMERCADOS.length]);
                          }}
                        >
                          <Text>🏪 {precio.supermercado}</Text>
                        </TouchableOpacity>
                        <TextInput
                          style={[styles.input, { flex: 1, marginRight: 6 }]}
                          placeholder={t.ingredientes.precio}
                          keyboardType="numeric"
                          value={precio.precio}
                          onChangeText={(v) => actualizarPrecioIng(i, 'precio', v)}
                        />
                        <TouchableOpacity style={styles.btnQuitarPrecio} onPress={() => quitarPrecioIng(i)}>
                          <Text style={styles.btnQuitarPrecioTexto}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                  <TouchableOpacity style={styles.btnAnadirPrecio} onPress={anadirPrecioIng}>
                    <Text style={styles.btnAnadirPrecioTexto}>+ {t.ingredientes.anadir_precio}</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Botones */}
              <View style={styles.row}>
                <TouchableOpacity style={styles.btnSec} onPress={() => { setMostrarNuevoIng(false); resetNuevoIng(); }}>
                  <Text>{t.common.cancelar}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPrim} onPress={crearIngrediente}>
                  <Text style={styles.btnPrimTexto}>{t.common.guardar}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
  catBtnTextoActiva: { color: '#fff' },
  comidaTipoRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  comidaTipoBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', alignItems: 'center', justifyContent: 'center' },
  comidaTipoBtnActiva: { backgroundColor: '#FF6B35', borderColor: '#FF6B35' },
  comidaTipoBtnAmbos: { backgroundColor: '#FF8C5A', borderColor: '#FF8C5A' },
  comidaTipoBtnTexto: { fontSize: 15, fontWeight: '600', color: '#333' },
  comidaTipoBtnTextoActiva: { color: '#fff' },
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
  unidadActivaTexto: { color: '#fff' },
  btnExpandir: { paddingVertical: 10, paddingHorizontal: 4, marginBottom: 8 },
  btnExpandirTexto: { fontSize: 15, fontWeight: '600', color: '#FF6B35' },
  datosExtra: { backgroundColor: '#fafafa', borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  seccionTitulo: { fontSize: 15, fontWeight: '700', color: '#555', marginBottom: 8, marginTop: 4 },
  nutricionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  nutricionItem: { width: '48%', backgroundColor: '#fff', borderRadius: 8, padding: 8, borderWidth: 1, borderColor: '#eee' },
  nutricionLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
  nutricionInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 6, fontSize: 15 },
  precioItem: { marginBottom: 8 },
  btnQuitarPrecio: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fee', alignItems: 'center', justifyContent: 'center' },
  btnQuitarPrecioTexto: { color: '#e74c3c', fontSize: 16 },
  btnAnadirPrecio: { borderWidth: 1, borderColor: '#FF6B35', borderStyle: 'dashed', borderRadius: 8, padding: 10, alignItems: 'center', marginBottom: 4 },
  btnAnadirPrecioTexto: { color: '#FF6B35', fontWeight: '600', fontSize: 14 },
});

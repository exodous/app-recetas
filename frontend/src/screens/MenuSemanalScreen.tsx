// src/screens/MenuSemanalScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator, Modal, FlatList,
} from 'react-native';
import { useI18n } from '../i18n';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

const DIAS_SEMANA = [
  { key: 'lunes', label: 'Lun' },
  { key: 'martes', label: 'Mar' },
  { key: 'miercoles', label: 'Mié' },
  { key: 'jueves', label: 'Jue' },
  { key: 'viernes', label: 'Vie' },
  { key: 'sabado', label: 'Sáb' },
  { key: 'domingo', label: 'Dom' },
];

export default function MenuSemanalScreen({ navigation }: any) {
  const { t, lang } = useI18n();
  const { usuario } = useAuth();
  const [dias, setDias] = useState<Record<string, { almuerzo: boolean; cena: boolean }>>(() => {
    const initial: Record<string, any> = {};
    DIAS_SEMANA.forEach(d => { initial[d.key] = { almuerzo: true, cena: true }; });
    return initial;
  });
  const [comensales, setComensales] = useState('2');
  const [menu, setMenu] = useState<any[] | null>(null);
  const [generando, setGenerando] = useState(false);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [listaCompra, setListaCompra] = useState<any>(null);
  const [generandoLista, setGenerandoLista] = useState(false);
  const [supermercadoSel, setSupermercadoSel] = useState<'todos' | 'mercadona' | 'lidl'>('todos');
  const [modificando, setModificando] = useState<{ diaIdx: number; tipo: 'almuerzo' | 'cena' } | null>(null);
  const [recetasDisponibles, setRecetasDisponibles] = useState<any[]>([]);

  function toggleDia(diaKey: string, tipo: 'almuerzo' | 'cena') {
    setDias(prev => ({
      ...prev,
      [diaKey]: { ...prev[diaKey], [tipo]: !prev[diaKey][tipo] },
    }));
  }

  async function generarMenu() {
    const diasActivos = Object.entries(dias)
      .filter(([_, v]) => v.almuerzo || v.cena)
      .map(([dia, v]) => ({ dia, ...v }));

    if (diasActivos.length === 0) {
      Alert.alert('Error', 'Selecciona al menos un día');
      return;
    }

    const num = parseInt(comensales) || 1;
    setGenerando(true);
    try {
      const resultado = await api.generarMenuSemanal(diasActivos, num);
      setMenu(resultado.menu);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || 'Error generando menú');
    } finally {
      setGenerando(false);
    }
  }

  async function abrirModificar(diaIdx: number, tipo: 'almuerzo' | 'cena') {
    // Cargar recetas disponibles
    try {
      const recetas = await api.getRecetas();
      setRecetasDisponibles(recetas.recetas || []);
      setModificando({ diaIdx, tipo });
    } catch (err) {
      Alert.alert('Error', 'No se pudieron cargar las recetas');
    }
  }

  function aplicarModificacion(receta: any) {
    if (!modificando || !menu) return;
    const nuevoMenu = [...menu];
    const factor = parseInt(comensales) || 1;
    nuevoMenu[modificando.diaIdx][modificando.tipo] = {
      recetaId: receta.id,
      nombre: receta.nombre,
      categoria: receta.categoria,
      tiempoMin: receta.tiempoMin,
      porciones: receta.porciones,
      comensales: factor,
      numIngredientes: receta.ingredientes?.length || 0,
    };
    setMenu(nuevoMenu);
    setModificando(null);
  }

  async function generarLista() {
    if (!menu || menu.length === 0) return;
    setGenerandoLista(true);
    try {
      const resultado = await api.generarListaCompra(menu, supermercadoSel);
      setListaCompra(resultado);
      setMostrarLista(true);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || 'Error generando lista');
    } finally {
      setGenerandoLista(false);
    }
  }

  function getNombre(obj: { es: string; en: string }) {
    return obj?.[lang] || obj?.es || '';
  }

  const comidasTotal = Object.values(dias).reduce((sum, d) => sum + (d.almuerzo ? 1 : 0) + (d.cena ? 1 : 0), 0);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Título */}
        <Text style={styles.titulo}>📅 Menú Semanal</Text>

        {/* Selector de comensales */}
        <Text style={styles.label}>👥 Comensales</Text>
        <TextInput
          style={styles.inputComensales}
          keyboardType="numeric"
          value={comensales}
          onChangeText={setComensales}
          placeholder="2"
        />

        {/* Selector de días */}
        <Text style={styles.label}>Selecciona días y comidas</Text>
        <View style={styles.diasGrid}>
          {/* Cabecera */}
          <View style={styles.diaHeader}>
            <Text style={styles.diaHeaderText}>Día</Text>
            <Text style={styles.diaHeaderSmall}>☀️ Almuerzo</Text>
            <Text style={styles.diaHeaderSmall}>🌙 Cena</Text>
          </View>
          {DIAS_SEMANA.map(dia => (
            <View key={dia.key} style={styles.diaRow}>
              <Text style={styles.diaLabel}>{dia.label}</Text>
              <TouchableOpacity
                style={[styles.checkBtn, dias[dia.key].almuerzo && styles.checkBtnActivo]}
                onPress={() => toggleDia(dia.key, 'almuerzo')}
              >
                <Text style={styles.checkTexto}>{dias[dia.key].almuerzo ? '✅' : '⬜'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.checkBtn, dias[dia.key].cena && styles.checkBtnActivo]}
                onPress={() => toggleDia(dia.key, 'cena')}
              >
                <Text style={styles.checkTexto}>{dias[dia.key].cena ? '✅' : '⬜'}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text style={styles.comidasInfo}>{comidasTotal} comidas esta semana</Text>

        {/* Botón generar */}
        <TouchableOpacity style={styles.btnGenerar} onPress={generarMenu} disabled={generando}>
          {generando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnGenerarTexto}>🎲 Generar Menú</Text>
          )}
        </TouchableOpacity>

        {/* Menú generado */}
        {menu && menu.length > 0 && (
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitulo}>📋 Tu menú semanal</Text>

            {menu.map((dia, idx) => (
              <View key={idx} style={styles.diaMenuCard}>
                <Text style={styles.diaMenuTitulo}>
                  {dia.dia.charAt(0).toUpperCase() + dia.dia.slice(1)}
                </Text>

                {dia.almuerzo ? (
                  <View style={styles.comidaRow}>
                    <View style={styles.comidaInfo}>
                      <Text style={styles.comidaTipo}>☀️ Almuerzo</Text>
                      <Text style={styles.comidaNombre}>{getNombre(dia.almuerzo.nombre)}</Text>
                      {dia.almuerzo.tiempoMin && (
                        <Text style={styles.comidaDetalle}>⏱ {dia.almuerzo.tiempoMin} min</Text>
                      )}
                    </View>
                    <TouchableOpacity
                      style={styles.btnCambiar}
                      onPress={() => abrirModificar(idx, 'almuerzo')}
                    >
                      <Text style={styles.btnCambiarTexto}>↻</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={styles.comidaVacia}>☀️ Sin almuerzo</Text>
                )}

                {dia.cena ? (
                  <View style={styles.comidaRow}>
                    <View style={styles.comidaInfo}>
                      <Text style={styles.comidaTipo}>🌙 Cena</Text>
                      <Text style={styles.comidaNombre}>{getNombre(dia.cena.nombre)}</Text>
                      {dia.cena.tiempoMin && (
                        <Text style={styles.comidaDetalle}>⏱ {dia.cena.tiempoMin} min</Text>
                      )}
                    </View>
                    <TouchableOpacity
                      style={styles.btnCambiar}
                      onPress={() => abrirModificar(idx, 'cena')}
                    >
                      <Text style={styles.btnCambiarTexto}>↻</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={styles.comidaVacia}>🌙 Sin cena</Text>
                )}
              </View>
            ))}

            {/* Botón lista de la compra */}
            <TouchableOpacity style={styles.btnLista} onPress={generarLista} disabled={generandoLista}>
              {generandoLista ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnListaTexto}>🛒 Generar Lista de la Compra</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Lista de la compra */}
        {mostrarLista && listaCompra && (
          <View style={styles.listaContainer}>
            <Text style={styles.listaTitulo}>🛒 Lista de la Compra</Text>

            {/* Selector supermercado */}
            <View style={styles.supSelector}>
              {(['todos', 'mercadona', 'lidl'] as const).map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.supBtn, supermercadoSel === s && styles.supBtnActivo]}
                  onPress={() => setSupermercadoSel(s)}
                >
                  <Text style={styles.supBtnText}>
                    {s === 'todos' ? '🏪 Todos' : s === 'mercadona' ? '🟡 Mercadona' : '🔵 Lidl'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Totales */}
            <View style={styles.totalesRow}>
              <Text style={styles.totalText}>
                🟡 Mercadona: <Text style={styles.totalPrecio}>{listaCompra.totalEstimado?.mercadona?.toFixed(2)}€</Text>
              </Text>
              <Text style={styles.totalText}>
                🔵 Lidl: <Text style={styles.totalPrecio}>{listaCompra.totalEstimado?.lidl?.toFixed(2)}€</Text>
              </Text>
            </View>

            {/* Items */}
            {listaCompra.items?.map((item: any, idx: number) => (
              <View key={idx} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemNombre}>{getNombre(item.nombre)}</Text>
                  <Text style={styles.itemCantidad}>
                    {item.cantidad} {item.unidad}
                  </Text>
                </View>
                <View style={styles.itemPrecios}>
                  {item.precioMercadona != null && (
                    <Text style={styles.itemPrecioM}>
                      🟡 {item.precioMercadona.toFixed(2)}€
                    </Text>
                  )}
                  {item.precioLidl != null && (
                    <Text style={styles.itemPrecioL}>
                      🔵 {item.precioLidl.toFixed(2)}€
                    </Text>
                  )}
                  {item.precioMercadona == null && item.precioLidl == null && (
                    <Text style={styles.itemPrecioND}>Precio N/D</Text>
                  )}
                </View>
              </View>
            ))}

            {/* Total general */}
            <View style={styles.totalGeneral}>
              <Text style={styles.totalGeneralText}>
                💰 Total estimado: {' '}
                {supermercadoSel === 'mercadona' && `${listaCompra.totalEstimado?.mercadona?.toFixed(2)}€`}
                {supermercadoSel === 'lidl' && `${listaCompra.totalEstimado?.lidl?.toFixed(2)}€`}
                {supermercadoSel === 'todos' && `${Math.min(listaCompra.totalEstimado?.mercadona || Infinity, listaCompra.totalEstimado?.lidl || Infinity).toFixed(2)}€ (mejor precio)`}
              </Text>
            </View>

            <TouchableOpacity style={styles.btnCerrar} onPress={() => setMostrarLista(false)}>
              <Text>Cerrar lista</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modal modificar comida */}
      <Modal visible={modificando !== null} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>
              Cambiar {modificando?.tipo === 'almuerzo' ? 'almuerzo' : 'cena'}
            </Text>
            <FlatList
              data={recetasDisponibles}
              keyExtractor={(item) => item.id}
              style={styles.recetasList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.recetaItem}
                  onPress={() => aplicarModificacion(item)}
                >
                  <Text style={styles.recetaNombre}>{getNombre(item.nombre)}</Text>
                  <Text style={styles.recetaDetalle}>
                    {item.categoria?.icono} {item.tiempoMin}min
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.btnCerrarModal}
              onPress={() => setModificando(null)}
            >
              <Text>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 16 },

  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6, marginTop: 8 },
  inputComensales: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 10,
    padding: 12, fontSize: 18, textAlign: 'center', width: 80, alignSelf: 'center', marginBottom: 8,
  },

  diasGrid: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 8 },
  diaHeader: { flexDirection: 'row', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 4 },
  diaHeaderText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#999' },
  diaHeaderSmall: { width: 90, fontSize: 11, fontWeight: '600', color: '#999', textAlign: 'center' },

  diaRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  diaLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: '#333' },
  checkBtn: { width: 90, alignItems: 'center', paddingVertical: 4 },
  checkBtnActivo: {},
  checkTexto: { fontSize: 18 },

  comidasInfo: { fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 12 },

  btnGenerar: { backgroundColor: '#FF6B35', borderRadius: 12, padding: 16, alignItems: 'center' },
  btnGenerarTexto: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  menuContainer: { marginTop: 20 },
  menuTitulo: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },

  diaMenuCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10 },
  diaMenuTitulo: { fontSize: 16, fontWeight: 'bold', color: '#FF6B35', marginBottom: 8 },

  comidaRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  comidaInfo: { flex: 1 },
  comidaTipo: { fontSize: 12, color: '#999' },
  comidaNombre: { fontSize: 15, fontWeight: '500', color: '#333' },
  comidaDetalle: { fontSize: 12, color: '#666' },
  comidaVacia: { fontSize: 13, color: '#ccc', paddingVertical: 4 },

  btnCambiar: { padding: 8 },
  btnCambiarTexto: { fontSize: 20, color: '#FF6B35' },

  btnLista: { backgroundColor: '#4CAF50', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 16 },
  btnListaTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  listaContainer: { marginTop: 20, backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  listaTitulo: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },

  supSelector: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  supBtn: { flex: 1, padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  supBtnActivo: { borderColor: '#FF6B35', backgroundColor: '#FFF3EE' },
  supBtnText: { fontSize: 12 },

  totalesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  totalText: { fontSize: 14 },
  totalPrecio: { fontWeight: 'bold', color: '#FF6B35' },

  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  itemInfo: { flex: 1 },
  itemNombre: { fontSize: 14, color: '#333' },
  itemCantidad: { fontSize: 12, color: '#999' },
  itemPrecios: { alignItems: 'flex-end' },
  itemPrecioM: { fontSize: 12, color: '#666' },
  itemPrecioL: { fontSize: 12, color: '#666' },
  itemPrecioND: { fontSize: 12, color: '#ccc' },

  totalGeneral: { marginTop: 12, paddingTop: 12, borderTopWidth: 2, borderTopColor: '#FF6B35' },
  totalGeneralText: { fontSize: 16, fontWeight: 'bold', color: '#333' },

  btnCerrar: { marginTop: 12, padding: 12, alignItems: 'center' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  recetasList: { maxHeight: 400 },
  recetaItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  recetaNombre: { fontSize: 15, color: '#333' },
  recetaDetalle: { fontSize: 12, color: '#999' },
  btnCerrarModal: { marginTop: 12, padding: 12, alignItems: 'center' },
});

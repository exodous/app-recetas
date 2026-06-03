// src/screens/MenuSemanalScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator, Modal, FlatList, Share,
} from 'react-native';
import { useI18n } from '../i18n';
import * as api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import type { ThemeColors } from '../context/ThemeContext';

const DIAS_SEMANA = [
  { key: 'lunes', label: 'Lunes', short: 'Lun' },
  { key: 'martes', label: 'Martes', short: 'Mar' },
  { key: 'miercoles', label: 'Miércoles', short: 'Mié' },
  { key: 'jueves', label: 'Jueves', short: 'Jue' },
  { key: 'viernes', label: 'Viernes', short: 'Vie' },
  { key: 'sabado', label: 'Sábado', short: 'Sáb' },
  { key: 'domingo', label: 'Domingo', short: 'Dom' },
];

const FILTROS_PRESETS = [
  { key: 'ninguno', label: '🍽️ Todos', incluir: [], excluir: [] },
  { key: 'vegetariano', label: '🥬 Sin carne', incluir: [], excluir: ['carnes', 'pescados'] },
  { key: 'solo_pasta', label: '🍝 Pastas y arroces', incluir: ['pastas'], excluir: [] },
  { key: 'solo_legumbres', label: '🫘 Legumbres', incluir: ['legumbres'], excluir: [] },
  { key: 'ligero', label: '🥗 Ligero (ensaladas/verduras)', incluir: ['ensaladas', 'verduras'], excluir: [] },
];

export default function MenuSemanalScreen({ navigation }: any) {
  const { theme } = useTheme();
  const s = styles(theme);
  const { lang } = useI18n();
  const [dias, setDias] = useState<Record<string, { almuerzo: boolean; cena: boolean }>>(() => {
    const initial: Record<string, any> = {};
    DIAS_SEMANA.forEach(d => { initial[d.key] = { almuerzo: true, cena: true }; });
    return initial;
  });
  const [comensales, setComensales] = useState('2');
  const [filtroActivo, setFiltroActivo] = useState('ninguno');
  const [menu, setMenu] = useState<any[] | null>(null);
  const [generando, setGenerando] = useState(false);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [listaCompra, setListaCompra] = useState<any>(null);
  const [generandoLista, setGenerandoLista] = useState(false);
  const [supermercadoSel, setSupermercadoSel] = useState<'todos' | 'mercadona' | 'lidl'>('todos');
  const [modificando, setModificando] = useState<{ diaIdx: number; tipo: 'almuerzo' | 'cena' } | null>(null);
  const [recetasDisponibles, setRecetasDisponibles] = useState<any[]>([]);

  function getNombre(obj: { es: string; en: string }) {
    return obj?.[lang] || obj?.es || '';
  }

  function toggleDia(diaKey: string, tipo: 'almuerzo' | 'cena') {
    setDias(prev => ({ ...prev, [diaKey]: { ...prev[diaKey], [tipo]: !prev[diaKey][tipo] } }));
  }

  function getFiltros() {
    const preset = FILTROS_PRESETS.find(f => f.key === filtroActivo);
    return { categorias: preset?.incluir || [], excluirCategorias: preset?.excluir || [] };
  }

  async function generarMenu() {
    const diasActivos = Object.entries(dias)
      .filter(([_, v]) => v.almuerzo || v.cena)
      .map(([dia, v]) => ({ dia, ...v }));

    if (diasActivos.length === 0) { Alert.alert('Error', 'Selecciona al menos un día'); return; }

    const num = parseInt(comensales) || 1;
    const filtros = getFiltros();
    setGenerando(true);
    try {
      const resultado = await api.generarMenuSemanal(diasActivos, num, filtros.categorias, filtros.excluirCategorias);
      setMenu(resultado.menu);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || 'Error generando menú');
    } finally {
      setGenerando(false);
    }
  }

  async function abrirModificar(diaIdx: number, tipo: 'almuerzo' | 'cena') {
    try {
      const recetas = await api.getRecetas();
      setRecetasDisponibles(recetas.recetas || []);
      setModificando({ diaIdx, tipo });
    } catch { Alert.alert('Error', 'No se pudieron cargar las recetas'); }
  }

  function aplicarModificacion(receta: any) {
    if (!modificando || !menu) return;
    const nuevoMenu = [...menu];
    const factor = parseInt(comensales) || 1;
    nuevoMenu[modificando.diaIdx][modificando.tipo] = {
      recetaId: receta.id, nombre: receta.nombre, categoria: receta.categoria,
      tiempoMin: receta.tiempoMin, porciones: receta.porciones, comensales: factor,
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

  // Copiar lista de la compra como texto para Google Keep
  async function copiarLista() {
    if (!listaCompra) return;
    let texto = `🛒 Lista de la compra\n\n`;
    listaCompra.items.sort((a: any, b: any) => {
      // Agrupar por tipo de precio disponible (los que tienen precio primero)
      if (a.precioMercadona && !b.precioMercadona) return -1;
      if (!a.precioMercadona && b.precioMercadona) return 1;
      return 0;
    });
    for (const item of listaCompra.items) {
      const nombre = getNombre(item.nombre);
      const cantidad = item.cantidad;
      const unidad = item.unidad;
      const precio = item.precioMercadona || item.precioLidl;
      const precioTxt = precio ? ` (~${precio.toFixed(2)}€)` : '';
      texto += `☐ ${cantidad} ${unidad} ${nombre}${precioTxt}\n`;
    }
    texto += `\n💰 Total estimado:\n`;
    texto += `🟡 Mercadona: ${listaCompra.totalEstimado?.mercadona?.toFixed(2) || '?'}€\n`;
    texto += `🔵 Lidl: ${listaCompra.totalEstimado?.lidl?.toFixed(2) || '?'}€\n`;

    try {
      await Share.share({ message: texto, title: 'Lista de la compra' });
    } catch {
      // Copiar al portapapeles es complicado en Expo web, Share es la mejor opción
      Alert.alert('✅', 'Usa el botón de compartir para copiar la lista a Google Keep');
    }
  }

  const comidasTotal = Object.values(dias).reduce((sum, d) => sum + (d.almuerzo ? 1 : 0) + (d.cena ? 1 : 0), 0);

  return (
    <View style={s.container}>
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={s.titulo}>📅 Menú Semanal</Text>

        {/* Comensales */}
        <View style={s.comensalesRow}>
          <Text style={s.label}>👥 Comensales</Text>
          <TextInput
            style={s.inputComensales}
            keyboardType="numeric"
            value={comensales}
            onChangeText={setComensales}
          />
        </View>

        {/* Filtros */}
        <Text style={s.label}>🔍 Filtro de recetas</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filtrosScroll}>
          {FILTROS_PRESETS.map(f => (
            <TouchableOpacity
              key={f.key}
              style={[s.filtroChip, filtroActivo === f.key && s.filtroActivo]}
              onPress={() => setFiltroActivo(f.key)}
            >
              <Text style={[s.filtroTexto, filtroActivo === f.key && s.filtroTextoActivo]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Selector de días */}
        <Text style={s.label}>Días y comidas</Text>
        <View style={s.diasCard}>
          <View style={s.diaHeader}>
            <Text style={s.diaHeaderText}>Día</Text>
            <Text style={s.diaHeaderSmall}>☀️ Almuerzo</Text>
            <Text style={s.diaHeaderSmall}>🌙 Cena</Text>
          </View>
          {DIAS_SEMANA.map(dia => (
            <View key={dia.key} style={s.diaRow}>
              <Text style={s.diaLabel}>{dia.short}</Text>
              <TouchableOpacity
                style={[s.checkBtn, dias[dia.key].almuerzo && s.checkActivo]}
                onPress={() => toggleDia(dia.key, 'almuerzo')}
              >
                <Text style={s.checkTexto}>{dias[dia.key].almuerzo ? '✅' : '⬜'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.checkBtn, dias[dia.key].cena && s.checkActivo]}
                onPress={() => toggleDia(dia.key, 'cena')}
              >
                <Text style={s.checkTexto}>{dias[dia.key].cena ? '✅' : '⬜'}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text style={s.comidasInfo}>{comidasTotal} comidas esta semana • Filtro: {FILTROS_PRESETS.find(f => f.key === filtroActivo)?.label}</Text>

        {/* Generar */}
        <TouchableOpacity style={s.btnGenerar} onPress={generarMenu} disabled={generando}>
          {generando ? <ActivityIndicator color={theme.textWhite} /> : <Text style={s.btnGenerarTexto}>🎲 Generar Menú</Text>}
        </TouchableOpacity>

        {/* Menú generado */}
        {menu && menu.length > 0 && (
          <View style={s.menuContainer}>
            <Text style={s.menuTitulo}>📋 Tu menú semanal</Text>
            {menu.map((dia, idx) => (
              <View key={idx} style={s.diaMenuCard}>
                <Text style={s.diaMenuTitulo}>{dia.dia.charAt(0).toUpperCase() + dia.dia.slice(1)}</Text>
                {['almuerzo', 'cena'].map(tipo => {
                  const comida = dia[tipo];
                  return React.createElement(
                    comida ? 'TouchableOpacity' : 'View',
                    {
                      key: tipo,
                      style: comida ? s.comidaRow : s.comidaVacia,
                      ...(comida ? { onPress: () => abrirModificar(idx, tipo), activeOpacity: 0.7 } : {}),
                    },
                    React.createElement(View, { style: comida ? s.comidaInfo : {} },
                      React.createElement(Text, { style: s.comidaTipo }, tipo === 'almuerzo' ? '☀️ Almuerzo' : '🌙 Cena'),
                      comida ? React.createElement(Text, { style: s.comidaNombre }, getNombre(comida.nombre)) : null,
                      comida && comida.tiempoMin ? React.createElement(Text, { style: s.comidaDetalle }, `⏱ ${comida.tiempoMin} min`) : null,
                    ),
                    comida ? React.createElement(Text, { style: s.btnCambiar }, '↻') : React.createElement(Text, { style: s.comidaVaciaText }, `Sin ${tipo}`),
                  );
                })}
              </View>
            ))}

            <TouchableOpacity style={s.btnLista} onPress={generarLista} disabled={generandoLista}>
              {generandoLista ? <ActivityIndicator color={theme.textWhite} /> : <Text style={s.btnListaTexto}>🛒 Generar Lista de la Compra</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setMenu(null)} style={s.btnNuevo}>
              <Text style={s.btnNuevoTexto}>🗑 Limpiar menú</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Lista de la compra */}
        {mostrarLista && listaCompra && (
          <View style={s.listaContainer}>
            <Text style={s.listaTitulo}>🛒 Lista de la Compra</Text>

            {/* Selector supermercado */}
            <View style={s.supRow}>
              {(['todos', 'mercadona', 'lidl'] as const).map(sup => (
                <TouchableOpacity key={sup} style={[s.supChip, supermercadoSel === sup && s.supChipActivo]} onPress={() => setSupermercadoSel(sup)}>
                  <Text style={s.supChipText}>{sup === 'todos' ? '🏪 Todos' : sup === 'mercadona' ? '🟡 Mercadona' : '🔵 Lidl'}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Totales */}
            <View style={s.totalesBox}>
              <View style={s.totalRow}>
                <Text style={s.totalLabel}>🟡 Mercadona</Text>
                <Text style={s.totalValor}>{listaCompra.totalEstimado?.mercadona?.toFixed(2) || '?'}€</Text>
              </View>
              <View style={s.totalRow}>
                <Text style={s.totalLabel}>🔵 Lidl</Text>
                <Text style={s.totalValor}>{listaCompra.totalEstimado?.lidl?.toFixed(2) || '?'}€</Text>
              </View>
            </View>

            {/* Items */}
            {listaCompra.items?.map((item: any, idx: number) => (
              <View key={idx} style={s.itemRow}>
                <View style={s.itemLeft}>
                  <Text style={s.itemNombre}>{getNombre(item.nombre)}</Text>
                  <Text style={s.itemCantidad}>{item.cantidad} {item.unidad}</Text>
                </View>
                <View style={s.itemRight}>
                  {item.precioMercadona != null && <Text style={s.itemPrecioM}>🟡 {item.precioMercadona.toFixed(2)}€</Text>}
                  {item.precioLidl != null && <Text style={s.itemPrecioL}>🔵 {item.precioLidl.toFixed(2)}€</Text>}
                  {item.precioMercadona == null && item.precioLidl == null && <Text style={s.itemPrecioND}>N/D</Text>}
                </View>
              </View>
            ))}

            {/* Botones */}
            <TouchableOpacity style={s.btnCopiar} onPress={copiarLista}>
              <Text style={s.btnCopiarTexto}>📋 Copiar lista (compartir)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.btnCerrar} onPress={() => setMostrarLista(false)}>
              <Text style={s.btnCerrarTexto}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modal modificar */}
      <Modal visible={modificando !== null} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <Text style={s.modalTitulo}>Cambiar {modificando?.tipo === 'almuerzo' ? 'almuerzo' : 'cena'}</Text>
            <FlatList
              data={recetasDisponibles}
              keyExtractor={(item) => item.id}
              style={s.recetasList}
              renderItem={({ item }) => (
                <TouchableOpacity style={s.recetaItem} onPress={() => aplicarModificacion(item)}>
                  <Text style={s.recetaNombre}>{getNombre(item.nombre)}</Text>
                  <Text style={s.recetaDetalle}>{item.categoria?.icono} {item.tiempoMin}min</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={s.btnCerrarModal} onPress={() => setModificando(null)}>
              <Text>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = (theme: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  scrollContent: { padding: 16, paddingBottom: 40 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: theme.text, marginBottom: 16 },

  label: { fontSize: 14, fontWeight: '600', color: theme.text, marginBottom: 6, marginTop: 4 },
  comensalesRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  inputComensales: {
    backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, borderRadius: 12,
    padding: 12, fontSize: 18, textAlign: 'center', width: 80,
  },

  filtrosScroll: { marginBottom: 12 },
  filtroChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: theme.card, marginRight: 8, borderWidth: 1, borderColor: theme.border },
  filtroActivo: { backgroundColor: theme.primary, borderColor: theme.primary },
  filtroTexto: { fontSize: 13, color: theme.text, fontWeight: '500' },
  filtroTextoActivo: { color: theme.textWhite },

  diasCard: { backgroundColor: theme.card, borderRadius: 16, padding: 12, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  diaHeader: { flexDirection: 'row', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: theme.borderLight, marginBottom: 4 },
  diaHeaderText: { flex: 1, fontSize: 12, fontWeight: '600', color: theme.textLight },
  diaHeaderSmall: { width: 90, fontSize: 11, fontWeight: '600', color: theme.textLight, textAlign: 'center' },
  diaRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  diaLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: theme.text },
  checkBtn: { width: 90, alignItems: 'center', paddingVertical: 4 },
  checkActivo: {},
  checkTexto: { fontSize: 18 },

  comidasInfo: { fontSize: 12, color: theme.textLight, textAlign: 'center', marginBottom: 12 },

  btnGenerar: { backgroundColor: theme.primary, borderRadius: 14, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 5 },
  btnGenerarTexto: { color: theme.textWhite, fontSize: 18, fontWeight: 'bold' },

  menuContainer: { marginTop: 20 },
  menuTitulo: { fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 12 },

  diaMenuCard: { backgroundColor: theme.card, borderRadius: 16, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3, borderLeftWidth: 4, borderLeftColor: theme.primary },
  diaMenuTitulo: { fontSize: 16, fontWeight: 'bold', color: theme.primary, marginBottom: 8 },

  comidaRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.borderLight },
  comidaInfo: { flex: 1 },
  comidaTipo: { fontSize: 11, color: theme.textLight },
  comidaNombre: { fontSize: 15, fontWeight: '600', color: theme.text, marginTop: 2 },
  comidaDetalle: { fontSize: 12, color: theme.textSecondary, marginTop: 1 },
  comidaVacia: { paddingVertical: 6 },
  comidaVaciaText: { fontSize: 13, color: theme.textLight, fontStyle: 'italic' },

  btnCambiar: { fontSize: 22, color: theme.primary, padding: 4 },

  btnLista: { backgroundColor: theme.secondary, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 16 },
  btnListaTexto: { color: theme.textWhite, fontSize: 16, fontWeight: 'bold' },

  btnNuevo: { backgroundColor: theme.card, borderRadius: 12, padding: 12, alignItems: 'center', marginTop: 8, borderWidth: 1, borderColor: theme.border },
  btnNuevoTexto: { color: theme.textSecondary, fontSize: 14, fontWeight: '500' },

  listaContainer: { marginTop: 20, backgroundColor: theme.card, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  listaTitulo: { fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 12 },

  supRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  supChip: { flex: 1, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: theme.border, alignItems: 'center', backgroundColor: theme.borderLight },
  supChipActivo: { borderColor: theme.primary, backgroundColor: theme.primaryLight },
  supChipText: { fontSize: 12, fontWeight: '500' },

  totalesBox: { backgroundColor: theme.borderLight, borderRadius: 12, padding: 12, marginBottom: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  totalLabel: { fontSize: 14, color: theme.textSecondary },
  totalValor: { fontSize: 14, fontWeight: 'bold', color: theme.primary },

  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.borderLight },
  itemLeft: { flex: 1 },
  itemNombre: { fontSize: 14, color: theme.text, fontWeight: '500' },
  itemCantidad: { fontSize: 12, color: theme.textLight },
  itemRight: { alignItems: 'flex-end' },
  itemPrecioM: { fontSize: 12, color: theme.textSecondary },
  itemPrecioL: { fontSize: 12, color: theme.textSecondary },
  itemPrecioND: { fontSize: 12, color: theme.textLight },

  btnCopiar: { backgroundColor: theme.accent, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 12 },
  btnCopiarTexto: { color: theme.textWhite, fontSize: 15, fontWeight: '600' },

  btnCerrar: { padding: 12, alignItems: 'center', marginTop: 4 },
  btnCerrarTexto: { color: theme.textLight, fontSize: 14 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: theme.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '80%' },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: theme.text },
  recetasList: { maxHeight: 400 },
  recetaItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: theme.borderLight },
  recetaNombre: { fontSize: 15, color: theme.text, fontWeight: '500' },
  recetaDetalle: { fontSize: 12, color: theme.textLight, marginTop: 2 },
  btnCerrarModal: { marginTop: 12, padding: 14, alignItems: 'center' },
});

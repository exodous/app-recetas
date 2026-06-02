// src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.29.114.110:3001/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Interceptor para añadir token JWT
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============ AUTH ============
export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });
  await AsyncStorage.setItem('token', data.token);
  await AsyncStorage.setItem('usuario', JSON.stringify(data.usuario));
  return data;
}

export async function registrar(email: string, password: string, nombre: string, idiomaPreferido: string) {
  const { data } = await api.post('/auth/registrar', { email, password, nombre, idiomaPreferido });
  await AsyncStorage.setItem('token', data.token);
  await AsyncStorage.setItem('usuario', JSON.stringify(data.usuario));
  return data;
}

export async function getPerfil() {
  const { data } = await api.get('/auth/perfil');
  return data;
}

export async function logout() {
  await AsyncStorage.multiRemove(['token', 'usuario']);
}

// ============ RECETAS ============
export async function getRecetas(params?: { categoria?: string; buscar?: string; pagina?: number }) {
  const { data } = await api.get('/recetas', { params });
  return data;
}

export async function getReceta(id: string) {
  const { data } = await api.get(`/recetas/${id}`);
  return data;
}

export async function crearReceta(receta: Partial<any>) {
  const { data } = await api.post('/recetas', receta);
  return data;
}

export async function actualizarReceta(id: string, receta: Partial<any>) {
  const { data } = await api.put(`/recetas/${id}`, receta);
  return data;
}

export async function eliminarReceta(id: string) {
  const { data } = await api.delete(`/recetas/${id}`);
  return data;
}

// ============ CATEGORIAS ============
export async function getCategorias() {
  const { data } = await api.get('/categorias');
  return data;
}

export async function crearCategoria(categoria: any) {
  const { data } = await api.post('/categorias', categoria);
  return data;
}

// ============ TIPOS DE INGREDIENTE ============
export async function getTiposIngrediente() {
  const { data } = await api.get('/tipos-ingrediente');
  return data;
}

export async function crearTipoIngrediente(tipo: any) {
  const { data } = await api.post('/tipos-ingrediente', tipo);
  return data;
}
export async function getIngredientes(buscar?: string) {
  const { data } = await api.get('/ingredientes', { params: { buscar } });
  return data;
}

export async function crearIngrediente(ingrediente: any) {
  const { data } = await api.post('/ingredientes', ingrediente);
  return data;
}

// ============ DESCARGAS ============
export async function descargarReceta(recetaId: string) {
  const { data } = await api.post(`/descargas/${recetaId}`);
  return data;
}

export async function getDescargas() {
  const { data } = await api.get('/descargas');
  return data;
}

export async function eliminarDescarga(recetaId: string) {
  const { data } = await api.delete(`/descargas/${recetaId}`);
  return data;
}

// ============ MENU SEMANAL ============
export async function generarMenuSemanal(dias: any[], comensales: number, categorias?: string[], excluirCategorias?: string[]) {
  const { data } = await api.post('/menu-semanal/generar', { dias, comensales, categorias, excluirCategorias });
  return data;
}

export async function generarListaCompra(menu: any[], supermercado: string = 'todos') {
  const { data } = await api.post('/menu-semanal/lista-compra', { menu, supermercado });
  return data;
}

export default api;

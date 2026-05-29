// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as api from '../services/api';
import { Usuario } from '../types';

interface AuthContextType {
  usuario: Usuario | null;
  cargando: boolean;
  login: (email: string, password: string) => Promise<void>;
  registrar: (email: string, password: string, nombre: string, idioma: string) => Promise<void>;
  logout: () => Promise<void>;
  setUsuario: (u: Usuario | null) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarUsuario();
  }, []);

  async function cargarUsuario() {
    try {
      const stored = await AsyncStorage.getItem('usuario');
      if (stored) {
        setUsuario(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error cargando usuario:', e);
    } finally {
      setCargando(false);
    }
  }

  async function login(email: string, password: string) {
    const data = await api.login(email, password);
    setUsuario(data.usuario);
  }

  async function registrar(email: string, password: string, nombre: string, idioma: string) {
    const data = await api.registrar(email, password, nombre, idioma);
    setUsuario(data.usuario);
  }

  async function logout() {
    await api.logout();
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, registrar, logout, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

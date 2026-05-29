// src/screens/DetalleRecetaScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
  Share,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { getReceta, descargarReceta } from '../services/api';
import { useI18n } from '../i18n';
import type { Receta } from '../types';

export default function DetalleRecetaScreen({ route, navigation }: any) {
  const { id } = route.params as { id: string };
  const { t, lang } = useI18n();
  const nav = useNavigation<any>();
  const localRoute = useRoute<any>();

  const [receta, setReceta] = useState<Receta | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const cargarReceta = useCallback(async () => {
    setLoading(true);
    try {
      const data: Receta = await getReceta(id);
      setReceta(data);
    } catch (err: any) {
      Alert.alert(t.common.error, err.message || 'Error al cargar la receta');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    cargarReceta();
  }, [cargarReceta]);

  useFocusEffect(
    useCallback(() => {
      cargarReceta();
    }, [cargarReceta])
  );

  const handleDescargar = async () => {
    setDownloading(true);
    try {
      await descargarReceta(id);
      Alert.alert('✅', 'Receta descargada offline correctamente');
    } catch (err: any) {
      Alert.alert(t.common.error, err.message || 'Error al descargar');
    } finally {
      setDownloading(false);
    }
  };

  const handleCompartir = async () => {
    if (!receta) return;
    const nombre = receta.nombre[lang];
    const instrucciones = receta.instrucciones[lang];
    const ingredientesList = receta.ingredientes
      ?.map((ri) => {
        const nombreIng = ri.ingrediente?.nombre?.[lang] ?? '';
        return `• ${ri.cantidad} ${ri.unidad} ${nombreIng}`;
      })
      .join('\n');

    const mensaje = `${nombre}\n\n${t.receta.ingredientes}:\n${ingredientesList}\n\n${t.receta.instrucciones}:\n${instrucciones}`;

    try {
      await Share.share({ message: mensaje, title: nombre });
    } catch (err: any) {
      // usuario canceló u otro error silencioso
    }
  };

  const handleEditar = () => {
    nav.navigate('EditarReceta', { id });
  };

  const getNombre = (obj: { es: string; en: string } | undefined) => {
    if (!obj) return '';
    return obj[lang] ?? obj.es;
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>{t.common.cargando}</Text>
      </View>
    );
  }

  if (!receta) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{t.common.error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={cargarReceta}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const nombreReceta = getNombre(receta.nombre);
  const instruccionesTexto = getNombre(receta.instrucciones);
  const categoriaNombre = getNombre(receta.categoria?.nombre);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Foto */}
      {receta.fotoUrl ? (
        <Image source={{ uri: receta.fotoUrl }} style={styles.foto} resizeMode="cover" />
      ) : (
        <View style={styles.fotoPlaceholder}>
          <Text style={styles.fotoPlaceholderText}>🍽️</Text>
        </View>
      )}

      {/* Nombre */}
      <Text style={styles.titulo}>{nombreReceta}</Text>

      {/* Info pills */}
      <View style={styles.infoRow}>
        {categoriaNombre ? (
          <View style={styles.infoPill}>
            <Text style={styles.infoPillIcon}>📂</Text>
            <Text style={styles.infoPillText}>{categoriaNombre}</Text>
          </View>
        ) : null}
        {receta.tiempoMin ? (
          <View style={styles.infoPill}>
            <Text style={styles.infoPillIcon}>⏱️</Text>
            <Text style={styles.infoPillText}>
              {receta.tiempoMin} {t.receta.minutos}
            </Text>
          </View>
        ) : null}
        {receta.porciones ? (
          <View style={styles.infoPill}>
            <Text style={styles.infoPillIcon}>👥</Text>
            <Text style={styles.infoPillText}>
              {receta.porciones} {t.receta.porciones}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Ingredientes */}
      {receta.ingredientes && receta.ingredientes.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t.receta.ingredientes}</Text>
          {receta.ingredientes.map((ri, index) => {
            const nombreIng = ri.ingrediente?.nombre ? getNombre(ri.ingrediente.nombre) : '';
            return (
              <View key={index} style={styles.ingredienteRow}>
                <View style={styles.ingredienteDot} />
                <Text style={styles.ingredienteText}>
                  <Text style={styles.ingredienteCantidad}>
                    {ri.cantidad} {ri.unidad}
                  </Text>
                  {'  '}
                  {nombreIng}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Instrucciones */}
      {instruccionesTexto ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t.receta.instrucciones}</Text>
          <Text style={styles.instruccionesTexto}>{instruccionesTexto}</Text>
        </View>
      ) : null}

      {/* Autor */}
      {receta.usuario?.nombre ? (
        <Text style={styles.autor}>por {receta.usuario.nombre}</Text>
      ) : null}

      {/* Botones de acción */}
      <View style={styles.botonesContainer}>
        <TouchableOpacity style={styles.botonPrimario} onPress={handleDescargar} disabled={downloading}>
          {downloading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.botonPrimarioText}>📥 {t.receta.descargar}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.botonSecundario} onPress={handleCompartir}>
          <Text style={styles.botonSecundarioText}>🔗 {t.receta.compartir}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botonSecundario} onPress={handleEditar}>
          <Text style={styles.botonSecundarioText}>✏️ {t.common.editar}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  foto: {
    width: '100%',
    height: 240,
  },
  fotoPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#FFE8DF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fotoPlaceholderText: {
    fontSize: 64,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A2E',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginBottom: 4,
  },
  infoPillIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  infoPillText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B35',
    marginBottom: 12,
  },
  ingredienteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  ingredienteDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B35',
    marginRight: 10,
  },
  ingredienteText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  ingredienteCantidad: {
    fontWeight: '600',
    color: '#FF6B35',
  },
  instruccionesTexto: {
    fontSize: 15,
    color: '#444',
    lineHeight: 24,
  },
  autor: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  botonesContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 10,
  },
  botonPrimario: {
    backgroundColor: '#FF6B35',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  botonPrimarioText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  botonSecundario: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FF6B35',
    minHeight: 50,
  },
  botonSecundarioText: {
    color: '#FF6B35',
    fontSize: 15,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 24,
  },
});

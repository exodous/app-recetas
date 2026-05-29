// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import DetalleRecetaScreen from '../screens/DetalleRecetaScreen';
import NuevaRecetaScreen from '../screens/NuevaRecetaScreen';
import IngredientesScreen from '../screens/IngredientesScreen';
import DescargasScreen from '../screens/DescargasScreen';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  const { t } = useI18n();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { paddingBottom: 4, paddingTop: 4, height: 60 },
        headerStyle: { backgroundColor: '#FF6B35' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tab.Screen
        name="Recetas"
        component={HomeScreen}
        options={{
          title: t.tabs.recetas,
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>🍳</Text>,
        }}
      />
      <Tab.Screen
        name="NuevaReceta"
        component={NuevaRecetaScreen}
        options={{
          title: t.tabs.nueva,
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>➕</Text>,
        }}
      />
      <Tab.Screen
        name="Ingredientes"
        component={IngredientesScreen}
        options={{
          title: t.tabs.ingredientes,
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>🧂</Text>,
        }}
      />
      <Tab.Screen
        name="Descargas"
        component={DescargasScreen}
        options={{
          title: t.tabs.descargas,
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>📥</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { usuario, cargando } = useAuth();

  if (cargando) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!usuario ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={Tabs} />
            <Stack.Screen
              name="DetalleReceta"
              component={DetalleRecetaScreen}
              options={{ headerShown: true, title: '', headerStyle: { backgroundColor: '#FF6B35' }, headerTintColor: '#fff' }}
            />
            <Stack.Screen
              name="NuevaReceta"
              component={NuevaRecetaScreen}
              options={{ headerShown: true, title: 'Nueva Receta', headerStyle: { backgroundColor: '#FF6B35' }, headerTintColor: '#fff' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

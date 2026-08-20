import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import CultureHomeScreen from '../modules/culture/CultureHomeScreen';
import MissionsScreen from '../modules/gamification/MissionsScreen';
import ProfileScreen from '../modules/auth/ProfileScreen';

import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

// Componente simple de iconos usando emojis para el prototipo
const TabIcon = ({ name, focused }) => {
  let icon = '';
  switch (name) {
    case 'Inicio':
      icon = '🏠';
      break;
    case 'Explorar':
      icon = '🏺';
      break;
    case 'Misiones':
      icon = '🎯';
      break;
    case 'Perfil':
      icon = '👤';
      break;
  }
  return (
    <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.5 }}>
      {icon}
    </Text>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 8,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          paddingBottom: 5,
          paddingTop: 5,
          minHeight: 60, // Mejor área táctil para accesibilidad
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Inicio" 
        component={HomeScreen} 
        options={{ tabBarAccessibilityLabel: "Pestaña de Inicio" }}
      />
      <Tab.Screen 
        name="Explorar" 
        component={CultureHomeScreen} 
        options={{ tabBarAccessibilityLabel: "Pestaña de Exploración Cultural" }}
      />
      <Tab.Screen 
        name="Misiones" 
        component={MissionsScreen} 
        options={{ tabBarAccessibilityLabel: "Pestaña de Misiones y Gamificación" }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={ProfileScreen} 
        options={{ tabBarAccessibilityLabel: "Pestaña de Perfil de Usuario" }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;

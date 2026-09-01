import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { colors } from '../../src/theme/colors';

const TabIcon = ({ name, focused }: { name: string, focused: boolean }) => {
  let icon = '';
  switch (name) {
    case 'inicio':
      icon = '🏠';
      break;
    case 'explorar':
      icon = '🏺';
      break;
    case 'misiones':
      icon = '🎯';
      break;
    case 'progreso':
      icon = '📊';
      break;
    case 'perfil':
      icon = '👤';
      break;
  }
  return (
    <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.5 }}>
      {icon}
    </Text>
  );
};

export default function TabLayout() {
  return (
    <Tabs
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
          minHeight: 60,
        },
        headerShown: false,
      })}
    >
      <Tabs.Screen 
        name="inicio" 
        options={{ title: "Inicio", tabBarAccessibilityLabel: "Pestaña de Inicio" }}
      />
      <Tabs.Screen 
        name="explorar" 
        options={{ title: "Explorar", tabBarAccessibilityLabel: "Pestaña de Exploración Cultural" }}
      />
      <Tabs.Screen 
        name="misiones" 
        options={{ title: "Misiones", tabBarAccessibilityLabel: "Pestaña de Misiones y Gamificación" }}
      />
      <Tabs.Screen 
        name="progreso" 
        options={{ title: "Progreso", tabBarAccessibilityLabel: "Pestaña de Progreso y Estadísticas" }}
      />
      <Tabs.Screen 
        name="perfil" 
        options={{ title: "Perfil", tabBarAccessibilityLabel: "Pestaña de Perfil de Usuario" }}
      />
    </Tabs>
  );
}
import { Stack } from 'expo-router';

import { colors } from '../../src/theme/colors';

export default function CulturaLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },

        headerTintColor: colors.primary,

        headerTitleStyle: {
          fontWeight: 'bold',
        },

        headerShadowVisible: false,

        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="paises"
        options={{
          title: 'Países',
        }}
      />

      <Stack.Screen
        name="categorias"
        options={{
          title: 'Categorías',
        }}
      />

      <Stack.Screen
        name="favoritos"
        options={{
          title: 'Mis favoritos',
        }}
      />

      <Stack.Screen
        name="ranking"
        options={{
          title: 'Ranking',
        }}
      />

      <Stack.Screen
        name="pais/[id]"
        options={{
          title: 'País',
        }}
      />

      <Stack.Screen
        name="categoria/[id]"
        options={{
          title: 'Categoría cultural',
        }}
      />

      <Stack.Screen
        name="elemento/[id]"
        options={{
          title: 'Patrimonio cultural',
        }}
      />
    </Stack>
  );
}
import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { View, ActivityIndicator, Text } from 'react-native';
import { colors } from '../src/theme/colors';
import { GamificacionProvider } from '../src/context/GamificacionContext';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === 'auth';

    if (session && inAuthGroup) {
      router.replace('/(tabs)/inicio');
    } else if (!session && !inAuthGroup) {
      router.replace('/auth/login');
    }
  }, [session, initialized, segments]);

  if (!initialized) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 24, elevation: 4 }}>
          <Text style={{ fontSize: 64 }}>🌍</Text>
        </View>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.primary, textAlign: 'center', marginBottom: 8 }}>
          Guardianes del Patrimonio
        </Text>
        <Text style={{ fontSize: 16, color: colors.textLight, textAlign: 'center' }}>
          Explora culturas. Descubre historias.
        </Text>
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 48 }} />
      </View>
    );
  }

  return (
    <GamificacionProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="mision/[id]" />
      </Stack>
    </GamificacionProvider>
  );
}
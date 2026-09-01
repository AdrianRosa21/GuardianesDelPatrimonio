import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useFocusEffect, useRouter } from 'expo-router';

import { supabase } from '../../lib/supabase';

import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

interface Pais {
  id_pais: number;
  nombre: string;
  continente: string;
  descripcion: string | null;
  bandera: string | null;
}

export default function PaisesScreen() {
  const router = useRouter();

  const [paises, setPaises] = useState<Pais[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);

  const cargarPaises = async () => {
    try {
      setLoading(true);
      setErrorMensaje(null);

      const { data, error } = await supabase
        .from('paises')
        .select('*')
        .order('nombre', {
          ascending: true,
        });

      if (error) {
        throw error;
      }

      setPaises((data ?? []) as Pais[]);
    } catch (error) {
      console.error('Error cargando países:', error);

      setErrorMensaje(
        'No fue posible cargar los países.'
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarPaises();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.loadingText}>
          Cargando países...
        </Text>
      </View>
    );
  }

  if (errorMensaje) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>⚠️</Text>

        <Text style={styles.errorText}>
          {errorMensaje}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={cargarPaises}
        >
          <Text style={styles.retryText}>
            Intentar nuevamente
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.list}
      data={paises}
      keyExtractor={(item) =>
        item.id_pais.toString()
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>
            🌎
          </Text>

          <Text style={styles.emptyTitle}>
            No hay países todavía
          </Text>

          <Text style={styles.emptyDescription}>
            Cuando existan países registrados en Supabase aparecerán aquí.
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: '/cultura/pais/[id]',
              params: {
                id: item.id_pais.toString(),
              },
            })
          }
        >
          <View style={styles.flagContainer}>
            <Text style={styles.flag}>
              {item.bandera || '🌎'}
            </Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.countryName}>
              {item.nombre}
            </Text>

            <Text style={styles.continent}>
              {item.continente}
            </Text>

            {!!item.descripcion && (
              <Text
                style={styles.description}
                numberOfLines={2}
              >
                {item.descripcion}
              </Text>
            )}
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  list: {
    padding: spacing.m,
    flexGrow: 1,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: colors.background,

    padding: spacing.l,
  },

  loadingText: {
    color: colors.textLight,
    marginTop: spacing.m,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: colors.surface,

    borderRadius: 16,

    padding: spacing.m,
    marginBottom: spacing.m,

    elevation: 2,
  },

  flagContainer: {
    width: 58,
    height: 58,

    borderRadius: 29,

    backgroundColor: colors.background,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: spacing.m,
  },

  flag: {
    fontSize: 31,
  },

  cardContent: {
    flex: 1,
  },

  countryName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: colors.text,
  },

  continent: {
    marginTop: 2,
    color: colors.secondary,
    fontWeight: '600',
  },

  description: {
    marginTop: spacing.xs,

    color: colors.textLight,

    lineHeight: 19,
  },

  arrow: {
    fontSize: 31,
    color: colors.primary,
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    padding: spacing.xl,
  },

  emptyIcon: {
    fontSize: 60,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,

    marginTop: spacing.m,
  },

  emptyDescription: {
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.s,
  },

  errorIcon: {
    fontSize: 52,
  },

  errorText: {
    marginTop: spacing.m,

    color: colors.error,
    textAlign: 'center',
  },

  retryButton: {
    marginTop: spacing.l,

    backgroundColor: colors.primary,

    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,

    borderRadius: 10,
  },

  retryText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});
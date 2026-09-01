import React, {
  useCallback,
  useState,
} from 'react';

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useFocusEffect } from 'expo-router';

import { supabase } from '../../lib/supabase';

import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

interface Ranking {
  id_usuario: string;
  nombre_usuario: string | null;
  nombre_completo: string | null;
  url_avatar: string | null;
  puntos: number;
  nivel: number;
  posicion: number;
}

export default function RankingScreen() {
  const [ranking, setRanking] =
    useState<Ranking[]>([]);

  const [loading, setLoading] =
    useState(true);

  const cargarRanking = async () => {
    try {
      setLoading(true);

      const { data, error } =
        await supabase
          .from('vw_ranking')
          .select('*')
          .order('posicion', {
            ascending: true,
          });

      if (error) {
        throw error;
      }

      setRanking(
        (data ?? []) as Ranking[]
      );
    } catch (error) {
      console.error(
        'Error cargando ranking:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarRanking();
    }, [])
  );

  const obtenerPosicion = (
    posicion: number
  ) => {
    if (posicion === 1) return '🥇';

    if (posicion === 2) return '🥈';

    if (posicion === 3) return '🥉';

    return `#${posicion}`;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.trophy}>
          🏆
        </Text>

        <Text style={styles.title}>
          Guardianes destacados
        </Text>

        <Text style={styles.subtitle}>
          Los exploradores con mayor cantidad de puntos.
        </Text>
      </View>

      <FlatList
        data={ranking}
        keyExtractor={(item) =>
          item.id_usuario
        }
        contentContainerStyle={
          styles.list
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            Todavía no hay usuarios en el ranking.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.position}>
              {obtenerPosicion(
                Number(item.posicion)
              )}
            </Text>

            <View style={styles.user}>
              <Text style={styles.name}>
                {item.nombre_usuario ||
                  item.nombre_completo ||
                  'Guardián'}
              </Text>

              <Text style={styles.level}>
                Nivel {item.nivel}
              </Text>
            </View>

            <View style={styles.pointsContainer}>
              <Text style={styles.points}>
                {item.puntos}
              </Text>

              <Text
                style={styles.pointsLabel}
              >
                puntos
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: colors.background,
  },

  center: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: colors.background,
  },

  header: {
    alignItems: 'center',

    padding: spacing.l,
  },

  trophy: {
    fontSize: 56,
  },

  title: {
    color: colors.primary,

    fontSize: 25,
    fontWeight: 'bold',

    marginTop: spacing.s,
  },

  subtitle: {
    color: colors.textLight,

    textAlign: 'center',

    marginTop: spacing.xs,
  },

  list: {
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.xl,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: colors.surface,

    borderRadius: 14,

    padding: spacing.m,
    marginBottom: spacing.m,

    elevation: 2,
  },

  position: {
    width: 55,

    fontSize: 25,
  },

  user: {
    flex: 1,
  },

  name: {
    color: colors.text,

    fontSize: 17,
    fontWeight: 'bold',
  },

  level: {
    color: colors.textLight,

    marginTop: 2,
  },

  pointsContainer: {
    alignItems: 'center',
  },

  points: {
    color: colors.primary,

    fontSize: 21,
    fontWeight: 'bold',
  },

  pointsLabel: {
    color: colors.textLight,

    fontSize: 12,
  },

  empty: {
    color: colors.textLight,

    textAlign: 'center',

    marginTop: spacing.xl,
  },
});
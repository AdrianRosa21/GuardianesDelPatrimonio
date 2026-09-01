import React, {
  useCallback,
  useState,
} from 'react';

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useFocusEffect,
  useRouter,
} from 'expo-router';

import { supabase } from '../../lib/supabase';

import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

interface ElementoFavorito {
  id_elemento: number;
  nombre: string;
  descripcion: string | null;
  ubicacion: string | null;
}

interface Favorito {
  id_favorito: number;

  elementos_patrimoniales:
    | ElementoFavorito
    | ElementoFavorito[]
    | null;
}

export default function FavoritosScreen() {
  const router = useRouter();

  const [favoritos, setFavoritos] =
    useState<Favorito[]>([]);

  const [loading, setLoading] =
    useState(true);

  const cargarFavoritos = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setFavoritos([]);
        return;
      }

      const { data, error } =
        await supabase
          .from('favoritos')
          .select(`
            id_favorito,
            elementos_patrimoniales (
              id_elemento,
              nombre,
              descripcion,
              ubicacion
            )
          `)
          .eq('id_usuario', user.id)
          .order('fecha_agregado', {
            ascending: false,
          });

      if (error) {
        throw error;
      }

      setFavoritos(
        (data ?? []) as unknown as Favorito[]
      );
    } catch (error) {
      console.error(
        'Error cargando favoritos:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarFavoritos();
    }, [])
  );

  const obtenerElemento = (
    relacion:
      Favorito['elementos_patrimoniales']
  ) => {
    if (!relacion) {
      return null;
    }

    if (Array.isArray(relacion)) {
      return relacion[0] ?? null;
    }

    return relacion;
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
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.list}
      data={favoritos}
      keyExtractor={(item) =>
        item.id_favorito.toString()
      }
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.icon}>
            🤍
          </Text>

          <Text style={styles.title}>
            Sin favoritos
          </Text>

          <Text style={styles.empty}>
            Cuando guardes patrimonio cultural aparecerá aquí.
          </Text>
        </View>
      }
      renderItem={({ item }) => {
        const elemento =
          obtenerElemento(
            item.elementos_patrimoniales
          );

        if (!elemento) return null;

        return (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname:
                  '/cultura/elemento/[id]',
                params: {
                  id:
                    elemento.id_elemento.toString(),
                },
              })
            }
          >
            <Text style={styles.name}>
              ❤️ {elemento.nombre}
            </Text>

            {!!elemento.ubicacion && (
              <Text style={styles.location}>
                📍 {elemento.ubicacion}
              </Text>
            )}

            {!!elemento.descripcion && (
              <Text
                style={styles.description}
                numberOfLines={2}
              >
                {elemento.descripcion}
              </Text>
            )}
          </TouchableOpacity>
        );
      }}
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

    padding: spacing.xl,
  },

  icon: {
    fontSize: 56,
  },

  title: {
    color: colors.text,

    fontSize: 21,
    fontWeight: 'bold',

    marginTop: spacing.m,
  },

  empty: {
    color: colors.textLight,

    textAlign: 'center',

    marginTop: spacing.s,
  },

  card: {
    backgroundColor: colors.surface,

    padding: spacing.m,

    borderRadius: 14,

    marginBottom: spacing.m,

    elevation: 2,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',

    color: colors.text,
  },

  location: {
    color: colors.secondary,

    marginTop: spacing.xs,
  },

  description: {
    color: colors.textLight,

    lineHeight: 20,

    marginTop: spacing.s,
  },
});
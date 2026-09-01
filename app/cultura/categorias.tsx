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

interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion: string | null;
}

const obtenerIcono = (nombre: string) => {
  const categoria =
    nombre.toLowerCase();

  if (categoria.includes('gastronom')) {
    return '🍽️';
  }

  if (categoria.includes('historia')) {
    return '📜';
  }

  if (categoria.includes('tradicion')) {
    return '🎭';
  }

  if (categoria.includes('artesan')) {
    return '🧵';
  }

  if (
    categoria.includes('arque') ||
    categoria.includes('sitio')
  ) {
    return '🏛️';
  }

  if (categoria.includes('personaje')) {
    return '👤';
  }

  return '🏺';
};

export default function CategoriasScreen() {
  const router = useRouter();

  const [categorias, setCategorias] =
    useState<Categoria[]>([]);

  const [loading, setLoading] =
    useState(true);

  const cargarCategorias = async () => {
    try {
      setLoading(true);

      const { data, error } =
        await supabase
          .from('categorias')
          .select('*')
          .order('nombre');

      if (error) {
        throw error;
      }

      setCategorias(
        (data ?? []) as Categoria[]
      );
    } catch (error) {
      console.error(
        'Error cargando categorías:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarCategorias();
    }, [])
  );

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
      data={categorias}
      keyExtractor={(item) =>
        item.id_categoria.toString()
      }
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>
            🏺
          </Text>

          <Text style={styles.empty}>
            No existen categorías registradas todavía.
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname:
                '/cultura/categoria/[id]',
              params: {
                id:
                  item.id_categoria.toString(),
              },
            })
          }
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>
              {obtenerIcono(item.nombre)}
            </Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.name}>
              {item.nombre}
            </Text>

            <Text
              style={styles.description}
              numberOfLines={2}
            >
              {item.descripcion ||
                'Explora los elementos de esta categoría.'}
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
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

    padding: spacing.xl,

    backgroundColor: colors.background,
  },

  card: {
    backgroundColor: colors.surface,

    flexDirection: 'row',
    alignItems: 'center',

    padding: spacing.m,

    borderRadius: 15,

    marginBottom: spacing.m,

    elevation: 2,
  },

  iconContainer: {
    width: 56,
    height: 56,

    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 28,

    backgroundColor: colors.background,

    marginRight: spacing.m,
  },

  icon: {
    fontSize: 29,
  },

  content: {
    flex: 1,
  },

  name: {
    color: colors.text,

    fontSize: 18,
    fontWeight: 'bold',
  },

  description: {
    color: colors.textLight,

    marginTop: spacing.xs,

    lineHeight: 19,
  },

  arrow: {
    color: colors.primary,
    fontSize: 30,
  },

  emptyIcon: {
    fontSize: 55,
  },

  empty: {
    color: colors.textLight,

    textAlign: 'center',

    marginTop: spacing.m,
  },
});
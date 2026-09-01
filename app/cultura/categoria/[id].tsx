import React, {
  useEffect,
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
  Stack,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import { supabase } from '../../../lib/supabase';

import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';

interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion: string | null;
}

interface PaisRelacion {
  nombre: string;
}

interface Elemento {
  id_elemento: number;
  nombre: string;
  descripcion: string | null;
  ubicacion: string | null;

  paises:
    | PaisRelacion
    | PaisRelacion[]
    | null;
}

export default function CategoriaDetalleScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const [categoria, setCategoria] =
    useState<Categoria | null>(null);

  const [elementos, setElementos] =
    useState<Elemento[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    if (!id) return;

    try {
      setLoading(true);

      const {
        data: categoriaData,
        error: categoriaError,
      } = await supabase
        .from('categorias')
        .select('*')
        .eq('id_categoria', id)
        .single();

      if (categoriaError) {
        throw categoriaError;
      }

      const {
        data: elementosData,
        error: elementosError,
      } = await supabase
        .from('elementos_patrimoniales')
        .select(`
          id_elemento,
          nombre,
          descripcion,
          ubicacion,
          paises (
            nombre
          )
        `)
        .eq('id_categoria', id)
        .order('nombre');

      if (elementosError) {
        throw elementosError;
      }

      setCategoria(
        categoriaData as Categoria
      );

      setElementos(
        (elementosData ?? []) as unknown as Elemento[]
      );
    } catch (error) {
      console.error(
        'Error cargando categoría:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const paisNombre = (
    pais: Elemento['paises']
  ) => {
    if (!pais) {
      return '';
    }

    if (Array.isArray(pais)) {
      return pais[0]?.nombre ?? '';
    }

    return pais.nombre;
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

  if (!categoria) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          No se encontró la categoría.
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: categoria.nombre,
        }}
      />

      <FlatList
        style={styles.container}
        contentContainerStyle={styles.list}
        data={elementos}
        keyExtractor={(item) =>
          item.id_elemento.toString()
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>
              {categoria.nombre}
            </Text>

            {!!categoria.descripcion && (
              <Text style={styles.description}>
                {categoria.descripcion}
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            No existen elementos patrimoniales en esta categoría todavía.
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname:
                  '/cultura/elemento/[id]',
                params: {
                  id:
                    item.id_elemento.toString(),
                },
              })
            }
          >
            <Text style={styles.name}>
              {item.nombre}
            </Text>

            <Text style={styles.country}>
              🌎 {paisNombre(item.paises)}
            </Text>

            {!!item.descripcion && (
              <Text
                numberOfLines={2}
                style={styles.elementDescription}
              >
                {item.descripcion}
              </Text>
            )}
          </TouchableOpacity>
        )}
      />
    </>
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
  },

  header: {
    marginBottom: spacing.l,
  },

  title: {
    color: colors.primary,

    fontSize: 27,
    fontWeight: 'bold',
  },

  description: {
    color: colors.textLight,

    marginTop: spacing.s,

    lineHeight: 22,
  },

  card: {
    backgroundColor: colors.surface,

    padding: spacing.m,

    borderRadius: 14,

    marginBottom: spacing.m,

    elevation: 2,
  },

  name: {
    color: colors.text,

    fontSize: 18,
    fontWeight: 'bold',
  },

  country: {
    color: colors.secondary,

    marginTop: spacing.xs,

    fontWeight: '600',
  },

  elementDescription: {
    color: colors.textLight,

    marginTop: spacing.s,

    lineHeight: 20,
  },

  empty: {
    color: colors.textLight,

    textAlign: 'center',

    marginTop: spacing.xl,
  },

  error: {
    color: colors.error,
  },
});
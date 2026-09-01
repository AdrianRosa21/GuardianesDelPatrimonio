import React, { useEffect, useState } from 'react';

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

interface Pais {
  id_pais: number;
  nombre: string;
  continente: string;
  descripcion: string | null;
  bandera: string | null;
}

interface CategoriaRelacion {
  nombre: string;
}

interface Elemento {
  id_elemento: number;
  nombre: string;
  descripcion: string | null;
  ubicacion: string | null;

  categorias:
    | CategoriaRelacion
    | CategoriaRelacion[]
    | null;
}

export default function PaisDetalleScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const [pais, setPais] =
    useState<Pais | null>(null);

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

      const { data: paisData, error: paisError } =
        await supabase
          .from('paises')
          .select('*')
          .eq('id_pais', id)
          .single();

      if (paisError) {
        throw paisError;
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
          categorias (
            nombre
          )
        `)
        .eq('id_pais', id)
        .order('nombre');

      if (elementosError) {
        throw elementosError;
      }

      setPais(paisData as Pais);

      setElementos(
        (elementosData ?? []) as unknown as Elemento[]
      );
    } catch (error) {
      console.error(
        'Error cargando país:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const categoriaNombre = (
    categoria: Elemento['categorias']
  ) => {
    if (!categoria) {
      return 'Sin categoría';
    }

    if (Array.isArray(categoria)) {
      return categoria[0]?.nombre ??
        'Sin categoría';
    }

    return categoria.nombre;
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

  if (!pais) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          No se encontró este país.
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: pais.nombre,
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
            <Text style={styles.flag}>
              {pais.bandera || '🌎'}
            </Text>

            <Text style={styles.countryName}>
              {pais.nombre}
            </Text>

            <Text style={styles.continent}>
              {pais.continente}
            </Text>

            {!!pais.descripcion && (
              <Text style={styles.description}>
                {pais.descripcion}
              </Text>
            )}

            <Text style={styles.sectionTitle}>
              Patrimonio cultural
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            Todavía no hay patrimonio registrado para este país.
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname:
                  '/cultura/elemento/[id]',
                params: {
                  id: item.id_elemento.toString(),
                },
              })
            }
          >
            <View style={styles.cardContent}>
              <Text style={styles.elementName}>
                {item.nombre}
              </Text>

              <Text style={styles.category}>
                {categoriaNombre(
                  item.categorias
                )}
              </Text>

              {!!item.ubicacion && (
                <Text style={styles.location}>
                  📍 {item.ubicacion}
                </Text>
              )}

              {!!item.descripcion && (
                <Text
                  style={styles.elementDescription}
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

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: colors.background,
  },

  header: {
    alignItems: 'center',
    marginBottom: spacing.l,
  },

  flag: {
    fontSize: 68,
  },

  countryName: {
    fontSize: 29,
    fontWeight: 'bold',
    color: colors.primary,

    marginTop: spacing.s,
  },

  continent: {
    color: colors.secondary,
    fontWeight: 'bold',

    marginTop: spacing.xs,
  },

  description: {
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,

    marginTop: spacing.m,
  },

  sectionTitle: {
    alignSelf: 'flex-start',

    fontSize: 22,
    fontWeight: 'bold',

    color: colors.text,

    marginTop: spacing.xl,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: colors.surface,

    padding: spacing.m,

    borderRadius: 14,

    marginBottom: spacing.m,

    elevation: 2,
  },

  cardContent: {
    flex: 1,
  },

  elementName: {
    color: colors.text,

    fontSize: 18,
    fontWeight: 'bold',
  },

  category: {
    color: colors.secondary,
    fontWeight: '600',

    marginTop: 3,
  },

  location: {
    color: colors.textLight,

    marginTop: spacing.xs,
  },

  elementDescription: {
    color: colors.textLight,

    marginTop: spacing.xs,

    lineHeight: 19,
  },

  arrow: {
    color: colors.primary,
    fontSize: 30,
  },

  empty: {
    color: colors.textLight,
    textAlign: 'center',

    marginTop: spacing.xl,
  },

  errorText: {
    color: colors.error,
  },
});
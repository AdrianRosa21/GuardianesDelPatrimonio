import React, {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Stack,
  useLocalSearchParams,
} from 'expo-router';

import { supabase } from '../../../lib/supabase';

import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';

interface Elemento {
  id_elemento: number;
  nombre: string;
  descripcion: string | null;
  ubicacion: string | null;
  latitud: number | null;
  longitud: number | null;
}

interface Multimedia {
  id_multimedia: number;
  tipo: string;
  url: string;
  descripcion: string | null;
}

export default function ElementoDetalleScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const [elemento, setElemento] =
    useState<Elemento | null>(null);

  const [multimedia, setMultimedia] =
    useState<Multimedia[]>([]);

  const [favorito, setFavorito] =
    useState(false);

  const [idFavorito, setIdFavorito] =
    useState<number | null>(null);

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
        data: elementoData,
        error: elementoError,
      } = await supabase
        .from('elementos_patrimoniales')
        .select('*')
        .eq('id_elemento', id)
        .single();

      if (elementoError) {
        throw elementoError;
      }

      const {
        data: multimediaData,
        error: multimediaError,
      } = await supabase
        .from('multimedia')
        .select('*')
        .eq('id_elemento', id);

      if (multimediaError) {
        throw multimediaError;
      }

      setElemento(
        elementoData as Elemento
      );

      setMultimedia(
        (multimediaData ?? []) as Multimedia[]
      );

      await comprobarFavorito(
        Number(id)
      );
    } catch (error) {
      console.error(
        'Error cargando elemento:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const comprobarFavorito = async (
    idElemento: number
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } =
      await supabase
        .from('favoritos')
        .select('id_favorito')
        .eq('id_usuario', user.id)
        .eq('id_elemento', idElemento)
        .maybeSingle();

    if (error) {
      console.error(
        'Error comprobando favorito:',
        error
      );

      return;
    }

    if (data) {
      setFavorito(true);
      setIdFavorito(data.id_favorito);
    } else {
      setFavorito(false);
      setIdFavorito(null);
    }
  };

  const cambiarFavorito = async () => {
    if (!elemento) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert(
        'Sesión requerida',
        'Debes iniciar sesión.'
      );

      return;
    }

    if (favorito && idFavorito) {
      const { error } =
        await supabase
          .from('favoritos')
          .delete()
          .eq(
            'id_favorito',
            idFavorito
          );

      if (error) {
        Alert.alert(
          'Error',
          error.message
        );

        return;
      }

      setFavorito(false);
      setIdFavorito(null);

      return;
    }

    const {
      data,
      error,
    } = await supabase
      .from('favoritos')
      .insert({
        id_usuario: user.id,

        id_elemento:
          elemento.id_elemento,
      })
      .select('id_favorito')
      .single();

    if (error) {
      Alert.alert(
        'Error',
        error.message
      );

      return;
    }

    setFavorito(true);
    setIdFavorito(data.id_favorito);
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

  if (!elemento) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          No se encontró el elemento patrimonial.
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: elemento.nombre,
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.mainIcon}>
          🏛️
        </Text>

        <Text style={styles.title}>
          {elemento.nombre}
        </Text>

        {!!elemento.ubicacion && (
          <Text style={styles.location}>
            📍 {elemento.ubicacion}
          </Text>
        )}

        <TouchableOpacity
          style={[
            styles.favoriteButton,

            favorito &&
              styles.favoriteButtonActive,
          ]}
          onPress={cambiarFavorito}
        >
          <Text
            style={styles.favoriteText}
          >
            {favorito
              ? '❤️ Guardado en favoritos'
              : '🤍 Agregar a favoritos'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>
          Descripción
        </Text>

        <Text style={styles.description}>
          {elemento.descripcion ||
            'No hay descripción disponible.'}
        </Text>

        <Text style={styles.sectionTitle}>
          Multimedia
        </Text>

        {multimedia.length === 0 ? (
          <Text style={styles.secondary}>
            No hay contenido multimedia disponible.
          </Text>
        ) : (
          multimedia.map((archivo) => (
            <View
              key={archivo.id_multimedia}
              style={styles.mediaCard}
            >
              <Text style={styles.mediaTitle}>
                {archivo.tipo ===
                'video'
                  ? '🎥'
                  : '🖼️'}{' '}
                {archivo.tipo}
              </Text>

              {!!archivo.descripcion && (
                <Text
                  style={styles.secondary}
                >
                  {archivo.descripcion}
                </Text>
              )}

              <Text
                numberOfLines={2}
                style={styles.url}
              >
                {archivo.url}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: spacing.l,
  },

  center: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: colors.background,
  },

  mainIcon: {
    fontSize: 70,
    textAlign: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',

    color: colors.primary,

    textAlign: 'center',

    marginTop: spacing.s,
  },

  location: {
    color: colors.textLight,

    textAlign: 'center',

    marginTop: spacing.s,
  },

  favoriteButton: {
    backgroundColor: colors.secondary,

    borderRadius: 12,

    padding: spacing.m,

    alignItems: 'center',

    marginTop: spacing.l,
  },

  favoriteButtonActive: {
    backgroundColor: colors.primary,
  },

  favoriteText: {
    color: colors.white,
    fontWeight: 'bold',
  },

  sectionTitle: {
    color: colors.text,

    fontSize: 21,
    fontWeight: 'bold',

    marginTop: spacing.xl,
    marginBottom: spacing.s,
  },

  description: {
    color: colors.text,

    lineHeight: 23,
  },

  secondary: {
    color: colors.textLight,

    lineHeight: 20,
  },

  mediaCard: {
    backgroundColor: colors.surface,

    padding: spacing.m,

    borderRadius: 12,

    marginBottom: spacing.m,
  },

  mediaTitle: {
    color: colors.secondary,

    fontWeight: 'bold',
    textTransform: 'capitalize',

    marginBottom: spacing.s,
  },

  url: {
    color: colors.primary,

    marginTop: spacing.s,
  },

  error: {
    color: colors.error,
  },
});
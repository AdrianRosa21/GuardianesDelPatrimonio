import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { misiones } from '../../src/data/misiones';
import { useGamificacion } from '../../src/context/GamificacionContext';
import PrimaryButton from '../../src/components/common/PrimaryButton';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

const TriviaScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { completarMision, estaCompletada } = useGamificacion();

  const mision = misiones.find((m) => m.id === id);

  const [preguntaActual, setPreguntaActual] = useState(0);
  const [seleccion, setSeleccion] = useState<number | null>(null);
  const [respondida, setRespondida] = useState(false);
  const [aciertos, setAciertos] = useState(0);
  const [terminada, setTerminada] = useState(false);

  const [datoCultural, setDatoCultural] = useState<string | null>(null);
  const [cargandoDato, setCargandoDato] = useState(true);

  useEffect(() => {
    if (!mision) return;
    const obtenerDato = async () => {
      try {
        setCargandoDato(true);
        const respuesta = await fetch(
          `https://restcountries.com/v3.1/name/${encodeURIComponent(mision.pais)}?fields=capital,region,population`
        );
        const datos = await respuesta.json();
        if (Array.isArray(datos) && datos.length > 0) {
          const pais = datos[0];
          const capital = pais.capital?.[0] || 'desconocida';
          const region = pais.region || 'América';
          const poblacion = pais.population ? pais.population.toLocaleString('es') : 'muchos';
          setDatoCultural(`Capital: ${capital} · Región: ${region} · Población: ${poblacion} habitantes.`);
        } else {
          setDatoCultural('No se pudo obtener información adicional del país.');
        }
      } catch (error) {
        setDatoCultural('No se pudo conectar con el servicio de datos.');
      } finally {
        setCargandoDato(false);
      }
    };
    obtenerDato();
  }, [mision]);

  if (!mision) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centro}>
          <Text style={styles.title}>Misión no encontrada</Text>
          <PrimaryButton title="Volver" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const pregunta = mision.preguntas[preguntaActual];
  const esUltima = preguntaActual === mision.preguntas.length - 1;

  const elegirOpcion = (indice: number) => {
    if (respondida) return;
    setSeleccion(indice);
    setRespondida(true);
    if (indice === pregunta.respuestaCorrecta) setAciertos((a) => a + 1);
  };

  const siguiente = () => {
    if (esUltima) {
      if (!estaCompletada(mision.id)) completarMision(mision.id, mision.puntos);
      setTerminada(true);
    } else {
      setPreguntaActual((p) => p + 1);
      setSeleccion(null);
      setRespondida(false);
    }
  };

  if (terminada) {
    const yaEraCompletada = estaCompletada(mision.id);
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: mision.titulo, headerShown: true }} />
        <View style={styles.centro}>
          <Text style={styles.resultadoEmoji}>🎉</Text>
          <Text style={styles.resultadoTitulo}>¡Misión completada!</Text>
          <Text style={styles.resultadoTexto}>
            Acertaste {aciertos} de {mision.preguntas.length} preguntas.
          </Text>
          <View style={styles.puntosGanados}>
            <Text style={styles.puntosGanadosText}>+{mision.puntos} puntos</Text>
          </View>
          {yaEraCompletada && (
            <Text style={styles.notaRepetida}>
              (Ya habías completado esta misión, no se suman puntos de nuevo.)
            </Text>
          )}
          <View style={styles.botonesFinal}>
            <PrimaryButton title="Ver mi progreso" onPress={() => router.replace('/(tabs)/progreso')} />
            <TouchableOpacity onPress={() => router.replace('/(tabs)/misiones')}>
              <Text style={styles.volverLink}>Volver a misiones</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: mision.titulo, headerShown: true }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.datoCard}>
          <Text style={styles.datoTitulo}>{mision.bandera} Sobre {mision.pais}</Text>
          {cargandoDato ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.datoTexto}>{datoCultural}</Text>
          )}
        </View>

        <Text style={styles.progresoTexto}>
          Pregunta {preguntaActual + 1} de {mision.preguntas.length}
        </Text>

        <Text style={styles.enunciado}>{pregunta.enunciado}</Text>

        <View style={styles.opciones}>
          {pregunta.opciones.map((opcion, indice) => {
            let estiloOpcion = styles.opcion;
            let estiloTexto = styles.opcionTexto;
            if (respondida) {
              if (indice === pregunta.respuestaCorrecta) {
                estiloOpcion = { ...styles.opcion, ...styles.opcionCorrecta };
                estiloTexto = { ...styles.opcionTexto, ...styles.opcionTextoBlanco };
              } else if (indice === seleccion) {
                estiloOpcion = { ...styles.opcion, ...styles.opcionIncorrecta };
                estiloTexto = { ...styles.opcionTexto, ...styles.opcionTextoBlanco };
              }
            }
            return (
              <TouchableOpacity
                key={indice}
                style={estiloOpcion}
                onPress={() => elegirOpcion(indice)}
                activeOpacity={0.8}
                disabled={respondida}
                accessibilityRole="button"
                accessibilityLabel={opcion}
              >
                <Text style={estiloTexto}>{opcion}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {respondida && (
          <View style={styles.feedback}>
            <Text style={styles.feedbackTitulo}>
              {seleccion === pregunta.respuestaCorrecta ? '✅ ¡Correcto!' : '❌ Incorrecto'}
            </Text>
            <Text style={styles.feedbackTexto}>{pregunta.explicacion}</Text>
          </View>
        )}

        {respondida && (
          <View style={styles.siguienteContainer}>
            <PrimaryButton
              title={esUltima ? 'Finalizar misión' : 'Siguiente pregunta'}
              onPress={siguiente}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, padding: spacing.l },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.primary, marginBottom: spacing.l, textAlign: 'center' },
  datoCard: { backgroundColor: colors.secondary, borderRadius: 16, padding: spacing.m, marginBottom: spacing.l },
  datoTitulo: { fontSize: 16, fontWeight: 'bold', color: colors.white, marginBottom: spacing.xs },
  datoTexto: { fontSize: 14, color: colors.white, lineHeight: 20 },
  progresoTexto: { fontSize: 14, color: colors.textLight, marginBottom: spacing.s, fontWeight: '600' },
  enunciado: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: spacing.l, lineHeight: 28 },
  opciones: { width: '100%' },
  opcion: {
    backgroundColor: colors.surface, borderRadius: 12, padding: spacing.m, marginBottom: spacing.m,
    borderWidth: 2, borderColor: colors.border, minHeight: 56, justifyContent: 'center',
  },
  opcionCorrecta: { backgroundColor: colors.success, borderColor: colors.success },
  opcionIncorrecta: { backgroundColor: colors.error, borderColor: colors.error },
  opcionTexto: { fontSize: 16, color: colors.text, fontWeight: '500' },
  opcionTextoBlanco: { color: colors.white },
  feedback: {
    backgroundColor: colors.surface, borderRadius: 12, padding: spacing.m, marginTop: spacing.s,
    borderLeftWidth: 4, borderLeftColor: colors.primary,
  },
  feedbackTitulo: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: spacing.xs },
  feedbackTexto: { fontSize: 14, color: colors.textLight, lineHeight: 20 },
  siguienteContainer: { marginTop: spacing.l },
  resultadoEmoji: { fontSize: 72, marginBottom: spacing.m },
  resultadoTitulo: { fontSize: 26, fontWeight: 'bold', color: colors.primary, marginBottom: spacing.s, textAlign: 'center' },
  resultadoTexto: { fontSize: 16, color: colors.text, marginBottom: spacing.l, textAlign: 'center' },
  puntosGanados: { backgroundColor: colors.secondary, paddingVertical: spacing.s, paddingHorizontal: spacing.l, borderRadius: 20, marginBottom: spacing.m },
  puntosGanadosText: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
  notaRepetida: { fontSize: 13, color: colors.textLight, textAlign: 'center', marginBottom: spacing.m, fontStyle: 'italic' },
  botonesFinal: { width: '100%', marginTop: spacing.m },
  volverLink: { color: colors.primary, fontSize: 16, fontWeight: '600', textAlign: 'center', marginTop: spacing.m },
});

export default TriviaScreen;
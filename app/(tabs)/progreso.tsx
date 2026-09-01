import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useGamificacion } from '../../src/context/GamificacionContext';
import { insignias, niveles } from '../../src/data/misiones';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

const ProgresoScreen = () => {
  const {
    puntos, nivelActual, insigniasDesbloqueadas, paisesDescubiertos,
    misionesCompletadas, totalMisiones, reiniciarProgreso,
  } = useGamificacion();

  const siguienteNivel = niveles.find((n) => n.nivel === nivelActual.nivel + 1);
  const puntosParaSiguiente = siguienteNivel ? siguienteNivel.puntosMinimos - puntos : 0;
  const progresoNivel = siguienteNivel
    ? Math.min(100, ((puntos - nivelActual.puntosMinimos) / (siguienteNivel.puntosMinimos - nivelActual.puntosMinimos)) * 100)
    : 100;

  const idsInsigniasDesbloqueadas = insigniasDesbloqueadas.map((i) => i.id);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">Mi progreso 📊</Text>
          <Text style={styles.subtitle}>Tu avance como guardián del patrimonio.</Text>
        </View>

        <View style={styles.nivelCard}>
          <Text style={styles.nivelNumero}>Nivel {nivelActual.nivel}</Text>
          <Text style={styles.nivelNombre}>{nivelActual.nombre}</Text>
          <View style={styles.barraFondo}>
            <View style={[styles.barraProgreso, { width: `${progresoNivel}%` }]} />
          </View>
          {siguienteNivel ? (
            <Text style={styles.nivelHint}>
              Te faltan {puntosParaSiguiente} puntos para nivel {siguienteNivel.nivel}
            </Text>
          ) : (
            <Text style={styles.nivelHint}>¡Alcanzaste el nivel máximo! 🏆</Text>
          )}
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValor}>{puntos}</Text>
            <Text style={styles.statLabel}>⭐ Puntos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValor}>{misionesCompletadas.length}/{totalMisiones}</Text>
            <Text style={styles.statLabel}>🎯 Misiones</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValor}>{paisesDescubiertos}</Text>
            <Text style={styles.statLabel}>🌎 Países</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValor}>{insigniasDesbloqueadas.length}</Text>
            <Text style={styles.statLabel}>🏅 Insignias</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Insignias</Text>
        <View style={styles.insigniasContainer}>
          {insignias.map((insignia) => {
            const desbloqueada = idsInsigniasDesbloqueadas.includes(insignia.id);
            return (
              <View key={insignia.id} style={[styles.insigniaCard, !desbloqueada && styles.insigniaBloqueada]}>
                <Text style={[styles.insigniaIcono, !desbloqueada && styles.iconoBloqueado]}>
                  {desbloqueada ? insignia.icono : '🔒'}
                </Text>
                <Text style={styles.insigniaNombre}>{insignia.nombre}</Text>
                <Text style={styles.insigniaDesc}>{insignia.descripcion}</Text>
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.reiniciarBtn}
          onPress={reiniciarProgreso}
          accessibilityRole="button"
          accessibilityLabel="Reiniciar progreso"
        >
          <Text style={styles.reiniciarText}>Reiniciar progreso</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, padding: spacing.l },
  header: { marginTop: spacing.l, marginBottom: spacing.l },
  title: { fontSize: 32, fontWeight: 'bold', color: colors.primary, marginBottom: spacing.xs },
  subtitle: { fontSize: 16, color: colors.textLight },
  nivelCard: { backgroundColor: colors.primary, borderRadius: 16, padding: spacing.l, marginBottom: spacing.l, alignItems: 'center' },
  nivelNumero: { fontSize: 28, fontWeight: 'bold', color: colors.white },
  nivelNombre: { fontSize: 18, color: colors.white, marginBottom: spacing.m, opacity: 0.9 },
  barraFondo: { width: '100%', height: 12, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 6, overflow: 'hidden', marginBottom: spacing.s },
  barraProgreso: { height: '100%', backgroundColor: colors.white, borderRadius: 6 },
  nivelHint: { fontSize: 13, color: colors.white, opacity: 0.9 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: spacing.l },
  statCard: {
    width: '48%', backgroundColor: colors.surface, borderRadius: 12, padding: spacing.m, marginBottom: spacing.m,
    alignItems: 'center', shadowColor: colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  statValor: { fontSize: 26, fontWeight: 'bold', color: colors.primary, marginBottom: spacing.xs },
  statLabel: { fontSize: 14, color: colors.textLight },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: spacing.m },
  insigniasContainer: { marginBottom: spacing.l },
  insigniaCard: {
    backgroundColor: colors.surface, borderRadius: 12, padding: spacing.m, marginBottom: spacing.m, alignItems: 'center',
    shadowColor: colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  insigniaBloqueada: { opacity: 0.5 },
  insigniaIcono: { fontSize: 40, marginBottom: spacing.xs },
  iconoBloqueado: { opacity: 0.7 },
  insigniaNombre: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: spacing.xs },
  insigniaDesc: { fontSize: 13, color: colors.textLight, textAlign: 'center' },
  reiniciarBtn: { alignItems: 'center', padding: spacing.m, marginTop: spacing.s },
  reiniciarText: { color: colors.error, fontSize: 14, fontWeight: '600' },
});

export default ProgresoScreen;
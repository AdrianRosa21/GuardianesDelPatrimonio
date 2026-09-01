import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { misiones } from '../../src/data/misiones';
import { useGamificacion } from '../../src/context/GamificacionContext';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

const MissionsScreen = () => {
  const router = useRouter();
  const { estaCompletada, puntos, nivelActual } = useGamificacion();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">
            Misiones 🎯
          </Text>
          <Text style={styles.subtitle}>
            Completa retos y gana puntos explorando culturas.
          </Text>
        </View>

        <View style={styles.resumen}>
          <View style={styles.resumenItem}>
            <Text style={styles.resumenValor}>{puntos}</Text>
            <Text style={styles.resumenLabel}>Puntos</Text>
          </View>
          <View style={styles.resumenDivider} />
          <View style={styles.resumenItem}>
            <Text style={styles.resumenValor}>{nivelActual.nivel}</Text>
            <Text style={styles.resumenLabel}>Nivel</Text>
          </View>
        </View>

        <View style={styles.lista}>
          {misiones.map((mision) => {
            const completada = estaCompletada(mision.id);
            return (
              <TouchableOpacity
                key={mision.id}
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => router.push(`/mision/${mision.id}`)}
                accessibilityRole="button"
                accessibilityLabel={`Misión ${mision.titulo}`}
                accessibilityHint={completada ? 'Misión completada' : 'Toca para comenzar la misión'}
              >
                <View style={styles.cardBandera}>
                  <Text style={styles.banderaText}>{mision.bandera}</Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{mision.titulo}</Text>
                  <Text style={styles.cardDescription}>{mision.descripcion}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardPuntos}>+{mision.puntos} pts</Text>
                    {completada && (
                      <View style={styles.completadaBadge}>
                        <Text style={styles.completadaText}>✓ Completada</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
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
  resumen: {
    flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 16,
    padding: spacing.m, marginBottom: spacing.l, alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  resumenItem: { flex: 1, alignItems: 'center' },
  resumenValor: { fontSize: 28, fontWeight: 'bold', color: colors.primary },
  resumenLabel: { fontSize: 14, color: colors.textLight, marginTop: spacing.xs },
  resumenDivider: { width: 1, height: 40, backgroundColor: colors.border },
  lista: { width: '100%' },
  card: {
    flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 16, padding: spacing.m,
    marginBottom: spacing.m, alignItems: 'center', shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, minHeight: 100,
  },
  cardBandera: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.m,
  },
  banderaText: { fontSize: 32 },
  cardContent: { flex: 1, justifyContent: 'center' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: spacing.xs },
  cardDescription: { fontSize: 14, color: colors.textLight, lineHeight: 20, marginBottom: spacing.s },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardPuntos: { fontSize: 14, fontWeight: 'bold', color: colors.secondary },
  completadaBadge: { backgroundColor: colors.success, paddingVertical: 2, paddingHorizontal: spacing.s, borderRadius: 12 },
  completadaText: { color: colors.white, fontSize: 12, fontWeight: 'bold' },
});

export default MissionsScreen;
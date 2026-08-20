import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const CultureHomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🏺</Text>
        </View>
        <Text style={styles.title} accessibilityRole="header">
          Exploración cultural
        </Text>
        <Text style={styles.description}>
          Este módulo permitirá explorar países, categorías y patrimonio cultural.
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Módulo de Persona 2</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.l,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  badge: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    borderRadius: 20,
  },
  badgeText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default CultureHomeScreen;

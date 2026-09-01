import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { User } from '@supabase/supabase-js';

const ActionCard = ({ title, description, icon, onPress }: { title: string, description: string, icon: string, onPress: () => void }) => (
  <TouchableOpacity 
    style={styles.card} 
    onPress={onPress}
    activeOpacity={0.8}
    accessibilityRole="button"
    accessibilityLabel={`Ir a ${title}`}
    accessibilityHint={description}
  >
    <View style={styles.cardIconContainer}>
      <Text style={styles.cardIcon}>{icon}</Text>
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
    <View style={styles.cardChevron}>
      <Text style={styles.chevronText}>›</Text>
    </View>
  </TouchableOpacity>
);

const HomeScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const getFirstName = (fullName?: string) => {
    if (!fullName) return 'Guardián';
    return fullName.split(' ')[0];
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting} accessibilityRole="header">
            Hola, {getFirstName(user?.user_metadata?.nombre_completo)} 👋
          </Text>
          <Text style={styles.subtitle}>
            ¿Qué descubriremos hoy?
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          <ActionCard
            title="Explorar culturas"
            description="Descubre países, tradiciones y lugares."
            icon="🏺"
            onPress={() => router.push('/(tabs)/explorar')}
          />
          
          <ActionCard
            title="Misiones"
            description="Pon a prueba lo que has aprendido."
            icon="🎯"
            onPress={() => router.push('/(tabs)/misiones')}
          />
          
          <ActionCard
            title="Mi perfil"
            description="Consulta tu cuenta y progreso."
            icon="👤"
            onPress={() => router.push('/(tabs)/perfil')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.l,
  },
  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textLight,
  },
  cardsContainer: {
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.m,
    marginBottom: spacing.l,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 100, // Accessibility touch target
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.m,
  },
  cardIcon: {
    fontSize: 32,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  cardChevron: {
    paddingLeft: spacing.s,
  },
  chevronText: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
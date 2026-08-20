import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const ActionCard = ({ title, description, icon, onPress }) => (
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

const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  const getFirstName = (fullName) => {
    if (!fullName) return 'Guardián';
    return fullName.split(' ')[0];
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting} accessibilityRole="header">
            Hola, {getFirstName(user?.name)} 👋
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
            onPress={() => navigation.navigate('Explorar')}
          />
          
          <ActionCard
            title="Misiones"
            description="Pon a prueba lo que has aprendido."
            icon="🎯"
            onPress={() => navigation.navigate('Misiones')}
          />
          
          <ActionCard
            title="Mi perfil"
            description="Consulta tu cuenta y progreso."
            icon="👤"
            onPress={() => navigation.navigate('Perfil')}
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

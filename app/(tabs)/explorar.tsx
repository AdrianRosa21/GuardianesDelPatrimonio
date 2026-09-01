import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

type MenuCardProps = {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
};

function MenuCard({
  icon,
  title,
  description,
  onPress,
}: MenuCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>

      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function ExplorarScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🏺</Text>

          <Text style={styles.title}>
            Exploración cultural
          </Text>

          <Text style={styles.subtitle}>
            Descubre países, tradiciones, gastronomía, historia y patrimonio
            cultural.
          </Text>
        </View>

        <MenuCard
          icon="🌎"
          title="Explorar países"
          description="Conoce el patrimonio cultural de diferentes países."
          onPress={() => router.push('/cultura/paises')}
        />

        <MenuCard
          icon="🗂️"
          title="Categorías culturales"
          description="Explora gastronomía, historia, tradiciones y más."
          onPress={() => router.push('/cultura/categorias')}
        />

        <MenuCard
          icon="❤️"
          title="Mis favoritos"
          description="Consulta el patrimonio cultural que has guardado."
          onPress={() => router.push('/cultura/favoritos')}
        />

        <MenuCard
          icon="🏆"
          title="Ranking"
          description="Mira quiénes son los Guardianes con más puntos."
          onPress={() => router.push('/cultura/ranking')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: spacing.l,
    paddingBottom: spacing.xxl,
  },

  header: {
    marginTop: spacing.l,
    marginBottom: spacing.xl,
  },

  headerIcon: {
    fontSize: 54,
    marginBottom: spacing.s,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.s,
  },

  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    lineHeight: 23,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: colors.surface,

    padding: spacing.m,
    borderRadius: 16,
    marginBottom: spacing.m,

    elevation: 3,

    shadowColor: colors.black,
    shadowOpacity: 0.06,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 6,
  },

  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,

    backgroundColor: colors.background,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: spacing.m,
  },

  icon: {
    fontSize: 29,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },

  cardDescription: {
    color: colors.textLight,
    lineHeight: 19,
  },

  arrow: {
    fontSize: 31,
    color: colors.primary,
    marginLeft: spacing.s,
  },
});
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';
import PrimaryButton from '../../components/common/PrimaryButton';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const ConfirmEmailScreen = ({ navigation, route }) => {
  const { email } = route.params || {};
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    if (!email) {
      Alert.alert('Error', 'No se encontró el correo para reenviar.');
      return;
    }

    try {
      setIsResending(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Éxito', 'Se ha reenviado el correo de confirmación.');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al reenviar el correo');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Confirma tu correo</Text>
        
        <Text style={styles.subtitle}>
          Hemos enviado un enlace de confirmación a:
        </Text>
        
        <Text style={styles.emailText}>{email}</Text>

        <Text style={styles.infoText}>
          Por favor, revisa tu bandeja de entrada (y la carpeta de spam) y haz clic en el enlace para activar tu cuenta.
        </Text>

        <PrimaryButton
          title={isResending ? "Reenviando..." : "Reenviar correo"}
          onPress={handleResend}
          disabled={isResending}
          style={styles.resendButton}
        />

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.backButtonText}>Volver al inicio de sesión</Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.l,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.s,
  },
  emailText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.l,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  resendButton: {
    width: '100%',
    marginBottom: spacing.l,
  },
  backButton: {
    padding: spacing.m,
  },
  backButtonText: {
    color: colors.secondary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ConfirmEmailScreen;

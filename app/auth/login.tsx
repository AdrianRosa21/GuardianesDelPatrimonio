import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import FormInput from '../../src/components/common/FormInput';
import PrimaryButton from '../../src/components/common/PrimaryButton';
import { validateEmail, validatePassword } from '../../src/utils/validators';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { supabase } from '../../lib/supabase';

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string | null; password?: string | null; general?: string | null }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({ email: emailError, password: passwordError });

    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
      return;
    }

    if (emailError || passwordError) {
      return;
    }

    try {
      setIsSubmitting(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        if (error.message === 'Email not confirmed') {
          router.push({ pathname: '/auth/confirmar_correo', params: { email: email.trim() } });
        } else {
          Alert.alert('Error de autenticación', error.message);
        }
      } else if (data.user) {
        // AppLayout (_layout.tsx) redirects automatically based on auth state change.
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title} accessibilityRole="header">
              ¡Hola Guardián! 👋
            </Text>
            <Text style={styles.subtitle}>
              Inicia sesión para continuar tu aventura.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <FormInput
              label="Correo electrónico"
              placeholder="tu@correo.com"
              value={email}
              onChangeText={(text: string) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              error={errors.email || undefined}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <FormInput
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChangeText={(text: string) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              error={errors.password || undefined}
              secureTextEntry={true}
            />

            {errors.general && (
              <Text style={styles.generalErrorText} accessibilityRole="alert">
                {errors.general}
              </Text>
            )}

            <PrimaryButton
              title={isSubmitting ? "Iniciando..." : "Iniciar sesión"}
              onPress={handleLogin}
              disabled={isSubmitting}
              style={styles.loginButton}
            />

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
              <TouchableOpacity
                onPress={() => router.push('/auth/registro')}
                accessibilityRole="button"
                accessibilityLabel="Ir a crear cuenta"
                style={styles.touchableArea}
              >
                <Text style={styles.linkText}>Crear cuenta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.l,
  },
  headerContainer: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.s,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  loginButton: {
    marginTop: spacing.m,
  },
  generalErrorText: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.m,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    color: colors.text,
    fontSize: 15,
  },
  touchableArea: {
    padding: spacing.xs,
  },
  linkText: {
    color: colors.secondary,
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default LoginScreen;
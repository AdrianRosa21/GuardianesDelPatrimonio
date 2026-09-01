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
import { validateName, validateEmail, validatePassword } from '../../src/utils/validators';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { supabase } from '../../lib/supabase';

const RegisterScreen = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState<{ 
    name?: string | null; 
    email?: string | null; 
    password?: string | null; 
    confirmPassword?: string | null;
    general?: string | null;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    let confirmError = null;
    if (password !== confirmPassword) {
      confirmError = 'Las contraseñas no coinciden.';
    } else if (!confirmPassword) {
      confirmError = 'Debes confirmar tu contraseña.';
    }

    setErrors({ 
      name: nameError, 
      email: emailError, 
      password: passwordError,
      confirmPassword: confirmError
    });

    if (!email || !password || !name) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (nameError || emailError || passwordError || confirmError) {
      return;
    }

    try {
      setIsSubmitting(true);
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            nombre_completo: name.trim(),
            nombre_usuario: name.trim().split(' ')[0], // Usamos el primer nombre como fallback
          },
        },
      });

      if (error) {
        Alert.alert('Error de registro', error.message);
      } else {
        // Registro exitoso, redirigimos a confirmar correo
        router.push({ pathname: '/auth/confirmar_correo', params: { email: email.trim() } });
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al registrar usuario');
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
              Únete a los Guardianes
            </Text>
            <Text style={styles.subtitle}>
              Crea tu cuenta para comenzar a explorar el patrimonio cultural.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <FormInput
              label="Nombre completo"
              placeholder="Ej. María López"
              value={name}
              onChangeText={(text: string) => {
                setName(text);
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              error={errors.name || undefined}
              autoCapitalize="words"
            />

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
              placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 número"
              value={password}
              onChangeText={(text: string) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              error={errors.password || undefined}
              secureTextEntry={true}
            />

            <FormInput
              label="Confirmar contraseña"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChangeText={(text: string) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
              }}
              error={errors.confirmPassword || undefined}
              secureTextEntry={true}
            />

            {errors.general && (
              <Text style={styles.generalErrorText} accessibilityRole="alert">
                {errors.general}
              </Text>
            )}

            <PrimaryButton
              title={isSubmitting ? "Registrando..." : "Crear cuenta"}
              onPress={handleRegister}
              disabled={isSubmitting}
              style={styles.registerButton}
            />

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
              <TouchableOpacity
                onPress={() => router.push('/auth/login')}
                accessibilityRole="button"
                accessibilityLabel="Ir a iniciar sesión"
                style={styles.touchableArea}
              >
                <Text style={styles.linkText}>Iniciar sesión</Text>
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
    marginTop: spacing.m,
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
  registerButton: {
    marginTop: spacing.s,
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
    marginTop: spacing.l,
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

export default RegisterScreen;
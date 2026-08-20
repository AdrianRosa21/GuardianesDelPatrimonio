import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import FormInput from '../../components/common/FormInput';
import PrimaryButton from '../../components/common/PrimaryButton';
import { validateName, validateEmail, validatePassword } from '../../utils/validators';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const RegisterScreen = ({ navigation }) => {
  const { register } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState({ 
    name: null, 
    email: null, 
    password: null, 
    confirmPassword: null 
  });
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

    if (nameError || emailError || passwordError || confirmError) {
      return;
    }

    try {
      setIsSubmitting(true);
      await register(name.trim(), email.trim(), password);
      // Navigation is handled automatically by AppNavigator listening to AuthContext
    } catch (error) {
      setErrors({ ...errors, general: error.message || 'Error al registrar usuario' });
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
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              error={errors.name}
              autoCapitalize="words"
            />

            <FormInput
              label="Correo electrónico"
              placeholder="tu@correo.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <FormInput
              label="Contraseña"
              placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 número"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              error={errors.password}
              secureTextEntry={true}
            />

            <FormInput
              label="Confirmar contraseña"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
              }}
              error={errors.confirmPassword}
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
                onPress={() => navigation.navigate('Login')}
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

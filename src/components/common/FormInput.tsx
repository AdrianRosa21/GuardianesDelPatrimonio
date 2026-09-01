import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, TextInputProps, StyleProp, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
  style?: StyleProp<ViewStyle>;
}

const FormInput = ({
  label,
  error,
  secureTextEntry,
  style,
  accessibilityLabel,
  ...props
}: FormInputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  const isPassword = secureTextEntry !== undefined && secureTextEntry !== false;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label} accessibilityRole="text">
          {label}
        </Text>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            error && styles.inputError,
            isPassword && styles.inputWithIcon
          ]}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={isPassword && !isPasswordVisible}
          accessibilityLabel={accessibilityLabel || label || 'Input field'}
          aria-invalid={!!error}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={togglePasswordVisibility}
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <Text style={styles.iconText}>
              {isPasswordVisible ? 'Ocultar' : 'Mostrar'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text
          style={styles.errorText}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.m,
  },
  label: {
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.s,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.m,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  inputWithIcon: {
    paddingRight: 80, // Espacio para el botón de mostrar/ocultar
  },
  iconContainer: {
    position: 'absolute',
    right: spacing.m,
    height: '100%',
    justifyContent: 'center',
  },
  iconText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});

export default FormInput;

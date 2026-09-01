// src/utils/validators.ts

export const validateEmail = (email: string) => {
  if (!email || email.trim() === '') {
    return 'El correo electrónico es obligatorio.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Ingresa un correo electrónico válido.';
  }
  return null;
};

export const validatePassword = (password: string) => {
  if (!password) {
    return 'La contraseña es obligatoria.';
  }
  if (password.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'La contraseña debe incluir al menos una letra mayúscula.';
  }
  if (!/[a-z]/.test(password)) {
    return 'La contraseña debe incluir al menos una letra minúscula.';
  }
  if (!/[0-9]/.test(password)) {
    return 'La contraseña debe incluir al menos un número.';
  }
  return null;
};

export const validateName = (name: string) => {
  if (!name || name.trim() === '') {
    return 'El nombre es obligatorio.';
  }
  const trimmedName = name.trim();
  if (trimmedName.length < 2) {
    return 'El nombre debe tener al menos 2 caracteres.';
  }
  if (trimmedName.length > 50) {
    return 'El nombre no puede exceder los 50 caracteres.';
  }
  return null;
};

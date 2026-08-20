import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

const USER_STORAGE_KEY = '@guardianes_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurar sesión cuando la app inicia
  const restoreSession = async () => {
    try {
      setIsLoading(true);
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (storedUser !== null) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error al restaurar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const login = async (email, password) => {
    try {
      // En una app real, aquí validarías con un backend.
      // Para este prototipo, simulamos un inicio de sesión exitoso.
      const mockUser = {
        name: 'Usuario Guardián', // Nombre por defecto
        email: email,
      };
      
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error durante el login:', error);
      throw new Error('No se pudo iniciar sesión');
    }
  };

  const register = async (name, email, password) => {
    try {
      // En una app real, enviarías esto a un backend.
      // NUNCA guardes contraseñas reales en AsyncStorage.
      const newUser = {
        name,
        email,
      };
      
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error durante el registro:', error);
      throw new Error('No se pudo crear la cuenta');
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        restoreSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

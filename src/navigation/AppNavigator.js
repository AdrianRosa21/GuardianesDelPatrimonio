import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthContext } from '../context/AuthContext';

// Auth Screens
import SplashScreen from '../modules/auth/SplashScreen';
import LoginScreen from '../modules/auth/LoginScreen';
import RegisterScreen from '../modules/auth/RegisterScreen';
import ConfirmEmailScreen from '../modules/auth/ConfirmEmailScreen';

// Main App
import MainTabs from './MainTabs';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Main App Navigation
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          // Authentication Navigation
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ 
                headerShown: true, 
                title: 'Crear cuenta',
                headerBackTitle: 'Volver'
              }} 
            />
            <Stack.Screen 
              name="ConfirmEmail" 
              component={ConfirmEmailScreen} 
              options={{ 
                headerShown: true, 
                title: 'Confirmar correo',
                headerBackTitle: 'Volver'
              }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

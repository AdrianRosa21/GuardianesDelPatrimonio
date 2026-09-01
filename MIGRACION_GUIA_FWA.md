# Migración a Expo Router y TypeScript - Guardianes del Patrimonio

## 1. Estructura Anterior
El proyecto originalmente utilizaba una estructura monolítica controlada por `App.js` con React Navigation (`@react-navigation/native-stack` y `@react-navigation/bottom-tabs`). Los archivos estaban escritos en JavaScript (`.js`), las rutas estaban declaradas en `src/navigation/AppNavigator.js` y el estado de la sesión se controlaba globalmente en un contexto personalizado (`AuthContext`).

## 2. Diferencias con la Guía
A diferencia del patrón establecido en la guía:
- La navegación se gestionaba manualmente.
- No se utilizaban rutas basadas en el sistema de archivos de Expo.
- El proyecto no estaba tipado con TypeScript.
- El contexto de autenticación verificaba manualmente Supabase, en lugar de usar la redirección automática en los layouts.

## 3. Archivos Eliminados
Se eliminaron por completo las dependencias y archivos innecesarios de la arquitectura anterior:
- `App.js`
- `index.js`
- Directorio `src/navigation/` (AppNavigator y MainTabs)
- Directorio `src/context/` (AuthContext)
- Directorios de pantallas (`src/screens`, `src/modules`) que han sido migrados.

## 4. Archivos Migrados a TypeScript
Todos los archivos restantes en el proyecto se convirtieron a `.ts` y `.tsx`:
- `src/components/common/FormInput.js` ➔ `FormInput.tsx`
- `src/components/common/PrimaryButton.js` ➔ `PrimaryButton.tsx`
- `src/theme/colors.js` ➔ `colors.ts`
- `src/theme/spacing.js` ➔ `spacing.ts`
- `src/utils/validators.js` ➔ `validators.ts`
- `src/lib/supabase.js` ➔ `lib/supabase.ts`

## 5. Nueva Estructura de Rutas
Expo Router reemplazó `React Navigation`. Se creó el directorio `app/`:

```
app/
├── _layout.tsx (Controlador de Sesión)
├── index.tsx (Redirección inicial)
├── auth/
│   ├── login.tsx
│   ├── registro.tsx
│   └── confirmar_correo.tsx
└── (tabs)/
    ├── _layout.tsx (Barra de Navegación Inferior)
    ├── inicio.tsx
    ├── explorar.tsx
    ├── misiones.tsx
    └── perfil.tsx
```

## 6. Expo Router
Expo Router maneja la navegación utilizando la estructura del sistema de archivos, haciendo la configuración de los componentes de navegación manual obsoleta. El archivo `app.json` fue modificado para admitir los deep links requeridos `scheme: "guardianespatrimonio"` y añadir el plugin `expo-router`. El `package.json` fue actualizado para usar `expo-router/entry`.

## 7. Autenticación en `app/_layout.tsx`
`app/_layout.tsx` actúa como el nuevo protector de rutas global y sustituye a `AuthContext`.
- Verifica el inicio de sesión vía `supabase.auth.getSession()` y `supabase.auth.onAuthStateChange()`.
- Utiliza `useSegments` para saber si el usuario intenta acceder a `/auth/` o a un área protegida `/(tabs)/`.
- Si un usuario no está logueado e intenta entrar en las pestañas principales, será expulsado a `/auth/login`. Si inicia sesión, es redirigido a `/(tabs)/inicio`.

## 8. Inicialización de Supabase
El archivo `lib/supabase.ts` se trasladó y tipó. Emplea `AsyncStorage` de React Native para persistir la sesión.

## 9. Variables de Entorno
Se utilizan `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Si se agregan nuevas, deben incluir el prefijo `EXPO_PUBLIC_` para funcionar en cliente.

## 10. Dependencias y Cambios de Versión
**Instaladas:**
- `expo-router`, `react-native-safe-area-context`, `react-native-screens`, `expo-linking`, `expo-constants`, `expo-status-bar`
- Tipos de TypeScript (`typescript`, `@types/react`, `@types/react-native`, `@types/node`).

**Eliminadas (En la arquitectura base):**
- Uso explícito en código de `@react-navigation/*`

## 11. Cómo iniciar el proyecto
Simplemente ejecutar:
```bash
npx expo start -c
```

## 12. Problemas / Pendientes
- Todas las rutas están conectadas y TypeScript compila correctamente con `npx tsc --noEmit`. No hay errores pendientes reportados por el compilador.
- Las dependencias se configuraron correctamente con modo `--legacy-peer-deps` para evitar conflictos con React 19 instalados previamente por Expo 54.
- Se ha respetado rigurosamente el diseño, lógica de UI, los mensajes de error y validaciones anteriores.
# Guardianes del Patrimonio

Aplicación móvil educativa para explorar el patrimonio cultural de diferentes países, incluyendo gastronomía, tradiciones, lugares, personajes, artesanías e historia. Este proyecto incluye gamificación mediante misiones y trivias.

## Tecnologías

* React Native
* Expo
* React Navigation
* Context API
* AsyncStorage

## Instalación

```bash
npm install
```

## Ejecutar

```bash
npx expo start
```

## Estructura del equipo

* **Persona 1**: Autenticación, perfil y navegación. (Implementado en este hito)
* **Persona 2**: Exploración cultural. (Pendiente)
* **Persona 3**: Gamificación. (Pendiente)

## Estructura de carpetas

* `/src/components/common`: Componentes reutilizables de UI (botones, inputs).
* `/src/context`: Estado global (ej. AuthContext).
* `/src/navigation`: Configuración de navegación (Stack y Tabs).
* `/src/theme`: Colores y espaciado centralizados.
* `/src/utils`: Funciones utilitarias (validadores).
* `/src/modules/auth`: Pantallas de sesión, registro y perfil (Persona 1).
* `/src/modules/culture`: Pantallas de exploración cultural (Persona 2).
* `/src/modules/gamification`: Pantallas de misiones y trivias (Persona 3).
* `/src/screens`: Pantallas principales compartidas (Inicio).

## Flujo actual

Splash → Login/Registro → Inicio → Explorar/Misiones/Perfil

## Estado actual

* **Persona 1**: La estructura base, el flujo de autenticación, la navegación y el perfil están completos.
* **Persona 2 & 3**: Los módulos `Culture` y `Gamification` son actualmente placeholders funcionales listos para ser implementados por los respectivos integrantes. No generan conflictos con la navegación base.

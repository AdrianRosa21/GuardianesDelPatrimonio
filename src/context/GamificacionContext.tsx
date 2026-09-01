// src/context/GamificacionContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';
import { misiones, niveles, insignias, Nivel, Insignia } from '../data/misiones';

const STORAGE_KEY = '@guardianes_progreso';

// La tabla del ranking es 'perfiles' y su llave de usuario es la columna 'id'
// (coincide con auth.uid). Cada usuario ya tiene su fila al registrarse, por eso
// se ACTUALIZA (update) en lugar de crear. Los puntos se reemplazan por el total
// exacto que lleva este módulo.
const SINCRONIZAR_CON_SUPABASE = true;

const TABLA_PUNTOS = 'perfiles';
const COLUMNA_ID_USUARIO = 'id';
const COLUMNA_PUNTOS = 'puntos';
const COLUMNA_NIVEL = 'nivel';

interface Progreso {
  puntos: number;
  misionesCompletadas: string[];
}

interface GamificacionContextType {
  puntos: number;
  misionesCompletadas: string[];
  nivelActual: Nivel;
  insigniasDesbloqueadas: Insignia[];
  paisesDescubiertos: number;
  totalMisiones: number;
  cargando: boolean;
  completarMision: (misionId: string, puntosGanados: number) => void;
  estaCompletada: (misionId: string) => boolean;
  reiniciarProgreso: () => void;
}

const GamificacionContext = createContext<GamificacionContextType | undefined>(undefined);

// Calcula el nivel según la misma fórmula que usa la base de datos del ranking:
// nivel = 1 + floor(puntos / 300), limitado al nivel máximo definido en 'niveles'.
// Así el nivel que muestra la app siempre coincide con el del ranking.
const calcularNivel = (puntos: number): Nivel => {
  const nivelMaximo = niveles[niveles.length - 1];
  const numeroNivel = Math.min(1 + Math.floor(puntos / 300), nivelMaximo.nivel);
  return niveles.find((n) => n.nivel === numeroNivel) || niveles[0];
};

export const GamificacionProvider = ({ children }: { children: React.ReactNode }) => {
  const [puntos, setPuntos] = useState(0);
  const [misionesCompletadas, setMisionesCompletadas] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarProgreso = async () => {
      try {
        const guardado = await AsyncStorage.getItem(STORAGE_KEY);
        if (guardado) {
          const progreso: Progreso = JSON.parse(guardado);
          setPuntos(progreso.puntos || 0);
          setMisionesCompletadas(progreso.misionesCompletadas || []);
        }
      } catch (error) {
        console.error('Error al cargar el progreso:', error);
      } finally {
        setCargando(false);
      }
    };
    cargarProgreso();
  }, []);

  const guardarProgreso = async (nuevosPuntos: number, nuevasMisiones: string[]) => {
    try {
      const progreso: Progreso = { puntos: nuevosPuntos, misionesCompletadas: nuevasMisiones };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progreso));
    } catch (error) {
      console.error('Error al guardar el progreso:', error);
    }
  };

  // Sincroniza puntos y nivel con Supabase (para el ranking).


  const sincronizarConSupabase = async (nuevosPuntos: number) => {
    if (!SINCRONIZAR_CON_SUPABASE) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const nivel = calcularNivel(nuevosPuntos).nivel;

      const { error } = await supabase
        .from(TABLA_PUNTOS)
        .update({
          [COLUMNA_PUNTOS]: nuevosPuntos,
          [COLUMNA_NIVEL]: nivel,
        })
        .eq(COLUMNA_ID_USUARIO, user.id);

      if (error) {
        console.error('No se pudo sincronizar con el ranking:', error.message);
      }
    } catch (error) {
      console.error('Error de sincronización con Supabase:', error);
    }
  };

  const completarMision = (misionId: string, puntosGanados: number) => {
    if (misionesCompletadas.includes(misionId)) return;
    const nuevasMisiones = [...misionesCompletadas, misionId];
    const nuevosPuntos = puntos + puntosGanados;
    setMisionesCompletadas(nuevasMisiones);
    setPuntos(nuevosPuntos);
    guardarProgreso(nuevosPuntos, nuevasMisiones);
    sincronizarConSupabase(nuevosPuntos);
  };

  const estaCompletada = (misionId: string) => misionesCompletadas.includes(misionId);

  const reiniciarProgreso = () => {
    setPuntos(0);
    setMisionesCompletadas([]);
    guardarProgreso(0, []);
    sincronizarConSupabase(0);
  };

  const nivelActual = calcularNivel(puntos);
  const insigniasDesbloqueadas = insignias.filter(
    (i) => misionesCompletadas.length >= i.requisitoMisiones
  );
  const paisesDescubiertos = misionesCompletadas.length;

  return (
    <GamificacionContext.Provider
      value={{
        puntos,
        misionesCompletadas,
        nivelActual,
        insigniasDesbloqueadas,
        paisesDescubiertos,
        totalMisiones: misiones.length,
        cargando,
        completarMision,
        estaCompletada,
        reiniciarProgreso,
      }}
    >
      {children}
    </GamificacionContext.Provider>
  );
};

export const useGamificacion = () => {
  const context = useContext(GamificacionContext);
  if (!context) {
    throw new Error('useGamificacion debe usarse dentro de un GamificacionProvider');
  }
  return context;
};
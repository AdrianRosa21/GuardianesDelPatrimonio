import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';
import { misiones, niveles, insignias, Nivel, Insignia } from '../data/misiones';

const STORAGE_KEY = '@guardianes_progreso';

// Ponlo en true cuando William confirme el nombre de la tabla y columnas de puntos.
const SINCRONIZAR_CON_SUPABASE = false;
const TABLA_PUNTOS = 'usuarios';
const COLUMNA_ID_USUARIO = 'id_usuario';
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

const calcularNivel = (puntos: number): Nivel => {
  return [...niveles].reverse().find((n) => puntos >= n.puntosMinimos) || niveles[0];
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

  const sincronizarConSupabase = async (nuevosPuntos: number) => {
    if (!SINCRONIZAR_CON_SUPABASE) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const nivel = calcularNivel(nuevosPuntos).nivel;
      const { error } = await supabase
        .from(TABLA_PUNTOS)
        .upsert(
          { [COLUMNA_ID_USUARIO]: user.id, [COLUMNA_PUNTOS]: nuevosPuntos, [COLUMNA_NIVEL]: nivel },
          { onConflict: COLUMNA_ID_USUARIO }
        );
      if (error) console.error('No se pudo sincronizar con el ranking:', error.message);
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
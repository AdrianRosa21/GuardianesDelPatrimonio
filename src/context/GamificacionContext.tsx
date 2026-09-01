// src/context/GamificacionContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';
import { misiones, niveles, insignias, Nivel, Insignia } from '../data/misiones';

const STORAGE_KEY = '@guardianes_progreso';
const SINCRONIZAR_CON_SUPABASE = true;

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

  const registrarEnSupabase = async (misionId: string, nuevosPuntos: number) => {
    if (!SINCRONIZAR_CON_SUPABASE) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Actualizar los puntos totales y nivel en el perfil del usuario (Ranking)
      const nivel = calcularNivel(nuevosPuntos).nivel;
      const { error: errorPerfil } = await supabase
        .from('perfiles')
        .update({ puntos: nuevosPuntos, nivel: nivel })
        .eq('id', user.id);

      if (errorPerfil) {
        console.error('Error al actualizar puntos en perfil:', errorPerfil.message);
      }

      // 2. Registrar la misión específica en progreso_mision
      const mision = misiones.find((m) => m.id === misionId);
      if (!mision) return;

      const { data: misionDB, error: errorBusqueda } = await supabase
        .from('misiones')
        .select('id_mision')
        .eq('titulo', mision.titulo)
        .maybeSingle();

      if (errorBusqueda || !misionDB) {
        console.warn('La misión no está en la base todavía:', mision.titulo);
        return;
      }

      const { error: errorProgreso } = await supabase
        .from('progreso_mision')
        .upsert(
          {
            id_usuario: user.id,
            id_mision: misionDB.id_mision,
            estado: 'completada',
            puntos_obtenidos: mision.puntos,
            fecha_completado: new Date().toISOString(),
          },
          { onConflict: 'id_usuario,id_mision' }
        );

      if (errorProgreso) {
        console.error('No se pudo registrar el progreso de la misión:', errorProgreso.message);
      }
    } catch (error) {
      console.error('Error al sincronizar con Supabase:', error);
    }
  };

  const completarMision = (misionId: string, puntosGanados: number) => {
    if (misionesCompletadas.includes(misionId)) return;
    const nuevasMisiones = [...misionesCompletadas, misionId];
    const nuevosPuntos = puntos + puntosGanados;
    setMisionesCompletadas(nuevasMisiones);
    setPuntos(nuevosPuntos);
    guardarProgreso(nuevosPuntos, nuevasMisiones);
    
    // Llamar a registrarEnSupabase con los nuevos puntos para que actualice ambas tablas
    registrarEnSupabase(misionId, nuevosPuntos);
  };

  const estaCompletada = (misionId: string) => misionesCompletadas.includes(misionId);

  const reiniciarProgreso = () => {
    setPuntos(0);
    setMisionesCompletadas([]);
    guardarProgreso(0, []);
    
    // Opcional: Reiniciar puntos en supabase
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) supabase.from('perfiles').update({ puntos: 0, nivel: 1 }).eq('id', user.id);
    });
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
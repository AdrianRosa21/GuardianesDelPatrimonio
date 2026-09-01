// src/data/misiones.ts
export interface Pregunta {
  id: string;
  enunciado: string;
  opciones: string[];
  respuestaCorrecta: number;
  explicacion: string;
}

export interface Mision {
  id: string;
  pais: string;
  bandera: string;
  titulo: string;
  descripcion: string;
  puntos: number;
  preguntas: Pregunta[];
}

export const misiones: Mision[] = [
  {
    id: 'sv',
    pais: 'El Salvador',
    bandera: '🇸🇻',
    titulo: 'Conoce El Salvador',
    descripcion: 'Descubre el patrimonio cultural del pulgarcito de América.',
    puntos: 150,
    preguntas: [
      {
        id: 'sv-1',
        enunciado: '¿Cuál de estos es un sitio arqueológico salvadoreño?',
        opciones: ['Joya de Cerén', 'Machu Picchu', 'Chichén Itzá'],
        respuestaCorrecta: 0,
        explicacion:
          'Joya de Cerén es un sitio maya en El Salvador, declarado Patrimonio de la Humanidad por la UNESCO. Se le conoce como la "Pompeya de América".',
      },
      {
        id: 'sv-2',
        enunciado: '¿Cuál es el plato típico más representativo de El Salvador?',
        opciones: ['Tacos', 'Pupusas', 'Arepas'],
        respuestaCorrecta: 1,
        explicacion:
          'La pupusa es el plato nacional de El Salvador. Incluso tiene su propio día nacional, el segundo domingo de noviembre.',
      },
      {
        id: 'sv-3',
        enunciado: '¿Qué volcán es un símbolo de la ciudad de San Salvador?',
        opciones: ['Volcán de Izalco', 'Volcán Arenal', 'Volcán Poás'],
        respuestaCorrecta: 0,
        explicacion:
          'El Volcán de Izalco fue conocido como "El Faro del Pacífico" por su actividad constante durante casi dos siglos.',
      },
    ],
  },
  {
    id: 'gt',
    pais: 'Guatemala',
    bandera: '🇬🇹',
    titulo: 'Explora Guatemala',
    descripcion: 'Adéntrate en el corazón del mundo maya.',
    puntos: 150,
    preguntas: [
      {
        id: 'gt-1',
        enunciado: '¿Cuál es la antigua ciudad maya más famosa de Guatemala?',
        opciones: ['Tikal', 'Teotihuacán', 'Copán'],
        respuestaCorrecta: 0,
        explicacion:
          'Tikal es una de las ciudades mayas más grandes y mejor conservadas, ubicada en la selva del Petén.',
      },
      {
        id: 'gt-2',
        enunciado: '¿Qué prenda tradicional tejen las mujeres guatemaltecas?',
        opciones: ['El huipil', 'El poncho', 'La boina'],
        respuestaCorrecta: 0,
        explicacion:
          'El huipil es una blusa tradicional tejida a mano; sus colores y diseños identifican la comunidad de origen.',
      },
      {
        id: 'gt-3',
        enunciado: '¿Cuál es la moneda oficial de Guatemala?',
        opciones: ['El colón', 'El quetzal', 'El lempira'],
        respuestaCorrecta: 1,
        explicacion:
          'El quetzal debe su nombre al ave nacional, considerada sagrada por los mayas por sus largas plumas verdes.',
      },
    ],
  },
  {
    id: 'mx',
    pais: 'México',
    bandera: '🇲🇽',
    titulo: 'Viaja por México',
    descripcion: 'Recorre una de las culturas más ricas de América.',
    puntos: 150,
    preguntas: [
      {
        id: 'mx-1',
        enunciado: '¿Qué civilización construyó la ciudad de Teotihuacán?',
        opciones: ['Los incas', 'Los teotihuacanos', 'Los guaraníes'],
        respuestaCorrecta: 1,
        explicacion:
          'Teotihuacán fue una de las mayores ciudades de Mesoamérica. Su nombre significa "lugar donde los dioses fueron creados".',
      },
      {
        id: 'mx-2',
        enunciado: '¿Qué celebración mexicana es Patrimonio Cultural Inmaterial de la Humanidad?',
        opciones: ['El Día de Muertos', 'El Carnaval', 'La Feria de Abril'],
        respuestaCorrecta: 0,
        explicacion:
          'El Día de Muertos fue reconocido por la UNESCO en 2008 por su profundo valor cultural y ancestral.',
      },
      {
        id: 'mx-3',
        enunciado: '¿Cuál es un platillo tradicional mexicano reconocido mundialmente?',
        opciones: ['El mole', 'El ceviche', 'La bandeja paisa'],
        respuestaCorrecta: 0,
        explicacion:
          'El mole es una salsa compleja que puede llevar más de 20 ingredientes, incluido el chocolate.',
      },
    ],
  },
];

export interface Nivel {
  nivel: number;
  nombre: string;
  puntosMinimos: number;
}

export const niveles: Nivel[] = [
  { nivel: 1, nombre: 'Aprendiz', puntosMinimos: 0 },
  { nivel: 2, nombre: 'Explorador', puntosMinimos: 300 },
  { nivel: 3, nombre: 'Aventurero', puntosMinimos: 600 },
  { nivel: 4, nombre: 'Guardián', puntosMinimos: 900 },
];

export interface Insignia {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
  requisitoMisiones: number;
}

export const insignias: Insignia[] = [
  {
    id: 'primer-paso',
    nombre: 'Primer paso',
    icono: '🌱',
    descripcion: 'Completa tu primera misión.',
    requisitoMisiones: 1,
  },
  {
    id: 'explorador',
    nombre: 'Explorador cultural',
    icono: '🧭',
    descripcion: 'Completa dos misiones.',
    requisitoMisiones: 2,
  },
  {
    id: 'guardian',
    nombre: 'Guardián del patrimonio',
    icono: '🏆',
    descripcion: 'Completa todas las misiones disponibles.',
    requisitoMisiones: 3,
  },
];
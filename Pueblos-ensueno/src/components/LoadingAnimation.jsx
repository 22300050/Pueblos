// Archivo: src/components/LoadingAnimation.jsx

import React from 'react';
import { motion } from 'framer-motion'; // Importamos la librería que instalaste

// --- A. Importamos las imágenes que guardaste en la carpeta de assets ---
import piramideIcon from '../assets/LoadingAnimation/piramide.png';
import vasijaIcon from '../assets/LoadingAnimation/artesanias.png';
import olmecaIcon from '../assets/LoadingAnimation/olmeca.png';
import iglesiaIcon from '../assets/LoadingAnimation/iglesia.png';

// --- B. Creamos una lista con las imágenes que se mostrarán en secuencia ---
const imageIcons = [
  piramideIcon,
  vasijaIcon,
  olmecaIcon,
  iglesiaIcon,
];

// --- C. Definimos las reglas de la animación ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.4, // El retraso entre la aparición de cada icono
    },
  },
};

const iconVariants = {
  hidden: {
    y: 20, // El icono empieza 20px más abajo de su posición final
    opacity: 0,
  },
  visible: {
    y: 0, // El icono sube a su posición final
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

// --- D. Creamos el componente que se mostrará ---
export default function LoadingAnimation() {
  return (
    // CAMBIO AQUÍ: El fondo ahora es bg-white
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <motion.div
        className="flex items-center gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {imageIcons.map((src, index) => (
          <motion.div key={index} variants={iconVariants}>
            <img 
              src={src} 
              alt={`Icono de carga ${index + 1}`} 
              className="h-12 w-12 sm:h-14 sm:w-14 object-contain"
            />
          </motion.div>
        ))}
      </motion.div>
      <p className="mt-8 text-lg font-semibold text-gray-700">Cargando...</p>
    </div>
  );
}
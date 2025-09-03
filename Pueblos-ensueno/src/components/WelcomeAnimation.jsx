// Archivo: src/components/WelcomeAnimation.jsx

import React from 'react';
import { motion } from 'framer-motion';

// --- Importa tus 4 imágenes ---
import elementosFlotantes from '../assets/welcome/elementos_flotantes.png'; 
import fondoEdificiosPiramide from '../assets/welcome/fondo_con_piramide_y_edificios.png';
import mujerIzquierdaPicado from '../assets/welcome/mujer_izquierda_con_papel_picado.png';
import mujerDerechaPicado from '../assets/welcome/mujer_derecha_con_papel_picado.png';

export default function WelcomeAnimation({ onAnimationComplete }) {
  const animationDuration = 3.5;
  const fadeOutDuration = 1;

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#FDF2E9] overflow-hidden" 
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: fadeOutDuration, delay: animationDuration }} 
      onAnimationComplete={onAnimationComplete}
    >
      <div className="relative w-screen h-screen"> 

        {/* Capa 1: Fondo (Pirámide y edificios) */}
        <motion.img 
          src={fondoEdificiosPiramide} 
          alt="Pirámide y edificios" 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[75%] h-auto z-10"
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Capa 2: Mujer Izquierda - REGRESADO A bottom-0 */}
        <motion.img 
          src={mujerIzquierdaPicado} 
          alt="Mujer de Tabasco con papel picado" 
          className="absolute bottom-0 left-0 h-[100%] w-auto z-20"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        />

        {/* Capa 2: Mujer Derecha - REGRESADO A bottom-0 */}
        <motion.img 
          src={mujerDerechaPicado} 
          alt="Mujer con traje de flores y papel picado" 
          className="absolute bottom-0 right-0 h-[100%] w-auto z-20"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        />
        
        {/* Capa 3: Elementos Flotantes - SOLAMENTE ESTE CON top-[5%] */}
        <motion.img 
          src={elementosFlotantes} 
          alt="Elementos culturales flotantes" 
          className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[50%] h-auto z-30"
          initial={{ y: -100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 10, delay: 1.5 }}
        />
      </div>
    </motion.div>
  );
}
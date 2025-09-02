// Archivo: src/hooks/useIsDesktop.js

import { useState, useEffect } from 'react';

// Este "hook" devuelve `true` si la pantalla es de escritorio (más de 1024px) y `false` si no.
export default function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    window.addEventListener('resize', handleResize);

    // Limpiamos el listener cuando el componente no se usa
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isDesktop;
}
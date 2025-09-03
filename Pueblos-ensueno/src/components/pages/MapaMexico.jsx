import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import svgUrl from '../../assets/svg/Mexico.svg?url';
import MapaTabasco from '../MapaTabasco';
import MapaChiapas from '../MapaChiapas';

function MapaMexico() {
  const containerRef = useRef(null);
  // Eliminamos x,y del estado del tooltip ya que no seguirá al cursor
  const [tooltip, setTooltip] = useState({ visible: false, name: '' });
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);

  const eventosPorEstado = {
    Tabasco: [
      { nombre: "Feria Tabasco 2025", fechas: "Del 27 de abril al 12 de mayo", icono: "🎉" },
      { nombre: "Festival del Cacao", fechas: "Del 15 al 20 de junio", icono: "🍫" },
      { nombre: "Carnaval de Villahermosa", fechas: "Febrero 2025", icono: "🎭" },
    ],
    Chiapas: [
      { nombre: "Festival de la Marimba", fechas: "Marzo", icono: "🎶" },
      { nombre: "Feria de San Marcos Tuxtla", fechas: "Abril", icono: "🎡" },
    ],
  };

  useEffect(() => {
    if (!estadoSeleccionado && containerRef.current) {
      fetch(svgUrl)
        .then((res) => res.text())
        .then((svg) => {
          containerRef.current.innerHTML = svg;
          const style = document.createElement('style');
          style.innerHTML = `
            #mapa-svg-container .hoverable-state {
              fill: white; 
              stroke: #A1A1AA;
              stroke-width: 1.5;
              transition: fill 0.2s ease-in-out;
            }
            #mapa-svg-container .map-hover {
              fill: #F39106;
            }
            #mapa-svg-container .hover-indirecto {
              fill: #2DD4BF;
            }
          `;
          containerRef.current.prepend(style);

          const paths = containerRef.current.querySelectorAll('path.hoverable-state');
          paths.forEach(path => {
            const title = path.querySelector('title')?.textContent || 'Estado';
            path.setAttribute('tabindex', '0');
            path.setAttribute('role', 'button');
            path.setAttribute('aria-label', `Ver detalles de ${title}`);

            const onEnter = () => { // Ya no necesitamos e.clientX, e.clientY
              path.classList.add('map-hover');
              setTooltip({ visible: true, name: title });
            };
            const onLeave = () => {
              path.classList.remove('map-hover');
              setTooltip({ visible: false, name: '' });
            };
            const onClick = () => setEstadoSeleccionado(title);
            const onKeyDown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } };
            
            path.addEventListener('mouseenter', onEnter, { passive: true });
            path.addEventListener('mouseleave', onLeave, { passive: true });
            path.addEventListener('click', onClick);
            path.addEventListener('keydown', onKeyDown);
          });
        });
    }
  }, [estadoSeleccionado]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new MutationObserver(() => {
      const mariposa = document.getElementById("mariposa-monarca");
      const michoacan = Array.from(document.querySelectorAll('path.hoverable-state'))
        .find(p => p.querySelector('title')?.textContent === "Michoacán");
      if (mariposa && michoacan) {
        const activar = () => michoacan.classList.add("hover-indirecto");
        const desactivar = () => michoacan.classList.remove("hover-indirecto");
        mariposa.addEventListener("mouseenter", activar);
        mariposa.addEventListener("mouseleave", desactivar);
        observer.disconnect(); 
      }
    });
    observer.observe(containerRef.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  if (estadoSeleccionado === 'Tabasco') {
    return <MapaTabasco estado="Tabasco" eventos={eventosPorEstado['Tabasco']} onRegresar={() => setEstadoSeleccionado(null)} />;
  }
  if (estadoSeleccionado === 'Chiapas') {
    return <MapaChiapas estado="Chiapas" eventos={eventosPorEstado['Chiapas']} onRegresar={() => setEstadoSeleccionado(null)} />;
  }

  return (
    <div className="w-full min-h-screen bg-[#EAEAEA] text-zinc-800 flex flex-col">
      <div className="text-center pt-12 pb-8 px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Explora <span className="text-[#F39106]">México</span>
        </h1>
        <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
          Descubre la riqueza cultural y los destinos imperdibles de cada estado.
        </p>
      </div>

      <main id="contenido-mapa" role="main" className="flex-1 w-full flex flex-col items-center justify-start p-4">
        <p id="instrucciones-mapa" className="sr-only">
          Usa Tab para navegar por los estados del mapa y presiona Enter para ver detalles. Pasa el cursor para ver el nombre del estado.
        </p>
        <div className="w-full max-w-5xl aspect-[5/6] sm:aspect-[4/3] relative">
          <div
            id="mapa-svg-container"
            ref={containerRef}
            className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
          />

          {/* --- TOOLTIP UNIFICADO Y FIJO ARRIBA DEL MAPA --- */}
          {tooltip.visible && (
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[calc(100%+15px)] 
                         bg-white text-zinc-800 text-sm p-2.5 rounded-lg shadow-xl 
                         border border-gray-200 z-50 pointer-events-none 
                         flex flex-col gap-1.5 min-w-[200px]" // Ancho mínimo para legibilidad
            >
              {/* Siempre se muestra el nombre del estado */}
              <div className="flex items-center gap-2 font-bold">
                <span className="text-lg leading-none" aria-hidden="true">📍</span>
                <span>{tooltip.name}</span>
              </div>

              {/* Solo se muestra si el estado es Tabasco */}
              {tooltip.name === 'Tabasco' && (
                <>
                  <hr className="border-gray-200 my-1" />
                  <div className="flex items-center gap-2 font-semibold text-gray-700">
                    <span className="text-lg" role="img" aria-label="Evento cultural">🎭</span>
                    <span>Evento cultural en curso</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MapaMexico;
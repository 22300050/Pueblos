import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import svgUrl from '../assets/MexicoSvg.svg?url';
import MapaTabasco from './MapaTabasco';
import logo from '../assets/Logo.png';
import { Menu } from 'lucide-react';


function MapaMexico() {
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, name: '', x: 0, y: 0 });
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const eventosPorEstado = {
    Tabasco: [
      {
        nombre: "Feria Tabasco 2025",
        fechas: "Del 27 de abril al 12 de mayo",
        descripcion: "La Feria Tabasco es una celebración tradicional que destaca la identidad y cultura del estado.",
        elementos: "Música, gastronomía, trajes típicos",
        actividades: "Desfiles, juegos mecánicos, pabellones culturales",
        icono: "🎉",
      },
      {
        nombre: "Festival del Cacao",
        fechas: "Del 15 al 20 de junio",
        descripcion: "Celebración del cacao tabasqueño con talleres, catas y recorridos por fincas.",
        elementos: "Chocolate artesanal, danza, historia",
        actividades: "Talleres de chocolate, visitas guiadas",
        icono: "🍫",
      },
      {
        nombre: "Carnaval de Villahermosa",
        fechas: "Febrero 2025",
        descripcion: "Colorido carnaval con desfiles, música y reinas de belleza regional.",
        elementos: "Danza, folclor, cultura popular",
        actividades: "Desfiles, comparsas, conciertos",
        icono: "🎭",
      },
    ],
  };

useEffect(() => {
  if (!estadoSeleccionado && containerRef.current) {
    fetch(svgUrl)
      .then((res) => res.text())
      .then((svg) => {
        // Inserta el SVG
        containerRef.current.innerHTML = svg;

        // Accesibilidad del contenedor
        containerRef.current.setAttribute('role', 'img');
        containerRef.current.setAttribute('aria-label', 'Mapa interactivo de México');
        containerRef.current.setAttribute('aria-describedby', 'instrucciones-mapa');

        const paths = containerRef.current.querySelectorAll('path.hoverable-state');

        paths.forEach(path => {
          const title = path.querySelector('title')?.textContent || 'Estado';
          // Hacer navegable y accesible
          path.setAttribute('tabindex', '0');
          path.setAttribute('role', 'button');
          path.setAttribute('aria-label', `Ver detalles de ${title}`);

          const onEnter = (e) => {
            setTooltip({ visible: true, name: title, x: e.clientX || 0, y: e.clientY || 0 });
          };
          const onLeave = () => {
            setTooltip({ visible: false, name: '', x: 0, y: 0 });
          };
          const onClick = () => {
            setEstadoSeleccionado(title);
            setMostrarFormulario(true);
          };
          const onKeyDown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick();
            }
          };
          const onFocus = () => {
  setTooltip({ visible: true, name: title, x: 0, y: 0 });
};
const onBlur = () => {
  setTooltip({ visible: false, name: '', x: 0, y: 0 });
};

path.addEventListener('focus', onFocus);
path.addEventListener('blur', onBlur);


          path.addEventListener('mouseenter', onEnter, { passive: true });
          path.addEventListener('mouseleave', onLeave, { passive: true });
          path.addEventListener('click', onClick);
          path.addEventListener('keydown', onKeyDown);
          // Limpieza al desmontar o cambiar estado
   
        });
      });
  }
}, [estadoSeleccionado]);

  useEffect(() => {
  const observer = new MutationObserver(() => {
    const mariposa = document.getElementById("mariposa-monarca");
    const michoacan = Array.from(document.querySelectorAll('path.hoverable-state'))
      .find(p => p.querySelector('title')?.textContent === "Michoacán");

    if (mariposa && michoacan) {
      const activar = () => michoacan.classList.add("hover-indirecto");
      const desactivar = () => michoacan.classList.remove("hover-indirecto");

      mariposa.addEventListener("mouseenter", activar);
      mariposa.addEventListener("mouseleave", desactivar);
      observer.disconnect(); // deja de observar cuando se encuentra
    }
  });

  if (containerRef.current) {
    observer.observe(containerRef.current, { childList: true, subtree: true });
  }

  return () => observer.disconnect();
}, []);


  if (estadoSeleccionado === 'Tabasco') {
    return (
      <MapaTabasco
        estado="Tabasco"
        eventos={eventosPorEstado['Tabasco']}
        onRegresar={() => {
          setEstadoSeleccionado(null);
          setMostrarFormulario(false);
        }}
      />
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-[var(--color-cuatro)] via-[var(--color-secondary)] to-[var(--color-verde)] flex flex-col">
<header className="sticky top-0 z-50 w-full py-4 px-6 flex justify-between items-center bg-[var(--color-primary)] shadow-md">
  {/* Skip link para accesibilidad: saltar al mapa */}
  <a href="#contenido-mapa" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white px-3 py-2 rounded">
    Saltar al contenido principal
  </a>

<Link to="/" className="flex items-center gap-4">
  <img src={logo} alt="Pueblos de Ensueño - Logotipo" className="h-10 sm:h-12 w-auto" />
  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wide drop-shadow-md text-black">
    Pueblos de Ensueño
  </h1>
</Link>

  
  <nav aria-label="Navegación principal" className="hidden md:flex gap-3 lg:gap-5 items-center">
<Link to="/">
  <button className="px-4 py-2 bg-[var(--orange-250)] hover:bg-[var(--color-secondary)] text-black rounded-full font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50">
    Ir al Home
  </button>
</Link>
  </nav>

  <button
    className="block md:hidden text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50"
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
    aria-expanded={mobileMenuOpen}
    aria-controls="menu-movil"
  >
    <Menu size={24} />
  </button>
</header>

{mobileMenuOpen && (
  <nav id="menu-movil" aria-label="Menú móvil" className="md:hidden bg-white shadow-md px-6 py-4 space-y-2 border-t border-black/10">
    {['/puntos-cercanos','/mapa','/InterestsSelector','/login'].map((path, i) => (
      <Link key={i} to={path}>
        <button className="w-full px-4 py-2 rounded-lg font-semibold bg-[var(--color-primary)] text-black hover:brightness-110 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50">
          {['Puntos cercanos','Mapa Interactivo','Invitado','Iniciar sesión'][i]}
        </button>
      </Link>
    ))}
  </nav>
)}
<main id="contenido-mapa" role="main" aria-label="Mapa de México interactivo" className="flex-1 w-full flex flex-col items-center justify-center overflow-hidden px-4 py-6">

  {/* Instrucciones para usuarios de teclado/lector */}
  <p id="instrucciones-mapa" className="sr-only">
    Usa Tab para navegar por los estados del mapa y presiona Enter para ver detalles. Pasa el cursor para ver el nombre del estado.
  </p>

  <div className="w-full max-w-5xl aspect-[5/6] sm:aspect-[4/3] relative">
    <div
      ref={containerRef}
      className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain [&>svg]:mx-auto [&>svg]:block"
    />

    {/* Aviso destacado para Tabasco (jerarquía visual del evento) */}
    {tooltip.visible && tooltip.name === 'Tabasco' && (
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 bg-white/95 text-gray-900 font-bold px-3 py-1 rounded-lg shadow-lg border border-pink-300 z-50"
        role="status" aria-live="polite"
      >
        🎭 Evento cultural en curso
      </div>
    )}

    {/* Tooltip general accesible */}
    {tooltip.visible && (
      <div
        className="absolute top-0 left-1/2 bg-yellow-300 text-gray-900 text-sm font-bold px-4 py-2 rounded-xl shadow-lg border-2 border-pink-400 animate-fade-in z-40 flex items-center gap-2 -translate-x-1/2"
        role="status" aria-live="polite"
      >
        <span className="text-lg" aria-hidden="true">🌸</span>
        <span>{tooltip.name}</span>
      </div>
    )}
  </div>
</main>


<footer className="text-center text-xs text-gray-700 pb-4 pt-4 w-full border-t border-black/10 bg-white/60">
  © 2025 Pueblos de ensueño — Colores y Cultura para el Mundo
</footer>

    </div>
  );
}

export default MapaMexico;

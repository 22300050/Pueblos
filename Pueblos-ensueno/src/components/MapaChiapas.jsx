// MapaChiapas.jsx
import React, { useEffect, useRef, useState } from 'react';
import chiapasSvg from '../assets/Chiapas.svg?raw';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png';
import { Menu } from 'lucide-react';

export default function MapaChiapas({ onRegresar, estado = 'Chiapas' }) {
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, name: '', x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [vistaMovil, setVistaMovil] = useState('mapa'); // 'mapa' | 'itinerario'
  const navigate = useNavigate();

  // ====== Dibuja el SVG y listeners (igual patrón que Tabasco) ======
  useEffect(() => {
    if (vistaMovil !== 'mapa') return;
    if (!containerRef.current) return;

    containerRef.current.innerHTML = chiapasSvg;

    const svg = containerRef.current.querySelector('svg');
    if (svg) {
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      svg.style.display = 'block';
    }

    const paths = containerRef.current.querySelectorAll('path, polygon');
    const handlers = [];
    paths.forEach((path) => {
      path.classList.add('hoverable-state'); // usa tu CSS de hover
      if (!path.getAttribute('stroke')) path.setAttribute('stroke', '#000');
      if (!path.getAttribute('stroke-width')) path.setAttribute('stroke-width', '2');
      path.setAttribute('stroke-linejoin', 'round');

      const titleTag = path.querySelector('title');
      const name = (titleTag?.textContent || path.getAttribute('id') || 'Municipio').trim();
      if (titleTag) titleTag.remove();

      const onEnter = (e) => {
        const r = containerRef.current.getBoundingClientRect();
        setTooltip({ visible: true, name, x: e.clientX - r.left, y: e.clientY - r.top });
      };
      const onMove = (e) => {
        const r = containerRef.current.getBoundingClientRect();
        setTooltip((t) => (t.visible ? { ...t, x: e.clientX - r.left, y: e.clientY - r.top } : t));
      };
      const onLeave = () => setTooltip({ visible: false, name: '', x: 0, y: 0 });
      const onClick = () => navigate(`/municipio/${name}`);

      path.addEventListener('mouseenter', onEnter);
      path.addEventListener('mousemove', onMove);
      path.addEventListener('mouseleave', onLeave);
      path.addEventListener('click', onClick);
      handlers.push({ path, onEnter, onMove, onLeave, onClick });
    });

    return () => {
      handlers.forEach(({ path, onEnter, onMove, onLeave, onClick }) => {
        path.removeEventListener('mouseenter', onEnter);
        path.removeEventListener('mousemove', onMove);
        path.removeEventListener('mouseleave', onLeave);
        path.removeEventListener('click', onClick);
      });
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [vistaMovil, navigate]);

  // ====== Formulario (panel derecho) – versión simple, mismo patrón de Tabasco ======
  const [formData, setFormData] = useState({
    dias: '', tipo: '', mes: '', intereses: '', email: ''
  });
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [errores, setErrores] = useState([]);

  const ItinerarioForm = () => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const errs = [];
        if (!formData.dias) errs.push('📅 Indica los días de viaje');
        if (!formData.tipo) errs.push('💰 Elige un presupuesto estimado');
        if (!formData.mes) errs.push('📆 Elige un mes');
        if (!fechaInicio || !fechaFin) errs.push('🗓 Selecciona fechas de viaje');
        if (errs.length) { setErrores(errs); return; }
        setErrores([]);
        const payload = {
          estado,
          dias: `${fechaInicio} a ${fechaFin}`,
          tipo: formData.tipo,
          mes: formData.mes,
          intereses: formData.intereses,
          email: formData.email
        };
        localStorage.setItem('itinerario', JSON.stringify(payload));
        navigate('/itinerario', { state: payload });
      }}
      className="flex flex-col gap-4 text-sm"
    >
      <label className="font-bold text-lg text-center">🐯 ITINERARIOS DE VIAJE</label>

      {errores.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3">
          <ul className="list-disc list-inside">{errores.map((m,i)=><li key={i}>{m}</li>)}</ul>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button type="button"
          onClick={() => setFormData(fd => ({ ...fd, dias: String(Math.max(1, (parseInt(fd.dias||'1')||1)-1)) }))}
          className="px-3 py-1 bg-gray-200 rounded-full text-lg font-bold hover:bg-gray-300">−</button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={formData.dias}
          onChange={(e)=>setFormData(fd=>({ ...fd, dias: e.target.value.replace(/\D/g,'') }))}
          placeholder="1"
          className="w-24 text-center border border-gray-300 rounded-full px-4 py-2"
        />
        <button type="button"
          onClick={() => setFormData(fd => ({ ...fd, dias: String(Math.min(30, (parseInt(fd.dias||'0')||0)+1)) }))}
          className="px-3 py-1 bg-gray-200 rounded-full text-lg font-bold hover:bg-gray-300">+</button>
      </div>

      <select value={formData.tipo} onChange={e=>setFormData(fd=>({ ...fd, tipo: e.target.value }))}
        className="w-full border border-gray-300 rounded-full px-4 py-2 bg-white" required>
        <option value="" disabled>💰 Presupuesto estimado</option>
        <option value="Económico">Económico</option>
        <option value="Moderado">Moderado</option>
        <option value="Confort">Confort</option>
        <option value="Lujo">Lujo</option>
      </select>

      <select value={formData.mes} onChange={e=>setFormData(fd=>({ ...fd, mes: e.target.value }))}
        className="w-full border border-gray-300 rounded-full px-4 py-2 bg-white" required>
        <option value="" disabled>📆 Selecciona un mes</option>
        {["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"].map(m=>(
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <select value=""
        onChange={(e)=>{
          const v = e.target.value;
          if (!v) return;
          if (v === 'Cerrar') { setFormData(fd=>({ ...fd, intereses: '' })); return; }
          const arr = (formData.intereses ? formData.intereses.split(', ').filter(Boolean) : []);
          if (!arr.includes(v)) setFormData(fd=>({ ...fd, intereses: [...arr, v].join(', ') }));
        }}
        className="w-full border border-gray-300 rounded-full px-4 py-2 bg-white">
        <option value="" disabled>🎯 Intereses</option>
        {["Naturaleza","Compras","Arte","Museos","Gastronomía","Aventura","Acceso gratuito","Cerrar"].map(opt=>(
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      {!!formData.intereses && (
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.intereses.split(', ').filter(Boolean).map((i,idx)=>(
            <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2">
              {i}
              <button type="button" onClick={()=>{
                const rest = formData.intereses.split(', ').filter(x=>x!==i).join(', ');
                setFormData(fd=>({ ...fd, intereses: rest }));
              }} className="text-red-500 hover:text-red-700 font-bold">✕</button>
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium text-gray-800">Fechas de viaje</label>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
          <input type="date" value={fechaInicio} onChange={e=>{setFechaInicio(e.target.value); setFechaFin('');}}
            className="w-full sm:w-[48%] border border-amber-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400" required />
          <span className="text-gray-600">→</span>
          <input type="date" value={fechaFin} onChange={e=>setFechaFin(e.target.value)} disabled={!fechaInicio}
            className="w-full sm:w-[48%] border border-amber-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100" required />
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button type="button" onClick={onRegresar} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-200">
          Regresar
        </button>
        <button type="submit" className="bg-yellow-400 text-black font-bold px-6 py-2 rounded-full hover:bg-yellow-500">
          CREAR
        </button>
      </div>

      <div className="flex justify-center gap-4 mt-4 text-xl text-gray-600">
        <i className="fab fa-facebook-square" />
        <i className="fab fa-twitter" />
        <i className="fab fa-instagram" />
        <i className="far fa-envelope" />
      </div>
    </form>
  );

  return (
    <>
      {/* HEADER (mismo estilo) */}
      <header className="sticky top-0 z-50 w-full py-4 px-6 flex justify-between items-center bg-[var(--color-primary)] shadow-md">
        <Link to="/" className="flex items-center gap-4">
          <img src={logo} alt="Pueblos de Ensueño - Logotipo" className="h-10 sm:h-12 w-auto" />
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wide drop-shadow-md text-black">
            Pueblos de Ensueño
          </h1>
        </Link>
        <nav className="hidden md:flex gap-3 lg:gap-5 items-center">
          <Link to="/">
            <button className="px-4 py-2 bg-[var(--orange-250)] hover:bg-[var(--color-secondary)] text-black rounded-full font-semibold shadow-sm transition">
              Ir al Home
            </button>
          </Link>
        </nav>
        <button className="block md:hidden text-gray-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu size={24} />
        </button>
      </header>

      {/* Toggle móvil Mapa / Itinerario */}
      <div className="md:hidden px-6 py-2">
        <div className="flex gap-2 rounded-full bg-white/80 p-1 shadow border">
          <button onClick={()=>setVistaMovil('mapa')}
            className={`flex-1 px-3 py-2 rounded-full ${vistaMovil==='mapa'?'bg-yellow-400 font-bold':''}`}>
            🗺️ Mapa
          </button>
          <button onClick={()=>setVistaMovil('itinerario')}
            className={`flex-1 px-3 py-2 rounded-full ${vistaMovil==='itinerario'?'bg-yellow-400 font-bold':''}`}>
            📋 Itinerario
          </button>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL: mapa + panel derecho */}
      <main className="relative min-h-[100dvh] p-6 overflow-hidden text-gray-800 bg-gradient-to-b from-[var(--color-cuatro)] to-[var(--color-verde)]">
        <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 xl:px-8">
          <div className="relative rounded-xl shadow-lg overflow-hidden h-[80vh] sm:h-[85vh] md:h-[90vh] lg:h-[100vh]">
            <div className="flex flex-col lg:flex-row h-full">
              {/* MAPA (izquierda) */}
              <div className={`${vistaMovil!=='mapa' ? 'hidden md:block' : ''} relative flex-1`}>
                <div
                  ref={containerRef}
                  className="absolute inset-0 w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
                />
                {tooltip.visible && (
                  <div
                    className="absolute z-40 bg-yellow-200 text-gray-800 text-xs sm:text-sm font-bold px-3 py-2 rounded-xl shadow-lg border-2 border-amber-300"
                    style={{ top: Math.min(tooltip.y + 24, window.innerHeight - 56), left: Math.min(tooltip.x + 24, window.innerWidth - 160) }}
                  >
                    🌸 {tooltip.name}
                  </div>
                )}
              </div>
              {/* FORMULARIO (móvil) */}
{vistaMovil === 'itinerario' && (
  <section className="md:hidden w-full h-full bg-white/95 backdrop-blur p-4 border-t border-gray-200 overflow-y-auto">
    <ItinerarioForm />
  </section>
)}


              {/* PANEL DERECHO (Itinerario) */}
              <aside className="hidden md:block md:w-[420px] h-full bg-white/90 backdrop-blur p-6 border-l border-gray-200 overflow-y-auto">
                <ItinerarioForm />
              </aside>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER igual a Tabasco (fila de íconos) */}
      <footer>
        <div className="flex justify-center gap-4 mt-4 text-xl text-gray-600">
          <i className="fab fa-facebook-square" />
          <i className="fab fa-twitter" />
          <i className="fab fa-instagram" />
          <i className="far fa-envelope" />
        </div>
      </footer>
    </>
  );
}

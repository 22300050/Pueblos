// src/components/SpeedDial.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Bot, MapPin, LifeBuoy, AlertTriangle } from "lucide-react";

export default function SpeedDial({ onChatbotClick }) {
    const [open, setOpen] = useState(false);  
const [showPanic, setShowPanic] = useState(false);
const getCoords = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("Geolocalización no disponible"));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });

const shareWhatsApp = async () => {
  try {
    const { latitude, longitude } = await getCoords();
    const maps = `https://maps.google.com/?q=${latitude},${longitude}`;
    const texto = `Necesito ayuda. Mi ubicación: ${latitude.toFixed(5)}, ${longitude.toFixed(5)} ${maps}`;
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  } catch {
    alert("No se pudo obtener tu ubicación. Activa permisos de ubicación.");
  }
};

const copyLocation = async () => {
  try {
    const { latitude, longitude } = await getCoords();
    const maps = `https://maps.google.com/?q=${latitude},${longitude}`;
    await navigator.clipboard.writeText(maps);
    alert("Enlace copiado al portapapeles.");
  } catch {
    alert("No se pudo copiar. Activa permisos de ubicación.");
  }
};


const items = [
  { type: "action", onClick: () => { setShowPanic(true); setOpen(false); }, icon: <AlertTriangle size={18} />, label: "Pánico", bg: "linear-gradient(135deg,#ef4444,#b91c1c)" },
  { type: "link",   to: "/directorios", icon: <LifeBuoy size={18} />, label: "Directorios" },
  { type: "action", onClick: () => { onChatbotClick?.(); setOpen(false); }, icon: <Bot size={18} />, label: "Chatbot" },
  { type: "link",   to: "/mapa", icon: <MapPin size={18} />, label: "Mapa" },
];

// --- Geometría responsiva del dial ---
const useDialGeom = () => {
  const [geom, setGeom] = useState({ radius: 120, start: 205, end: 285 });

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Radio según viewport, con límites
const radius = Math.max(64, Math.min(110, Math.round(Math.min(w, h) * 0.14)));
// Ángulos automáticos con separación mínima:
const BTN = 48;          // diámetro del botón (w-12 h-12 = 48px)
const GAP = 10;          // espacio deseado entre botones (ajústalo 8–14)
const n = items.length;  // nº de botones del dial
// ángulo mínimo entre botones (en grados) para que 2R*sin(delta/2) >= BTN+GAP
const deltaMinDeg = 2 * (180 / Math.PI) * Math.asin(Math.min(1, (BTN + GAP) / (2 * radius)));
// span total necesario
const span = Math.max(deltaMinDeg * (n - 1) + 4, 60);
// centramos el arco en el cuadrante abajo-derecha (~235°)
let start = 235 - span / 2;
let end   = 235 + span / 2;
// mantenlo en el cuadrante 180°–270° (evita cruzar la vertical)
if (end > 268) { const d = end - 268; end = 268; start -= d; }
if (start < 182) { const d = 182 - start; start = 182; end += d; }
      setGeom({ radius, start, end });
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  return geom;
};

const { radius: RADIUS, start: START_DEG, end: END_DEG } = useDialGeom();

const toRad = (d) => (d * Math.PI) / 180;
const positions = (() => {
  const n = items.length;
  const step = n > 1 ? (END_DEG - START_DEG) / (n - 1) : 0;
  return Array.from({ length: n }, (_, i) => {
    const deg = START_DEG + step * i;
    return { x: Math.cos(toRad(deg)) * RADIUS, y: Math.sin(toRad(deg)) * RADIUS };
  });
})();




  return (
    <div className="fixed bottom-6 right-10 z-[60]">
      <div className="relative w-0 h-0">
{items.map((item, i) => {
  const common = {
    className: "absolute",
    style: {
      transform: open ? `translate(${positions[i].x}px, ${positions[i].y}px)` : "translate(0, 0)",
      transition: `transform 260ms cubic-bezier(.2,.8,.2,1) ${60 * (i + 1)}ms, opacity 220ms ease ${60 * (i + 1)}ms`,
      opacity: open ? 1 : 0,
      pointerEvents: open ? "auto" : "none",
    },
  };

  const BtnEl = (
    <button
      className="w-12 h-12 rounded-full shadow-lg text-white grid place-items-center hover:scale-[1.06] active:scale-95 transition-transform"
      style={{
        background: item.bg ?? "var(--color-secondary)",
        boxShadow: "0 6px 16px rgba(0,0,0,.18), 0 2px 6px rgba(0,0,0,.12)",
      }}
      onClick={item.type === "action" ? item.onClick : undefined}
      aria-label={item.label}
      title={item.label}
    >
      {item.icon}
    </button>
  );

  return (
    <div key={item.label} {...common}>
      {/* Wrapper relativo para posicionar la etiqueta */}
      <div className="relative">
        {/* Botón (link o acción) */}
        {item.type === "link" ? (
          <Link to={item.to} aria-label={item.label} title={item.label}>
            {BtnEl}
          </Link>
        ) : (
          BtnEl
        )}
      </div>
    </div>
  );
})}


      </div>

      <button
        onClick={() => setOpen((s) => !s)}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        className="w-16 h-16 rounded-full text-white shadow-xl grid place-items-center
                   transition-transform hover:scale-[1.03] active:scale-95"
        style={{
          backgroundImage:
            "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
          boxShadow:
            "0 10px 24px rgba(0,0,0,.22), 0 4px 10px rgba(0,0,0,.16)",
        }}
      >
        <span className={`transition-transform duration-200 ${open ? "rotate-45" : "rotate-0"}`}>
          <X size={22} />
        </span>
      </button>
      {/* Modal Pánico */}
{showPanic && (
  <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center">
    {/* Backdrop */}
    <button
      className="absolute inset-0 bg-black/40"
      onClick={() => setShowPanic(false)}
      aria-label="Cerrar"
    />
    {/* Sheet */}
    
    <div role="dialog" aria-modal="true" className="relative w-full sm:w-[480px] bg-[var(--color-bg)] text-[var(--color-text)] rounded-t-2xl sm:rounded-2xl shadow-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold">Botón de pánico</h3>
        <button
          onClick={() => setShowPanic(false)}
          className="px-3 py-1 rounded-full bg-black/5 hover:bg-black/10 transition"
        >
          Cerrar
        </button>
      </div>

      <p className="text-sm mb-4">
        Usa estas opciones de emergencia. *La geolocalización requiere HTTPS y permiso del navegador*.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <a href="tel:911" className="px-3 py-2 rounded-xl text-white text-center"
           style={{background:"linear-gradient(135deg,#ef4444,#b91c1c)"}}>
          Llamar 911
        </a>
        <a href="tel:088" className="px-3 py-2 rounded-xl text-white text-center"
           style={{background:"var(--color-secondary)"}}>
          Llamar 088 (GN)
        </a>
        <a href="tel:089" className="px-3 py-2 rounded-xl text-white text-center"
           style={{background:"var(--color-secondary)"}}>
          Llamar 089
        </a>
        <a href="tel:078" className="px-3 py-2 rounded-xl text-white text-center"
           style={{background:"var(--color-secondary)"}}>
          Ángeles Verdes 078
        </a>

        <button onClick={shareWhatsApp}
          className="px-3 py-2 rounded-xl text-white col-span-2"
          style={{background:"linear-gradient(135deg, var(--color-primary), var(--color-secondary))"}}>
          Compartir ubicación por WhatsApp
        </button>
        <button onClick={copyLocation}
          className="px-3 py-2 rounded-xl bg-black/5 hover:bg-black/10 transition col-span-2">
          Copiar enlace de mi ubicación
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
  
}

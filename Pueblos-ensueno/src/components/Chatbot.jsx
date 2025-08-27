import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import IconoChat from "../assets/IconoChat.png";

// === Guías de navegación del Home ===
const NAV_TIPS = [
  {
    id: "mapa",
    label: "Mapa Interactivo",
    text:
      "Pulsa **Mapa Interactivo** para ver el mapa de toda la República Mexicana. " +
      "Pasa el cursor por un estado para ver su nombre y haz clic para entrar. " +
      "Si eliges **Tabasco**, verás un mapa especial con un panel para armar tu itinerario. " +
      "En esa vista puedes alternar **SVG/Mapbox** (botón '🗺️ Ver mapa Mapbox') y en móvil alternar **Mapa/Itinerario** o usar **pantalla completa**. " +
      "Luego, selecciona el estado que te gustaría visitar.",
  },
  {
    id: "puntos",
    label: "Puntos cercanos",
    text:
      "Pulsa **Puntos cercanos** para ver tu ubicación y recibir avisos cuando estés cerca de puntos de interés o eventos próximos. " +
      "Desde ahí puedes **probar notificaciones**, **compartir tu ubicación**, o habilitar un **link de ubicación en vivo por 10 minutos** para que te sigan en tiempo real.",
  },
  {
    id: "itinerario",
    label: "Itinerario",
    text:
      "Tu **Itinerario** muestra días, presupuesto por día (con conversión a USD/EUR), mes e intereses. " +
      "Puedes **exportar a PDF**, **guardar el itinerario**, ver **eventos que coinciden con tu mes**, reiniciar todo, y se dibuja la **ruta** en el mapa si marcaste 2+ puntos. " +
      "Las actividades que agregues desde los municipios se reparten automáticamente entre los días.",
  },
  {
    id: "municipio",
    label: "Municipios y detalle",
    text:
      "Al hacer clic en un municipio verás su ficha con descripción, sitios top y eventos. " +
      "Puedes **marcar interés** (se guarda como destino automático), **agregar o quitar actividades** a tu itinerario y filtrar eventos por mes. " +
      "Desde allí también puedes volver al mapa cuando quieras.",
  },
  {
    id: "productos",
    label: "Productos artesanales",
    text:
      "En **Productos Artesanales** verás un catálogo por municipio con imágenes, artesanos y precios. " +
      "Incluye botón para **volver** al municipio o mapa, **convertidor de divisas** y un mini **asistente de frases** (ES/EN/Yokot’an) para comerciar mejor con los artesanos.",
  },
  {
    id: "guest",
    label: "Explorar como invitado",
    text:
      "Pulsa **Invitado** para explorar sin cuenta y ajustar intereses antes de planear. " +
      "Esto te ayuda a recibir mejores sugerencias en el mapa y el itinerario.",
  },
  {
    id: "login",
    label: "Iniciar sesión",
    text:
      "Con **Iniciar sesión** accedes a tus datos guardados y continuidad entre sesiones.",
  },
  {
    id: "idioma",
    label: "Cambiar idioma",
    text:
      "En el encabezado puedes alternar **ES/EN** con el switch de idioma. " +
      "El contenido del Home y menús cambia inmediatamente.",
  },
];

// Palabras clave -> id de tip
const KEYWORDS = {
  mapa:      ["mapa", "mapa interactivo", "mapa méxico", "mapa mexico"],
  puntos:    ["puntos", "puntos cercanos", "cerca", "cercanos"],
  itinerario:["itinerario", "mi ruta", "plan", "pdf", "exportar"],
  municipio: ["municipio", "detalle", "agregar actividad", "sitios", "eventos"],
  productos: ["productos", "artesanías", "artesania", "comprar", "catalogo"],
  guest:     ["invitado", "explorar", "guest"],
  login:     ["login", "iniciar sesión", "entrar", "sesion"],
  idioma:    ["idioma", "es", "en", "lenguaje", "language"],
  tabasco:   ["tabasco", "mapa tabasco"], // extra por si preguntan directo por Tabasco
};


export default function Chatbot({ open, onClose }) {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");
  const listRef = useRef(null);

  // Mensaje inicial (una sola vez por sesión)
  useEffect(() => {
    if (open && messages.length === 0) {
      const timer = setTimeout(() => {
        pushBot("¡Hola! Soy Tavo explorador. ¿Te ayudo a navegar el Home? Prueba con: “Mapa Interactivo”, “Puntos cercanos”, “Itinerario”, “Municipios”, “Productos” o escribe “ayuda home”.");
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const pushBot = (text) =>
    setMessages((m) => [...m, { sender: "bot", text }]);
  const pushUser = (text) =>
    setMessages((m) => [...m, { sender: "user", text }]);
const handleSend = (text) => {
  const msg = (text ?? value).trim();
  if (!msg) return;
  pushUser(msg);
  setValue("");

  const low = msg.toLowerCase();

  // 1) "ayuda home" → enviar resumen de todos los tips
  if (/(ayuda|guía|guia).*(home|inicio)/i.test(low)) {
    const resumen = NAV_TIPS.map(t => `• ${t.label}: ${t.text}`).join("\n\n");
    setTimeout(() => pushBot(resumen), 400);
    return;
  }

  // 2) Buscar tip por palabra clave
  for (const [id, words] of Object.entries(KEYWORDS)) {
    if (words.some(w => low.includes(w))) {
      const tip = NAV_TIPS.find(t => t.id === id);
      if (tip) {
        setTimeout(() => pushBot(`${tip.label}: ${tip.text}`), 400);
        return;
      }
    }
  }

  // 3) Fallback
  setTimeout(() => {
    pushBot("Puedo ayudarte a navegar el Home. Escribe, por ejemplo: “Mapa Interactivo”, “Puntos cercanos”, “Itinerario”, “Municipios”, “Productos”, “Invitado”, “Login”, “Idioma” o “ayuda home”.");
  }, 400);
};


  if (!open) return null;

  return (
    <div
      className="fixed bottom-24 right-6 z-[70] w-[350px] max-w-[92vw] h-[500px]
                 bg-[var(--color-bg)] text-[var(--color-text)] rounded-2xl shadow-2xl
                 border border-black/5 flex flex-col animate-fade-in-up"
      role="dialog"
      aria-label="Chatbot Pueblos de Ensueño"
    >
      {/* Header */}
<div
  className="h-12 px-4 rounded-t-2xl flex items-center justify-between cursor-default
             text-white"
  style={{
    background:
      "linear-gradient(135deg, var(--color-primary))",
  }}
>
  <div className="flex items-center gap-2">
    <img src={IconoChat} alt="Avatar Chatbot" className="w-8 h-8 rounded-full" />
    <h3 className="font-semibold">Tavo Explorador</h3>
  </div>
  <button
    onClick={onClose}
    aria-label="Cerrar chatbot"
    className="p-1 rounded-full hover:bg-white/20 transition"
  >
    <X size={18} />
  </button>
</div>


      {/* Mensajes */}
      <div ref={listRef} className="flex-1 p-3 overflow-y-auto space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
              m.sender === "bot"
                ? "bg-[color:oklch(0.94_0.03_140)] text-[var(--color-text)] rounded-bl-md"
                : "bg-[var(--color-secondary)] text-white ml-auto rounded-br-md"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* Opciones rápidas */}
<div className="px-3 py-2 border-t border-black/5 flex flex-wrap gap-2">
  {["mapa", "puntos", "itinerario", "municipio", "productos", "idioma"].map((id) => {
    const tip = NAV_TIPS.find(t => t.id === id);
    if (!tip) return null;
    return (
      <button
        key={id}
        onClick={() => handleSend(tip.label)}
        className="text-xs px-2.5 py-1.5 rounded-full text-white hover:opacity-90 transition"
        style={{ background: "linear-gradient(135deg, var(--color-secondary), var(--color-tertiary))" }}
      >
        {tip.label}
      </button>
    );
  })}
</div>


      {/* Input */}
      <div className="p-3 border-t border-black/5 flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Escribe tu pregunta…"
          className="flex-1 px-3 py-2 rounded-full border border-black/10 outline-none
                     bg-white/80 backdrop-blur placeholder-black/40"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 rounded-full text-white font-medium hover:opacity-95 transition"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
          }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

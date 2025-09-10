import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import IconoChat from "../assets/IconoChat.png";
// === IA config (NO API KEY en frontend) ===
const IA_ENABLED = true;              // ponlo en false si quieres desactivar la IA
const API_URL = "/api/chat";          // tu backend Express con Gemini (proxy Vite a :3001)


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
  idioma: ["idioma", "cambiar idioma", "lenguaje", "language"],
  tabasco:   ["tabasco", "mapa tabasco"], // extra por si preguntan directo por Tabasco
};
// Normaliza para comparar sin acentos
const norm = (s) => s
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "");

// Dado un texto, devuelve sugerencias de NAV_TIPS por prefijo o inclusión
const getSuggestions = (text) => {
  if (!text) return [];
  const q = norm(text.trim());
  if (!q) return [];
  return NAV_TIPS
    .filter(t => {
      const lbl = norm(t.label);
      return lbl.startsWith(q) || lbl.includes(q);
    })
    .slice(0, 5) // máximo 5
    .map(t => ({ id: t.id, label: t.label }));
};

// Devuelve un tip local si hay match real; si no, null (NO fallback aquí)
const detectLocalTip = (low) => {
  // Match explícito: "ayuda home" o "ayuda inicio"
  if (/\bayuda\b.*\b(home|inicio)\b/.test(low)) {
    const resumen = NAV_TIPS.map(t => `• ${t.label}: ${t.text}`).join("\n\n");
    console.log("[local] resumen de ayuda");
    return resumen;
  }

  // Palabras clave por sección
  for (const [id, words] of Object.entries(KEYWORDS)) {
    if (words.some(w => low.includes(w))) {
      const tip = NAV_TIPS.find(t => t.id === id);
      if (tip) {
        console.log("[local] match:", id);
        return `${tip.label}: ${tip.text}`;
      }
    }
  }

  // Sin coincidencia local
  return null;
};


// === Router local (tu lógica actual, intacta) ===
const localRoute = (low) => {
  // 1) "ayuda home" → enviar resumen de todos los tips
  if (/(ayuda|guía|guia).*(home|inicio)/i.test(low)) {
    const resumen = NAV_TIPS.map(t => `• ${t.label}: ${t.text}`).join("\n\n");
    return resumen;
  }
  // 2) Buscar tip por palabra clave
  for (const [id, words] of Object.entries(KEYWORDS)) {
    if (words.some(w => low.includes(w))) {
      const tip = NAV_TIPS.find(t => t.id === id);
      if (tip) return `${tip.label}: ${tip.text}`;
    }
  }
  // 3) Fallback
  return "Puedo ayudarte a navegar el Home. Escribe, por ejemplo: “Mapa Interactivo”, “Puntos cercanos”, “Itinerario”, “Municipios”, “Productos”, “Invitado”, “Login”, “Idioma” o “ayuda home”.";
};


export default function Chatbot({ open, onClose }) {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState([]); 
  const listRef = useRef(null);
 const [typing, setTyping] = useState(false);
 const [suggestions, setSuggestions] = useState([]);
const [isFocused, setIsFocused] = useState(false);
// === Speech-to-Text (voz) ===
const recognitionRef = useRef(null);
const [listening, setListening] = useState(false);
const [supportsSTT, setSupportsSTT] = useState(false);
// === TTS (texto a voz) ===
const [ttsReady, setTtsReady] = useState(false);
const [muted, setMuted] = useState(false);
const [voice, setVoice] = useState(null);
const [rate, setRate] = useState(1.5);   // velocidad 0.1 - 10 (1 = normal)
const [pitch, setPitch] = useState(0.0); // tono 0 - 2   (1 = normal)

// Cargar voces del sistema y elegir español si hay
useEffect(() => {
  if (!("speechSynthesis" in window)) return;
const pickVoice = () => {
  const vs = window.speechSynthesis.getVoices() || [];
  // 1) Intentar por nombre exacto (Windows/Edge/Chrome en Windows)
  const byName = vs.find(v => /Microsoft\s+Raul\b/i.test(v.name));
  // 2) Alternativas por idioma
  const byEsMX = vs.find(v => /es[-_]MX/i.test(v.lang));
  const byEsES = vs.find(v => /es[-_]ES/i.test(v.lang));
  const byEsAny = vs.find(v => /^es[-_]/i.test(v.lang));
  const chosen = byName || byEsMX || byEsES || byEsAny || vs[0] || null;
  setVoice(chosen);
  setTtsReady(true);
};

  // Algunos navegadores requieren el evento:
  window.speechSynthesis.onvoiceschanged = pickVoice;
  pickVoice();
}, []);
useEffect(() => {
  if (!open && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}, [open]);

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
useEffect(() => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    setSupportsSTT(false);
    return;
  }
  setSupportsSTT(true);

  const recog = new SR();
  recog.lang = "es-MX";         // Ajusta según tu idioma (puedes leer i18n si quieres)
  recog.interimResults = true;  // Resultados parciales en vivo
  recog.continuous = false;     // Una frase por vez

  recog.onresult = (e) => {
    let interim = "";
    let final = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const txt = e.results[i][0].transcript;
      if (e.results[i].isFinal) final += txt;
      else interim += txt;
    }

    // Mostrar texto provisional en el input (dispara tus sugerencias por prefijo)
    if (interim) {
      setValue(interim.trim());
      setIsFocused(true);
      setSuggestions(getSuggestions(interim));
    }

    // Al finalizar: enviar mensaje
// Al finalizar: enviar mensaje (con handler ACTUAL)
if (final) {
  setListening(false);
  setIsFocused(false);
  setSuggestions([]);
  handleSendRef.current(final);   // ✅ siempre la versión vigente
}

  };

  recog.onerror = () => setListening(false);
  recog.onend = () => setListening(false);

  recognitionRef.current = recog;

  // Limpieza al desmontar
  return () => {
    try { recog.stop(); } catch {}
  };
}, []);
const startListening = () => {
  if (!recognitionRef.current) return;
  try {
    setListening(true);
    setIsFocused(true); // muestra sugerencias mientras dicta
    recognitionRef.current.start();
  } catch {
    setListening(false);
  }
};

const stopListening = () => {
  try { recognitionRef.current?.stop(); } catch {}
  setListening(false);
};
// === Texto a voz (TTS) ===
const stripMd = (t) =>
  t.replace(/\*\*(.*?)\*\*/g, "$1")
   .replace(/`+/g, "")
   .replace(/[_#>*]+/g, "")
   .replace(/\[(.*?)\]\((.*?)\)/g, "$1");

const speak = (text) => {
  if (!("speechSynthesis" in window)) return;
  if (muted || !ttsReady) return;
  const u = new SpeechSynthesisUtterance(stripMd(text));
  u.lang = (voice && voice.lang) || "es-MX";
  if (voice) u.voice = voice;
  u.rate = rate;
  u.pitch = pitch;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
};

const pushBot = (text) => {
  setMessages((m) => [...m, { sender: "bot", text }]);
  setHistory((h) => [...h, { role: "assistant", content: text }]);
  speak(text); // 🔊 leer en voz alta
};

const pushUser = (text) => {
  setMessages((m) => [...m, { sender: "user", text }]);
  setHistory((h) => [...h, { role: "user", content: text }]);
};


const handleSend = async (text) => {
  const msg = (text ?? value).trim();
  if (!msg) return;

  pushUser(msg);
  setValue("");
  setIsFocused(false);
  setSuggestions([]);
  const low = norm(msg);
  const matchWord = (text, word) => {
  const esc = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|\\W)${esc}(?=\\W|$)`, "i").test(text);
};

  // 1) INTENTAR primero tip local (rápido)
  const local = detectLocalTip(low);
  if (local) {
    console.log("[send] respondí con tip local");
    pushBot(local);
    return;
  }

  // 2) Intentar IA sólo si no hubo tip
  if (IA_ENABLED) {
    setTyping(true);
    try {
      const resp = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.concat([{ role: "user", content: msg }]),
        }),
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        console.error("❌ /api/chat error:", errorText);
        setTyping(false);
        pushBot(localRoute(low));  // 3) FALLBACK genérico si IA falla
        return;
      }

      const data = await resp.json();
      console.log("✅ IA reply payload:", data);
      const ai = typeof data?.reply === "string" ? data.reply.trim() : "";

      setTyping(false);

      if (ai) {
        pushBot(ai);
        return;
      }

      // IA devolvió vacío → fallback genérico
      pushBot(localRoute(low));
      return;
    } catch (e) {
      console.error("❌ IA fetch exception:", e);
      setTyping(false);
      pushBot(localRoute(low));
      return;
    }
  }

  // IA desactivada → fallback
  pushBot(localRoute(low));
};

// Debe ir AQUÍ, después de handleSend:
const handleSendRef = useRef(() => {});
useEffect(() => { handleSendRef.current = handleSend; }, [handleSend]);


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
  onClick={() => {
    setMuted(prev => {
      const next = !prev;
      if (next && "speechSynthesis" in window) {
        // si acabo de silenciar, corto cualquier lectura en curso
        window.speechSynthesis.cancel();
      }
      // (opcional) persistir preferencia
      try { localStorage.setItem("tavoMuted", String(next)); } catch {}
      return next;
    });
  }}
  aria-label={muted ? "Activar voz" : "Silenciar voz"}
  className="p-1 rounded-full hover:bg-white/20 transition mr-1"
  title={muted ? "Activar voz" : "Silenciar voz"}
>
  {muted ? "🔕" : "🔊"}
</button>


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
               {/* “Escribiendo…” */}
       {typing && (
         <div className="max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed bg-[color:oklch(0.94_0.03_140)] text-[var(--color-text)] rounded-bl-md">
           <span className="inline-flex items-center gap-1">
             Tavo está escribiendo
             <span className="inline-block animate-pulse">…</span>
           </span>
         </div>
       )}
       {listening && (
  <div className="max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed bg-[color:oklch(0.94_0.03_140)] text-[var(--color-text)] rounded-bl-md">
    <span className="inline-flex items-center gap-2">
      Escuchando…
      <span className="inline-block w-2 h-2 rounded-full bg-black/40 animate-bounce" />
      <span className="inline-block w-2 h-2 rounded-full bg-black/40 animate-bounce [animation-delay:120ms]" />
      <span className="inline-block w-2 h-2 rounded-full bg-black/40 animate-bounce [animation-delay:240ms]" />
    </span>
  </div>
)}
      </div>

      {/* Input */}

        {/* Input + Sugerencias */}
<div className="p-3 border-t border-black/5">
<div className="flex gap-2 items-center">
  <input
    value={value}
    onChange={(e) => {
      const v = e.target.value;
      setValue(v);
      if (isFocused) setSuggestions(getSuggestions(v));
    }}
    onFocus={() => {
      setIsFocused(true);
      setSuggestions(getSuggestions(value));
    }}
    onBlur={() => {
      setTimeout(() => {
        setIsFocused(false);
        setSuggestions([]);
      }, 100);
    }}
    onKeyDown={(e) => e.key === "Enter" && handleSend()}
    placeholder="Habla o escribe tu pregunta…"
    className="flex-1 min-w-0 px-3 py-2 rounded-full border border-black/10 outline-none bg-white/80 backdrop-blur placeholder-black/40"
  />

  {/* Mic: inicia/detiene dictado */}
  <button
    type="button"
    onClick={() => (listening ? stopListening() : startListening())}
    disabled={!supportsSTT}
    title={supportsSTT ? (listening ? "Detener" : "Escuchar") : "Tu navegador no soporta dictado"}
    className={`px-3 py-2 rounded-full border border-black/10 ${
      listening ? "bg-red-50 text-red-600" : "bg-white"
    } disabled:opacity-50`}
  >
    {listening ? "●" : "🎤"}
  </button>

  <button
    onClick={handleSend}
    className="px-4 py-2 rounded-full text-white font-medium hover:opacity-95 transition"
    style={{ background:"linear-gradient(135deg, var(--color-primary), var(--color-secondary))" }}
  >
    Enviar
  </button>
</div>


  {/* Sugerencias dinámicas */}
  {isFocused && suggestions.length > 0 && (
    <div className="mt-2 max-h-36 overflow-auto rounded-xl border border-black/10 bg-white/95 shadow-lg">
      {suggestions.map(s => (
        <button
          key={s.id}
          // onMouseDown para que el blur del input no cancele el click
          onMouseDown={(e) => {
            e.preventDefault();
            // puedes: 1) autocompletar input, o 2) enviar directo
            // Opción A: autocompletar y dejar que el user presione Enter:
            // setValue(s.label);
            // setSuggestions([]);

            // Opción B: enviar al instante (recomendado):
            handleSend(s.label);
          }}
          className="w-full text-left px-3 py-2 text-sm hover:bg-black/5"
        >
          {s.label}
        </button>
      ))}
    </div>
  )}

</div>

      </div>
  );
}

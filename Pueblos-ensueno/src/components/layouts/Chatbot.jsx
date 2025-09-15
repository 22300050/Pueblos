import { useEffect, useRef, useState } from "react";
import { X, Mic, Send, Volume2, VolumeX } from "lucide-react";

import IconoChat from '../../assets/Logos/IconoChat.png';

const IA_ENABLED = true;
const API_URL = "/api/chat";

// === Guías de navegación con redacción mejorada ===
const NAV_TIPS = [
  {
    id: "mapa",
    label: "Mapa Interactivo",
    text: "Explora todo México con nuestro **Mapa Interactivo**. Haz clic en cualquier estado para descubrir sus maravillas. ¡Prueba con **Tabasco** para acceder a herramientas especiales y planificar tu ruta perfecta!"
  },
  {
    id: "puntos",
    label: "Puntos cercanos",
    text: "Activa **Puntos cercanos** y deja que te avisemos cuando estés cerca de un lugar increíble. También puedes **compartir tu ubicación** o crear un **enlace en vivo** para que tus amigos te sigan durante 10 minutos."
  },
  {
    id: "itinerario",
    label: "Itinerario",
    text: "Organiza tu viaje soñado con el **Itinerario**. Define tu presupuesto, días y preferencias. Guarda tu plan, **expórtalo a PDF** y mira cómo se traza tu ruta en el mapa. ¡Nosotros ordenamos las actividades por ti!"
  },
  {
    id: "municipio",
    label: "Municipios y detalle",
    text: "Descubre la magia de cada **Municipio**. Al hacer clic, verás su historia, eventos y lugares imperdibles. **Agrega actividades** a tu itinerario con un solo toque y encuentra eventos que coincidan con tu visita."
  },
  {
    id: "productos",
    label: "Productos artesanales",
    text: "Encuentra tesoros únicos en la sección de **Productos Artesanales**. Conoce a los artesanos, convierte precios a tu moneda y usa nuestro **asistente de frases** para comunicarte en español, inglés o ¡incluso Yokot’an!"
  },
  {
    id: "guest",
    label: "Explorar como invitado",
    text: "Explora como **Invitado** para descubrir todo lo que ofrecemos sin necesidad de una cuenta. Ajusta tus intereses y recibe sugerencias personalizadas para inspirar tu próximo viaje."
  },
  {
    id: "login",
    label: "Iniciar sesión",
    text: "Al **Iniciar sesión**, guardamos tu progreso y tus itinerarios para que puedas continuar tu aventura desde cualquier dispositivo, en cualquier momento."
  },
  {
    id: "idioma",
    label: "Cambiar idioma",
    text: "Puedes cambiar el **Idioma** de la plataforma en cualquier momento. Busca el selector **ES/EN** en la parte superior de la página para traducir todo el contenido al instante."
  },
];

const KEYWORDS = {
  mapa:      ["mapa", "mapa interactivo", "mapa méxico", "mapa mexico"],
  puntos:    ["puntos", "puntos cercanos", "cerca", "cercanos"],
  itinerario:["itinerario", "mi ruta", "plan", "pdf", "exportar"],
  municipio: ["municipio", "detalle", "agregar actividad", "sitios", "eventos"],
  productos: ["productos", "artesanías", "artesania", "comprar", "catalogo"],
  guest:     ["invitado", "explorar", "guest"],
  login:     ["login", "iniciar sesión", "entrar", "sesion"],
  idioma: ["idioma", "cambiar idioma", "lenguaje", "language"],
  tabasco:   ["tabasco", "mapa tabasco"],
};
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const getSuggestions = (text) => {
  if (!text) return [];
  const q = norm(text.trim());
  if (!q) return [];
  return NAV_TIPS.filter(t => { const lbl = norm(t.label); return lbl.startsWith(q) || lbl.includes(q); }).slice(0, 5).map(t => ({ id: t.id, label: t.label }));
};
const detectLocalTip = (low) => {
  const ayudaKeywords = ["ayuda", "guia", "inicio", "home", "resumen", "todo"];
  if (ayudaKeywords.some(k => low.includes(k))) {
    const resumen = NAV_TIPS.map(t => `• **${t.label}**: ${t.text.replace(/\*\*(.*?)\*\*/g, "$1")}`).join("\n\n");
    return `¡Claro! Aquí tienes un resumen de lo que puedo hacer por ti:\n\n${resumen}`;
  }
  for (const [id, words] of Object.entries(KEYWORDS)) {
    if (words.some(w => low.includes(w))) {
      const tip = NAV_TIPS.find(t => t.id === id);
      if (tip) return tip.text;
    }
  }
  return null;
};
const localRoute = (low) => {
    return "No entendí muy bien. Recuerda que puedo darte información sobre: **Mapa Interactivo**, **Itinerario**, **Puntos cercanos** y más. También puedes escribir **\"ayuda\"** para ver un resumen.";
};


// --- Componente de Mensaje con soporte para negritas ---
const ChatMessage = ({ sender, text, avatar }) => {
    const isBot = sender === 'bot';
    const formatText = (inputText) => {
        const boldRegex = /\*\*(.*?)\*\*/g;
        // Reemplazar saltos de línea con <br />
        const withLineBreaks = inputText.replace(/\n/g, '<br />');
        const parts = withLineBreaks.split(boldRegex);

        const content = parts.map((part, index) => {
            if (index % 2 === 1) {
                return <strong key={index}>{part}</strong>;
            }
            // Usar dangerouslySetInnerHTML para renderizar <br />
            return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
        });
        return <>{content}</>;
    };

    return (
        <div className={`flex items-end gap-2 ${!isBot && 'flex-row-reverse'}`}>
            {isBot && (
                <img src={avatar} alt="Bot avatar" className="w-8 h-8 rounded-full bg-gray-200" />
            )}
            {!isBot && (
                 <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-sm">
                    TÚ
                </div>
            )}
            <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    isBot
                        ? "bg-gray-100 text-gray-800 rounded-bl-none"
                        : "bg-orange-500 text-white rounded-br-none"
                }`}
            >
                {formatText(text)}
            </div>
        </div>
    );
};


export default function Chatbot({ open, onClose, actions }) {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState([]); 
  const listRef = useRef(null);
  const [typing, setTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [supportsSTT, setSupportsSTT] = useState(false);
  const [ttsReady, setTtsReady] = useState(false);
  const [muted, setMuted] = useState(false);
  const [voice, setVoice] = useState(null);
  const [rate, setRate] = useState(1.2);
  const [pitch, setPitch] = useState(1.0);
  const handleSendRef = useRef(() => {});

  // Lógica de `useEffect`
  useEffect(() => {
      if (!("speechSynthesis" in window)) return;
      const pickVoice = () => {
          const vs = window.speechSynthesis.getVoices() || [];
          const byName = vs.find(v => /Microsoft\s+Raul\b/i.test(v.name));
          const byEsMX = vs.find(v => /es[-_]MX/i.test(v.lang));
          const byEsES = vs.find(v => /es[-_]ES/i.test(v.lang));
          const byEsAny = vs.find(v => /^es[-_]/i.test(v.lang));
          const chosen = byName || byEsMX || byEsES || byEsAny || vs[0] || null;
          setVoice(chosen);
          setTtsReady(true);
      };
      window.speechSynthesis.onvoiceschanged = pickVoice;
      pickVoice();
  }, []);

  useEffect(() => {
      if (!open && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
      }
  }, [open]);

  useEffect(() => {
      if (open && messages.length === 0) {
          const timer = setTimeout(() => {
              const welcomeOptions = NAV_TIPS.map(tip => `• **${tip.label}**`).join('\n');
              const welcomeMessage = `¡Hola, soy Tavo! 👋 Tu guía en Pueblos de Ensueño. Puedes preguntarme sobre cualquiera de estos temas:\n\n${welcomeOptions}\n\nO simplemente escribe **"ayuda"** para un resumen completo.`;
              pushBot(welcomeMessage);
          }, 600);
          return () => clearTimeout(timer);
      }
  }, [open, messages.length]);

  useEffect(() => {
      if (listRef.current) {
          listRef.current.scrollTop = listRef.current.scrollHeight;
      }
  }, [messages]);

  useEffect(() => {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) { setSupportsSTT(false); return; }
      setSupportsSTT(true);
      const recog = new SR();
      recog.lang = "es-MX";
      recog.interimResults = true;
      recog.continuous = false;
      recog.onresult = (e) => {
          let interim = ""; let final = "";
          for (let i = e.resultIndex; i < e.results.length; i++) {
              const txt = e.results[i][0].transcript;
              if (e.results[i].isFinal) final += txt; else interim += txt;
          }
          if (interim) { setValue(interim.trim()); setIsFocused(true); setSuggestions(getSuggestions(interim)); }
          if (final) { setListening(false); setIsFocused(false); setSuggestions([]); handleSendRef.current(final); }
      };
      recog.onerror = () => setListening(false);
      recog.onend = () => setListening(false);
      recognitionRef.current = recog;
      return () => { try { recog.stop(); } catch {} };
  }, []);
  
  const startListening = () => { if (!recognitionRef.current) return; try { setListening(true); setIsFocused(true); recognitionRef.current.start(); } catch { setListening(false); } };
  const stopListening = () => { try { recognitionRef.current?.stop(); } catch {} setListening(false); };
  
  const stripMd = (t) => t.replace(/\*\*(.*?)\*\*/g, "$1").replace(/`+/g, "").replace(/[_#>*]+/g, "").replace(/\[(.*?)\]\((.*?)\)/g, "$1");
  const speak = (text) => { if (!("speechSynthesis" in window)) return; if (muted || !ttsReady) return; const u = new SpeechSynthesisUtterance(stripMd(text)); u.lang = (voice && voice.lang) || "es-MX"; if (voice) u.voice = voice; u.rate = rate; u.pitch = pitch; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); };
  
  const pushBot = (text) => { setMessages((m) => [...m, { sender: "bot", text }]); setHistory((h) => [...h, { role: "assistant", content: text }]); speak(text); };
  const pushUser = (text) => { setMessages((m) => [...m, { sender: "user", text }]); setHistory((h) => [...h, { role: "user", content: text }]); };

  const handleSend = async (text) => {
      const msg = (text ?? value).trim();
      if (!msg) return;
      pushUser(msg);
      setValue("");
      setIsFocused(false);
      setSuggestions([]);
      const low = norm(msg);
      const local = detectLocalTip(low);
      if (local) { pushBot(local); return; }
      if (IA_ENABLED) {
          setTyping(true);
          try {
              const resp = await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history.concat([{ role: "user", content: msg }]), }), });
              if (!resp.ok) { setTyping(false); pushBot(localRoute(low)); return; }
              const data = await resp.json();
              const ai = typeof data?.reply === "string" ? data.reply.trim() : "";
              setTyping(false);
              if (ai) { pushBot(ai); } else { pushBot(localRoute(low)); }
          } catch (e) { setTyping(false); pushBot(localRoute(low)); }
      } else {
          pushBot(localRoute(low));
      }
  };
  useEffect(() => { handleSendRef.current = handleSend; }, [handleSend, history]);

  // ✅ --- FUNCIÓN CORREGIDA PARA SILENCIAR ---
  const handleMuteToggle = () => {
    // Usamos la forma funcional de setState para asegurar que tenemos el valor más reciente
    setMuted(currentMutedState => {
        const newMutedState = !currentMutedState;
        // Si el nuevo estado es "silenciado", cancelamos cualquier habla en curso.
        if (newMutedState && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }
        return newMutedState;
    });
  };

  if (!open) return null;

  return (
    <div
      className="fixed bottom-24 right-6 z-[70] w-[370px] max-w-[92vw] h-[550px]
                 bg-white text-gray-800 rounded-2xl shadow-2xl
                 border border-gray-200 flex flex-col"
      role="dialog"
      aria-label="Chatbot Tavo Explorador"
    >
      {/* Header */}
      <div className="h-16 px-4 rounded-t-2xl flex items-center justify-between text-white bg-orange-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-white/50 overflow-hidden flex-shrink-0 bg-white">
            <img src={IconoChat} alt="Avatar de Tavo" className="w-full h-full object-cover" />
          </div>
          <h3 className="font-semibold text-lg">Tavo Explorador</h3>
        </div>
        <div className="flex items-center gap-1">
            {/* ✅ --- BOTÓN ACTUALIZADO --- */}
            <button
                onClick={handleMuteToggle}
                aria-label={muted ? "Activar voz" : "Silenciar voz"}
                className="p-2 rounded-full hover:bg-white/20 transition"
                title={muted ? "Activar voz" : "Silenciar voz"}
            >
                {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button
                onClick={onClose}
                aria-label="Cerrar chatbot"
                className="p-2 rounded-full hover:bg-white/20 transition"
            >
                <X size={20} />
            </button>
        </div>
      </div>

      {/* Mensajes */}
      <div ref={listRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
        {messages.map((m, i) => (
            <ChatMessage key={i} sender={m.sender} text={m.text} avatar={IconoChat} />
        ))}
        {typing && (
            <div className="flex items-end gap-2">
                <img src={IconoChat} alt="Bot avatar" className="w-8 h-8 rounded-full bg-gray-200" />
                <div className="px-4 py-2 rounded-2xl text-sm bg-gray-100 text-gray-800 rounded-bl-none">
                    <div className="flex items-center gap-1 text-gray-500">
                        <span>Escribiendo</span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Input y Sugerencias */}
      <div className="p-3 border-t border-gray-200 bg-white">
        {isFocused && suggestions.length > 0 && (
            <div className="mb-2 max-h-32 overflow-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                {suggestions.map(s => (
                    <button
                    key={s.id}
                    onMouseDown={(e) => { e.preventDefault(); handleSend(s.label); }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-orange-50"
                    >
                    {s.label}
                    </button>
                ))}
            </div>
        )}
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <input
                value={value}
                onChange={(e) => {
                    const v = e.target.value;
                    setValue(v);
                    if (isFocused) setSuggestions(getSuggestions(v));
                }}
                onFocus={() => { setIsFocused(true); setSuggestions(getSuggestions(value)); }}
                onBlur={() => { setTimeout(() => { setIsFocused(false); setSuggestions([]); }, 150); }}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Escribe un mensaje..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
            />
            <button
                type="button"
                onClick={() => (listening ? stopListening() : startListening())}
                disabled={!supportsSTT}
                title={supportsSTT ? (listening ? "Detener" : "Dictar por voz") : "Dictado no soportado"}
                className={`absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${
                    listening ? "bg-red-500 text-white" : "text-gray-500 hover:bg-gray-100"
                } disabled:opacity-50`}
            >
                <Mic size={18} />
            </button>
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!value.trim()}
            className="w-10 h-10 flex-shrink-0 grid place-items-center rounded-full text-white bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 transition-all"
            aria-label="Enviar mensaje"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
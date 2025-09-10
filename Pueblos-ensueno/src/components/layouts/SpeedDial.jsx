// src/components/SpeedDial.jsx
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { 
    Plus, 
    X, 
    Bot, 
    MapPin, 
    LifeBuoy, 
    AlertTriangle, 
    Phone, 
    Copy, 
    Share2 
} from "lucide-react";

// --- Componente Toast (Notificaciones) ---
const Toast = ({ message, show, onDismiss }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onDismiss, 2500);
            return () => clearTimeout(timer);
        }
    }, [show, onDismiss]);

    return (
        <div 
            className={`fixed bottom-24 right-1/2 translate-x-1/2 sm:right-10 sm:translate-x-0 transition-all duration-300 z-[80] ${
                show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
        >
            <div className="bg-slate-800 text-white px-4 py-2 rounded-full shadow-lg text-sm">
                {message}
            </div>
        </div>
    );
};


// --- Componente Modal de Pánico (Modo Claro) ---
const PanicModal = ({ onClose }) => {
    const [toast, setToast] = useState({ show: false, message: "" });

    const showToast = (message) => {
        setToast({ show: true, message });
    };

    const getCoords = useCallback(() =>
        new Promise((resolve, reject) => {
            if (!navigator.geolocation) return reject(new Error("Geolocalización no disponible"));
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve(pos.coords),
                (err) => reject(err),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        }),
    []);

    const shareWhatsApp = async () => {
        try {
            const { latitude, longitude } = await getCoords();
            const maps = `https://maps.google.com/?q=${latitude},${longitude}`;
            const texto = `🆘 ¡Necesito ayuda! Mi ubicación actual es: ${maps}`;
            const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
            window.open(url, "_blank");
        } catch {
            showToast("No se pudo obtener tu ubicación.");
        }
    };

    const copyLocation = async () => {
        try {
            const { latitude, longitude } = await getCoords();
            const maps = `https://maps.google.com/?q=${latitude},${longitude}`;
            const textArea = document.createElement("textarea");
            textArea.value = maps;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast("Enlace de ubicación copiado.");
        } catch {
            showToast("Error al copiar. Revisa los permisos.");
        }
    };

    const emergencyActions = [
        { label: "Llamar 911", href: "tel:911", icon: <Phone size={20} />, primary: true },
        { label: "Llamar 088 (GN)", href: "tel:088", icon: <Phone size={20} /> },
        { label: "Llamar 089 (Denuncia)", href: "tel:089", icon: <Phone size={20} /> },
        { label: "Ángeles Verdes 078", href: "tel:078", icon: <Phone size={20} /> },
    ];
    
    return (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center">
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />
            <div role="dialog" aria-modal="true" className="relative w-full max-w-md bg-white text-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 m-4 animate-slide-up">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-red-600">Botón de Pánico</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Usa estas opciones solo en una emergencia.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                        aria-label="Cerrar"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                    {emergencyActions.map(action => (
                        <a 
                            key={action.label} 
                            href={action.href} 
                            className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg font-semibold text-center transition-transform active:scale-95 ${
                                action.primary 
                                ? "bg-red-600 hover:bg-red-700 text-white col-span-2 shadow-lg" 
                                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                            }`}
                        >
                            {action.icon}
                            <span>{action.label}</span>
                        </a>
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     <button onClick={shareWhatsApp} className="flex items-center justify-center gap-2 px-3 py-3 rounded-lg font-semibold bg-green-500 hover:bg-green-600 text-white transition-transform active:scale-95">
                        <Share2 size={20}/>
                        <span>WhatsApp</span>
                    </button>
                    <button onClick={copyLocation} className="flex items-center justify-center gap-2 px-3 py-3 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white transition-transform active:scale-95">
                        <Copy size={20}/>
                        <span>Copiar Ubicación</span>
                    </button>
                </div>
            </div>
            <Toast message={toast.message} show={toast.show} onDismiss={() => setToast({ ...toast, show: false })} />
        </div>
    );
};


// --- Componente Principal SpeedDial ---
export default function SpeedDial({ onChatbotClick, isChatbotOpen }) {
    const [open, setOpen] = useState(false);
    const [showPanic, setShowPanic] = useState(false);

    // Paleta de colores ajustada a la marca "Pueblos de Ensueño"
    const items = [
        { type: "action", onClick: () => { setShowPanic(true); setOpen(false); }, icon: <AlertTriangle size={20} />, label: "Pánico", bg: "bg-red-600 hover:bg-red-700" },
        { type: "link", to: "/directorios", icon: <LifeBuoy size={20} />, label: "Directorios", bg: "bg-sky-600 hover:bg-sky-700" },
        { type: "action", onClick: () => { onChatbotClick?.(); setOpen(false); }, icon: <Bot size={20} />, label: "Chatbot", bg: "bg-teal-500 hover:bg-teal-600" },
        { type: "link", to: "/mapa", icon: <MapPin size={20} />, label: "Mapa", bg: "bg-green-600 hover:bg-green-700" },
    ];

    const handleMainButtonClick = () => {
        if (isChatbotOpen) {
            onChatbotClick?.();
            setOpen(false);
            return;
        }
        setOpen((s) => !s);
    };
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (open && !event.target.closest('.speed-dial-container')) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    return (
        <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[60] speed-dial-container">
            <div className="relative flex flex-col items-end gap-4">
                {/* --- Lista de Botones Vertical --- */}
                <div 
                    className={`flex flex-col items-end gap-4 transition-all duration-300 ${
                        open ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    {items.map((item, i) => {
                        const ButtonContent = (
                            <button
                                className={`w-12 h-12 rounded-full shadow-lg text-white grid place-items-center transition-all duration-200 active:scale-90 ${item.bg}`}
                                onClick={item.type === "action" ? item.onClick : undefined}
                                aria-label={item.label}
                            >
                                {item.icon}
                            </button>
                        );
                        
                        return (
                            <div
                                key={item.label}
                                className="flex items-center gap-3"
                                style={{
                                    transition: `transform 300ms cubic-bezier(.18,1.25,.4,1) ${50 * i}ms, opacity 200ms ease ${50 * i}ms`,
                                    transform: open ? 'translateX(0)' : 'translateX(10px)',
                                    opacity: open ? 1 : 0,
                                    pointerEvents: open ? "auto" : "none",
                                }}
                            >
                                <div className="bg-slate-800 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                                    {item.label}
                                </div>
                                {item.type === "link" ? <Link to={item.to}>{ButtonContent}</Link> : ButtonContent}
                            </div>
                        );
                    })}
                </div>

                {/* --- Botón Principal con color de marca --- */}
                <button
                    onClick={handleMainButtonClick}
                    aria-label={open ? "Cerrar menú" : "Abrir menú"}
                    aria-expanded={open}
                    className="w-16 h-16 rounded-full text-white shadow-xl grid place-items-center transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 transform"
                    style={{
                        background: "linear-gradient(135deg, #f97316, #ea580c)", // Gradiente naranja
                        boxShadow: "0 8px 25px rgba(234, 88, 12, 0.4)",
                    }}
                >
                    <div className="relative w-6 h-6">
                        <Plus size={24} className={`absolute transition-all duration-300 ease-in-out ${open ? "rotate-45 opacity-0" : "rotate-0 opacity-100"}`} />
                        <X size={24} className={`absolute transition-all duration-300 ease-in-out ${open ? "rotate-0 opacity-100" : "-rotate-45 opacity-0"}`} />
                    </div>
                </button>
            </div>
            
            {showPanic && <PanicModal onClose={() => setShowPanic(false)} />}
        </div>
    );
}

const styles = document.createElement('style');
styles.innerHTML = `
@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
@media (max-width: 640px) {
    .animate-slide-up {
        transform-origin: bottom;
    }
}
`;
document.head.appendChild(styles);


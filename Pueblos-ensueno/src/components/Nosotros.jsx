import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logo from '../assets/Logo.png';
import SpeedDial from "../components/SpeedDial";
import Chatbot from "../components/Chatbot";
import ArcelyImg from '../assets/Arcely.jpg';
import DulceImg from '../assets/Dulce.jpg';
import FernandoImg from '../assets/Fernando.jpg';
import DarwinImg from '../assets/Darwin.jpg';
import KevinImg from '../assets/Kevin.jpg';
import RonaldoImg from '../assets/Ronaldo.jpg';
import KristelImg from '../assets/Kristel.jpg';
import TeamImg from '../assets/Team.jpg';


// Datos del equipo (pon aquí tus rutas reales de fotos o déjalas en null para usar iniciales)
const TEAM = [
  { name: "Arcely Aquino Ruíz", role: "Asesora del Proyecto", img: ArcelyImg },
  { name: "Dulce María León De La O", role: "Co-Asesora del Proyecto", img: DulceImg },
  { name: "Fernando Estrella Martínez", role: "Estudiante", img: FernandoImg },
  { name: "Darwin Sánchez Cano", role: "Estudiante", img: DarwinImg },
  { name: "Kevin Priego Ulloa", role: "Estudiante", img: KevinImg },
  { name: "José Ronaldo León Evia", role: "Estudiante", img: RonaldoImg },
  { name: "Cindy Kristel De La Cruz López", role: "Estudiante", img: KristelImg },
];

// Tarjeta de integrante
function TeamCard({ name, role, img }) {
  // Si no hay imagen, mostramos iniciales
  const initials = name.split(" ").filter(Boolean).slice(0,2).map(w => w[0]).join("").toUpperCase();

  return (
    <div className="rounded-2xl bg-white/90 border border-sky-200 shadow-md hover:shadow-lg transition
                    hover:-translate-y-0.5 hover:border-sky-400 p-6 text-center">
      <div className="mx-auto mb-4 w-20 h-20 rounded-full ring-4 ring-white shadow
                      bg-gray-100 overflow-hidden flex items-center justify-center">
        {img ? (
          // Usa <img> porque aquí no estás importando assets con bundler
          <img src={img} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xl font-semibold text-gray-600">{initials}</span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 leading-snug">{name}</h3>
      <p className="mt-1 text-sm font-semibold text-sky-700">{role}</p>
    </div>
  );
}

export default function Nosotros() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [showChatbot, setShowChatbot] = useState(false);
  const navigate = useNavigate();

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="text-[var(--color-text)]">
      {/* HEADER (igual que en Home) */}
      <header className="sticky top-0 z-50 w-full py-4 px-6 flex justify-between items-center bg-[var(--color-primary)] shadow-md">
        <a href="#contenido-nosotros" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white px-3 py-2 rounded">
          Saltar al contenido principal
        </a>

<Link to="/" className="flex items-center gap-4">
  <img src={logo} alt="Pueblos de Ensueño - Logotipo" className="h-10 sm:h-12 w-auto" />
  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wide drop-shadow-md text-black">
    Pueblos de Ensueño
  </h1>
</Link>


        <nav aria-label="Navegación principal" className="hidden md:flex gap-3 lg:gap-5 items-center">
          {['/puntos-cercanos','/mapa','/InterestsSelector','/login'].map((path, i) => (
            <Link key={i} to={path}>
              <button className="px-4 py-2 bg-[var(--orange-250)] hover:bg-[var(--color-secondary)] text-black rounded-full font-semibold shadow-sm transition
                                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50">
                {['Puntos cercanos','Mapa Interactivo','Invitado','Iniciar sesión'][i]}
              </button>
            </Link>
          ))}
          <Link to="/">
            <button className="px-4 py-2 bg-[var(--orange-250)] hover:bg-[var(--color-secondary)] text-black rounded-full font-semibold shadow-sm transition
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50">
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

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <nav id="menu-movil" aria-label="Menú móvil" className="md:hidden bg-white shadow-md px-6 py-4 space-y-2 border-t border-black/10">
          {['/puntos-cercanos','/mapa','/InterestsSelector','/login'].map((path, i) => (
            <Link key={i} to={path}>
              <button className="w-full px-4 py-2 rounded-lg font-semibold bg-[var(--color-primary)] text-black hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 transition">
                {t(['menu.nearby','menu.map','menu.guest','menu.login'][i])}
              </button>
            </Link>
          ))}
        </nav>
      )}

      {/* CONTENIDO NOSOTROS */}
<main id="contenido-nosotros" className="px-4 sm:px-8 lg:px-24 py-12">
      {/* Imagen de equipo arriba */}
  <div className="mb-8">
<img
  src={TeamImg}
  alt="Foto grupal del equipo"
  className="w-3/4 mx-auto rounded-2xl shadow-lg object-cover"
 />

  </div>

  <h1 className="text-4xl font-extrabold text-center text-gray-900">Equipo Pueblos De Ensueño</h1>
  <p className="mt-2 text-center text-gray-600">
    
  </p>

  <div className="mt-10 grid gap-6
                  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {TEAM.map((m, idx) => (
      <TeamCard key={idx} {...m} />
    ))}
  </div>
</main>


      {/* FOOTER (igual que en Home) */}
      <footer className="py-12 text-center bg-[var(--color-primary)] text-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 px-4">
          <div>
            <img src={logo} alt="Pueblos de Ensueño - Logotipo" className="h-10 mb-3" />
            <p>{t('footer.description')}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-black">{t('footer.linksTitle')}</h4>
            <ul className="space-y-1">
              <li><Link to="/puntos-cercanos">{t('menu.nearby')}</Link></li>
              <li><Link to="/mapa">{t('menu.map')}</Link></li>
              <li><Link to="/InterestsSelector">{t('menu.guest')}</Link></li>
              <li><Link to="/login">{t('menu.login')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-black">{t('footer.techTitle')}</h4>
            <ul className="space-y-1">
              <li>React.js</li>
              <li>Node.js</li>
              <li>AWS</li>
              <li>MariaDB</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-black">{t('footer.contactTitle')}</h4>
            <p>9934535365</p>
            <p>✉️ info@pueblosdeensueno.mx</p>
            <p>📍 Villahermosa Tabasco</p>
          </div>
        </div>
        <div className="mt-10 pt-4 text-sm text-black/80 border-t border-black/10">
          © 2025 {t('footer.rights')}
        </div>
      </footer>

      {/* CHATBOT y SPEEDDIAL */}
      <Chatbot
        open={showChatbot}
        onClose={() => setShowChatbot(false)}
        actions={{
          navigate: (path) => navigate(path),
          scrollTo: (id) => scrollToId(id),
          changeLang: (lang) => i18n.changeLanguage(lang),
        }}
      />
      <SpeedDial onChatbotClick={() => setShowChatbot((s) => !s)} />
    </div>
  );
}

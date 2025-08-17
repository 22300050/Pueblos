import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import logo from '../assets/Logo.png';
import placeholder from '../assets/PueblosMagicos.png';
import LogoPueblos from '../assets/LogoPueblos.png'
import ArtesanosRA from '../assets/ArtesanosRA.png';
import ArtesanoGPS from '../assets/ArtesanoGPS.png';
import VisionMisionValores from '../assets/VisionMisionValores.png';
import { useTranslation } from 'react-i18next';
import SpeedDial from "../components/SpeedDial";
import Chatbot from "../components/Chatbot";
import { useNavigate } from "react-router-dom";
export default function Home() {

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
{/* HEADER */}
<header className="sticky top-0 z-50 w-full py-4 px-6 flex justify-between items-center bg-[var(--color-primary)] shadow-md">
  {/* Skip link para lectores/teclado */}
  <a href="#contenido-tabasco" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white px-3 py-2 rounded">
    Saltar al contenido principal
  </a>

<Link to="/" className="flex items-center gap-4">
  <img src={logo} alt="Pueblos de Ensueño - Logotipo" className="h-10 sm:h-12 w-auto" />
<h1 className="text-2xl sm:text-4xl font-extrabold tracking-wide drop-shadow-md text-black">
  {t('header.title')}
</h1>
</Link>


<nav aria-label="Navegación principal" className="hidden md:flex gap-3 lg:gap-5 items-center">
{['/mapa', '/login'].map((path, i) => (
  <Link key={i} to={path}>
    <button className="px-4 py-2 bg-[var(--orange-250)] hover:bg-[var(--color-secondary)] text-black rounded-full font-semibold shadow-sm transition
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50">
      {[t('menu.map'), t('menu.login')][i]}
    </button>
  </Link>
))}


  {/* Aquí insertas el switch de idioma */}
  <div className="relative inline-flex items-center px-1 py-1 bg-[var(--orange-250)] rounded-full shadow-sm">
    <button
      onClick={() => i18n.changeLanguage("es")}
      className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
        i18n.language === "es"
          ? "bg-[var(--color-secondary)] text-white"
          : "text-black"
      }`}
    >
      ES
    </button>
    <button
      onClick={() => i18n.changeLanguage("en")}
      className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
        i18n.language === "en"
          ? "bg-[var(--color-secondary)] text-white"
          : "text-black"
      }`}
    >
      EN
    </button>
  </div>
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



{/* Hero with Video */}
<main id="contenido" className="flex flex-col lg:flex-row justify-between items-center px-4 sm:px-8 lg:px-24 py-12 sm:py-20 bg-gradient-to-t from-[var(--color-cuatro)]/100 to-[var(--color-secondary)]/35">
  <div className="max-w-full lg:max-w-xl text-center lg:text-left">
    <h2 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold mb-4 leading-tight">
      {t('hero.subtitle')}
      <br />
      <span className="text-yellow-700">{t('header.title')}</span>
    </h2>
    <p className="text-base sm:text-lg mb-6 max-w-prose mx-auto lg:mx-0">
      {t('hero.text')}
    </p>
    <div className="flex gap-3 justify-center lg:justify-start">
<Link to="/nosotros">
  <button
    className="px-6 py-3 rounded-full font-semibold bg-[var(--color-secondary)] text-white hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 transition"
    aria-label="Nuestro equipo"
  >
    Nuestro equipo
  </button>
</Link>

      <button
        onClick={() => scrollToId('como-funciona')}
        className="px-6 py-3 rounded-full font-semibold border border-black/20 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 transition"
      >
        {t('section.howTitle')}
      </button>
    </div>
  </div>

  {/* Hero con imagen sin wrapper */}
  <img
    src={placeholder}
    alt="Escena de Pueblos de Ensueño"
    className="w-full lg:w-1/2 h-auto object-contain border-0 rounded-2xl shadow-none"
  />
</main>
<section
  id="que-es"
  className="
    px-4 sm:px-8 lg:px-24 
    py-12 
    bg-gradient-to-b 
    from-[var(--color-cuatro)]/100 
    to-[var(--color-verde)]/75 
    text-[var(--color-text)]
  "
>
  <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start gap-10">
    {/* Imagen a la izquierda */}
    <img
      src={LogoPueblos}
      alt="Logo Pueblos de Ensueño"
      className="w-full md:w-1/3 rounded-lg object-cover"
      loading="lazy" decoding="async"
    />

    {/* Texto a la derecha */}
    <div className="flex-1">
      <h2 className="text-3xl font-extrabold mb-6 text-center md:text-left">
        {t('section.whatIsTitle')}
      </h2>
      <p className="text-lg leading-relaxed max-w-prose text-left">
        {t('section.whatIsText')}
      </p>
    </div>
  </div>
</section>


<section
  id="tecnologia"
  className="
    px-4 sm:px-8 lg:px-24 
    py-12 
    bg-gradient-to-b 
    from-[var(--color-verde)]/75 
    to-[var(--color-verde)]/75 
    text-[var(--color-text)]
  "
>
  <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
    {/* Izquierda: título + lista */}
    <div className="md:w-2/3">
      <h2 className="text-3xl font-extrabold mb-6 text-center md:text-left">
        {t('section.techTitle')}
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <li>🔹 {t('section.tech.ar')}</li>
        <li>🔹 {t('section.tech.maps')}</li>
        <li>🔹 {t('section.tech.chatbot')}</li>
        <li>🔹 {t('section.tech.itineraries')}</li>
        <li>🔹 {t('section.tech.interactiveMap')}</li>
        <li>🔹 {t('section.tech.gps')}</li>
      </ul>
    </div>

    {/* Derecha: imagen */}
    <img
      src={ArtesanosRA}
      alt="Representación de artesanos con RA"
      className="w-full md:w-1/3 rounded-lg object-cover"
      loading="lazy" decoding="async"
    />
  </div>
</section>

<section
  id="por-que"
  className="px-4 sm:px-8 lg:px-24 py-12 bg-gradient-to-b from-[var(--color-verde)]/75 to-[var(--color-marron)]/75 text-[var(--color-text)]"
>
  <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
    {/* Imagen a la izquierda */}
    <img
      src={ArtesanoGPS}
      alt="Artesano mostrando GPS"
      className="w-full md:w-1/3 rounded-lg object-cover"
      loading="lazy" decoding="async"
    />

    {/* Texto a la derecha */}
    <div className="flex-1">
      <h2 className="text-3xl font-extrabold mb-6 text-center md:text-left">
        {t('section.whyTitle')}
      </h2>
      <ul className="list-disc list-inside text-lg space-y-2 max-w-prose text-left">
        <li>{t('section.why.item1')}</li>
        <li>{t('section.why.item2')}</li>
        <li>{t('section.why.item3')}</li>
        <li>{t('section.why.item4')}</li>
      </ul>
    </div>
  </div>
</section>


<section id="vision-mision-valores" className="px-4 sm:px-8 lg:px-24 py-12 bg-[var(--color-marron)]/75">
  <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 items-center">
    {/* Visión */}
    <div>
      <h3 className="text-xl font-semibold mb-2">{t('section.vision.title')}</h3>
      <p>{t('section.vision.text')}</p>
    </div>

    {/* Misión */}
    <div>
      <h3 className="text-xl font-semibold mb-2">{t('section.mission.title')}</h3>
      <p>{t('section.mission.text')}</p>
    </div>

    {/* Valores */}
    <div>
      <h3 className="text-xl font-semibold mb-2">{t('section.values.title')}</h3>
      <ul className="list-disc list-inside">
        <li>{t('section.values.item1')}</li>
        <li>{t('section.values.item2')}</li>
        <li>{t('section.values.item3')}</li>
        <li>{t('section.values.item4')}</li>
      </ul>
    </div>

    {/* Imagen a la derecha */}
    <div className="flex justify-center md:justify-end">
      <img
        src={VisionMisionValores}
        alt="Visión, Misión y Valores"
        className="w-32 h-32 md:w-70 md:h-70 rounded-lg object-cover"
        loading="lazy" decoding="async"
      />
    </div>
  </div>
</section>


      {/* Cómo Funciona */}
<section id="como-funciona" className="px-4 sm:px-8 lg:px-24 py-12 bg-gradient-to-b from-[var(--color-marron)]/75 to-[var(--color-secondary)]/75 text-[var(--color-text)]">
  <div className="max-w-4xl mx-auto mb-8 text-center">
    <h2 className="text-3xl font-extrabold">{t('section.howTitle')}</h2>
  </div>
  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 px-4 sm:px-0">
    {/* Video en la primera columna */}
    <div className="lg:w-1/2">
      <video
        src="/video-mexico.mp4"
        className="w-full h-48 sm:h-64 md:h-80 rounded-2xl shadow-2xl object-cover"
        controls
        playsInline
        preload="metadata"
        onEnded={e => e.currentTarget.pause()}
      />
    </div>
    {/* Lista de pasos en la segunda columna */}
    <div className="lg:w-1/2">
      <ol className="list-decimal list-inside space-y-2 text-lg max-w-prose text-left">
        <li>{t('section.how.step1')}</li>
        <li>{t('section.how.step2')}</li>
        <li>{t('section.how.step3')}</li>
        <li>{t('section.how.step4')}</li>
        <li>{t('section.how.step5')}</li>
      </ol>
    </div>
  </div>
</section>
      {/* CTA Final */}
      <section className="py-12 text-center bg-[var(--color-secondary)]/75">
        <h2 className="text-3xl font-bold mb-2">{t('cta.title')}</h2>
        <p className="mb-6 text">{t('cta.text')}</p>
        <Link to="/registro">
          <button className="px-6 py-3 rounded-full font-semibold bg-[var(--color-primary)] transition">
            {t('cta.button')}
          </button>
        </Link>
      </section>

{/* Footer */}
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

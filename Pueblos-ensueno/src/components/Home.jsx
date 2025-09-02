// Archivo: src/components/Home.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

// 1. Importamos los nuevos componentes que creamos
import Navbar from './Navbar';
import Footer from './Footer';

// 2. Importamos solo las imágenes y componentes necesarios para esta página
import placeholder from '../assets/PueblosMagicos.png';
import LogoPueblos from '../assets/LogoPueblos.png';
import ArtesanosRA from '../assets/ArtesanosRA.png';
import ArtesanoGPS from '../assets/ArtesanoGPS.png';
import VisionMisionValores from '../assets/VisionMisionValores.png';
import SpeedDial from "./SpeedDial";
import Chatbot from "./Chatbot";

export default function Home() {
  const { t, i18n } = useTranslation();
  const [showChatbot, setShowChatbot] = useState(false);
  const navigate = useNavigate();
  
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-white">
      
      {/* 3. Usamos el componente Navbar */}
      <Navbar />

      {/* Hero Section - GRIS #EAEAEA */}
      <main id="contenido" className="flex flex-col lg:flex-row justify-between items-center px-4 sm:px-8 lg:px-24 py-12 sm:py-20 bg-[#EAEAEA]">
        <div className="max-w-full lg:max-w-xl text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold mb-4 leading-tight text-zinc-800">
            {t('hero.subtitle')}
            <br />
            <span className="text-[#D92626]">{t('header.title')}</span>
          </h2>
          <p className="text-base sm:text-lg mb-6 max-w-prose mx-auto lg:mx-0 text-zinc-700">
            {t('hero.text')}
          </p>
          <div className="flex gap-3 justify-center lg:justify-start">
            <Link to="/nosotros">
              <button className="px-6 py-3 rounded-full font-semibold bg-[#D92626] text-white hover:opacity-90 transition">
                Nuestro equipo
              </button>
            </Link>
            <button
              onClick={() => scrollToId('como-funciona')}
              className="px-6 py-3 rounded-full font-semibold border border-gray-300 bg-white hover:bg-gray-200 text-zinc-800 transition"
            >
              {t('section.howTitle')}
            </button>
          </div>
        </div>
        <img src={placeholder} alt="Escena de Pueblos de Ensueño" className="w-full lg:w-1/2 h-auto object-contain mt-8 lg:mt-0" />
      </main>
      
      {/* ¿Qué es? - BLANCO */}
      <section id="que-es" className="px-4 sm:px-8 lg:px-24 py-16 bg-white text-zinc-800">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <img src={LogoPueblos} alt="Logo Pueblos de Ensueño" className="w-full md:w-1/3 rounded-lg object-cover" />
          <div className="flex-1">
            <h2 className="text-3xl font-extrabold mb-6 text-center md:text-left">{t('section.whatIsTitle')}</h2>
            <p className="text-lg leading-relaxed max-w-prose text-left">{t('section.whatIsText')}</p>
          </div>
        </div>
      </section>

      {/* Tecnología - GRIS #EAEAEA */}
      <section id="tecnologia" className="px-4 sm:px-8 lg:px-24 py-16 bg-[#EAEAEA] text-zinc-800">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-2/3">
            <h2 className="text-3xl font-extrabold mb-6 text-center md:text-left">{t('section.techTitle')}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-lg">
              <li className="flex items-center gap-3">🔹 {t('section.tech.ar')}</li>
              <li className="flex items-center gap-3">🔹 {t('section.tech.maps')}</li>
              <li className="flex items-center gap-3">🔹 {t('section.tech.chatbot')}</li>
              <li className="flex items-center gap-3">🔹 {t('section.tech.itineraries')}</li>
              <li className="flex items-center gap-3">🔹 {t('section.tech.interactiveMap')}</li>
              <li className="flex items-center gap-3">🔹 {t('section.tech.gps')}</li>
            </ul>
          </div>
          <img src={ArtesanosRA} alt="Representación de artesanos con RA" className="w-full md:w-1/3 rounded-lg object-cover mt-8 md:mt-0" />
        </div>
      </section>

      {/* ¿Por qué? - BLANCO */}
      <section id="por-que" className="px-4 sm:px-8 lg:px-24 py-16 bg-white text-zinc-800">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <img src={ArtesanoGPS} alt="Artesano mostrando GPS" className="w-full md:w-1/3 rounded-lg object-cover" />
          <div className="flex-1">
            <h2 className="text-3xl font-extrabold mb-6 text-center md:text-left">{t('section.whyTitle')}</h2>
            <ul className="list-disc list-inside text-lg space-y-3 max-w-prose text-left">
              <li>{t('section.why.item1')}</li>
              <li>{t('section.why.item2')}</li>
              <li>{t('section.why.item3')}</li>
              <li>{t('section.why.item4')}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Visión, Misión y Valores - GRIS #EAEAEA */}
      <section id="vision-mision-valores" className="px-4 sm:px-8 lg:px-24 py-16 bg-[#EAEAEA] text-zinc-800">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 items-center">
          <div><h3 className="text-xl font-semibold mb-2">{t('section.vision.title')}</h3><p>{t('section.vision.text')}</p></div>
          <div><h3 className="text-xl font-semibold mb-2">{t('section.mission.title')}</h3><p>{t('section.mission.text')}</p></div>
          <div><h3 className="text-xl font-semibold mb-2">{t('section.values.title')}</h3><ul className="list-disc list-inside"><li>{t('section.values.item1')}</li><li>{t('section.values.item2')}</li><li>{t('section.values.item3')}</li><li>{t('section.values.item4')}</li></ul></div>
          <div className="flex justify-center md:justify-end"><img src={VisionMisionValores} alt="Visión, Misión y Valores" className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-contain" /></div>
        </div>
      </section>

      {/* Cómo Funciona - BLANCO */}
      <section id="como-funciona" className="px-4 sm:px-8 lg:px-24 py-16 bg-white text-zinc-800">
        <div className="max-w-4xl mx-auto mb-8 text-center"><h2 className="text-3xl font-extrabold">{t('section.howTitle')}</h2></div>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2"><video src="/video-mexico.mp4" className="w-full rounded-2xl shadow-xl object-cover" controls playsInline preload="metadata" /></div>
          <div className="lg:w-1/2"><ol className="list-decimal list-inside space-y-3 text-lg max-w-prose text-left"><li>{t('section.how.step1')}</li><li>{t('section.how.step2')}</li><li>{t('section.how.step3')}</li><li>{t('section.how.step4')}</li><li>{t('section.how.step5')}</li></ol></div>
        </div>
      </section>

      {/* CTA Final - GRIS #EAEAEA */}
      <section className="py-16 text-center bg-[#EAEAEA] text-zinc-800">
        <h2 className="text-3xl font-bold mb-2">{t('cta.title')}</h2>
        <p className="mb-6 text-lg">{t('cta.text')}</p>
        <Link to="/registro">
          <button className="px-8 py-3 rounded-full font-semibold bg-[#D92626] text-white hover:opacity-90 transition-transform hover:scale-105">
            {t('cta.button')}
          </button>
        </Link>
      </section>

      {/* 4. Usamos el componente Footer */}
      <Footer />
      
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
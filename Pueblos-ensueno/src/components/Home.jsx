// Archivo: src/components/Home.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
// Al inicio de src/components/Home.jsx
import { View, Sparkles, Bot, Route, MapPin, Navigation } from 'lucide-react';

import Navbar from './Navbar';
import Footer from './Footer';

import placeholder from '../assets/img2D/PueblosMagicos.png';
import LogoPueblos from '../assets/Logos/LogoPueblos.png';
import ArtesanosRA from '../assets/img2D/ArtesanosRA.png';
import ArtesanoGPS from '../assets/img2D/ArtesanoGPS.png';
import VisionMisionValores from '../assets/img2D/VisionMisionValores.png';
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
      
      <Navbar />

    {/* Hero Section - DISEÑO RESPONSIVO MEJORADO */}
      <main id="contenido" className="container mx-auto grid lg:grid-cols-2 gap-12 items-center px-6 py-16 ">
        
        {/* Lado Izquierdo: Texto y Botones */}
        <div className="text-center lg:text-left">
          {/* Título */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-800 mb-5 leading-tight">
            {t('hero.subtitle')}
            <br />
            <span className="text-[#F39106]">{t('header.title')}</span>
          </h2>

          {/* Párrafo */}
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto lg:mx-0 text-gray-600">
            {t('hero.text')}
          </p>

          {/* Botones - AJUSTES AQUÍ */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/nosotros" className="w-full sm:w-auto"> {/* Añadido w-full en móvil */}
              <button className="w-full sm:w-auto px-6 py-3 rounded-full font-bold bg-[#F39106] text-white shadow-lg hover:bg-opacity-90 transition-all transform hover:-translate-y-1">
                Nuestro equipo
              </button>
            </Link>
            <button
              onClick={() => scrollToId('como-funciona')}
              className="w-full sm:w-auto px-6 py-3 rounded-full font-bold border-2 border-[#F39106] text-[#F39106] bg-transparent hover:bg-[#F39106] hover:text-white shadow-md transition-all transform hover:-translate-y-1"
            >
              {t('section.howTitle')}
            </button>
          </div>
        </div>
        
        {/* Lado Derecho: Imagen */}
        <div className="w-full mt-10 lg:mt-0">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
            <img
              src={placeholder}
              alt="Escena de Pueblos de Ensueño"
              className="w-full h-auto object-contain rounded-2xl" 
            />
          </div>
        </div>

      </main>
      
    {/* ¿Qué es? - PADDING VERTICAL REDUCIDO */}
      <section id="que-es" className="bg-[#EAEAEA] py-12 lg:py-10">
        <div className="container mx-auto grid lg:grid-cols-3 gap-16 items-center px-10 lg:px-20">
          
          {/* Lado Izquierdo: Imagen */}
          <div className="w-full lg:col-span-1">
            <img
              src={LogoPueblos}
              alt="Logo Pueblos de Ensueño"
              className="w-full h-auto object-cover rounded-2xl shadow-xl"
              loading="lazy" 
              decoding="async"
            />
          </div>

          {/* Lado Derecho: Texto */}
          <div className="lg:col-span-2 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-zinc-800 leading-tight">
              {t('section.whatIsTitle')}
            </h2>
            
            <div className="w-24 h-1.5 bg-[#F39106] mt-4 mb-6 mx-auto lg:mx-0"></div>

            <p className="text-lg text-gray-600 leading-relaxed">
              {t('section.whatIsText')}
            </p>
          </div>
        </div>
      </section>

{/* Tecnología - IMAGEN SIN FONDO DE COLOR */}
      <section id="tecnologia" className="bg-white py-12 lg:py-20">
        <div className="container mx-auto grid lg:grid-cols-3 gap-16 items-center px-8 md:px-12 lg:px-20">
          
          {/* Lado Izquierdo: Título y Lista de Características */}
          <div className="lg:col-span-2 mt-10 lg:mt-0">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-black text-zinc-800 leading-tight">
                {t('section.techTitle')}
              </h2>
              <div className="w-24 h-1.5 bg-[#F39106] mt-4 mb-6 mx-auto lg:mx-0"></div>
            </div>
            
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-6 mt-8">
              <li className="flex items-start gap-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <View className="w-6 h-6 text-[#C3272B]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-800">Realidad Aumentada</h3>
                  <p className="text-gray-600">{t('section.tech.ar')}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Sparkles className="w-6 h-6 text-[#F39106]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-800">Recomendaciones</h3>
                  <p className="text-gray-600">{t('section.tech.maps')}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Bot className="w-6 h-6 text-[#2E7D32]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-800">Chatbot Inteligente</h3>
                  <p className="text-gray-600">{t('section.tech.chatbot')}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Route className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-800">Itinerarios Personalizados</h3>
                  <p className="text-gray-600">{t('section.tech.itineraries')}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-pink-100 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-[#E94E80]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-800">Mapa Interactivo</h3>
                  <p className="text-gray-600">{t('section.tech.interactiveMap')}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-gray-200 p-3 rounded-full">
                  <Navigation className="w-6 h-6 text-[#1A2B3B]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-800">GPS para Artesanos</h3>
                  <p className="text-gray-600">{t('section.tech.gps')}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Lado Derecho: Imagen (diseño simple) */}
          <div className="w-full lg:col-span-1">
            <img
              src={ArtesanosRA}
              alt="Representación de artesanos con Realidad Aumentada"
              className="w-full h-auto object-cover rounded-2xl shadow-xl"
              loading="lazy"
              decoding="async"
            />
          </div>

        </div>
      </section>

      <section id="por-que" className="px-4 sm:px-8 lg:px-24 py-16 bg-[#EAEAEA] text-zinc-800">
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

      <section id="vision-mision-valores" className="px-4 sm:px-8 lg:px-24 py-16 bg-[#EAEAEA] text-zinc-800">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 items-center">
          <div><h3 className="text-xl font-semibold mb-2">{t('section.vision.title')}</h3><p>{t('section.vision.text')}</p></div>
          <div><h3 className="text-xl font-semibold mb-2">{t('section.mission.title')}</h3><p>{t('section.mission.text')}</p></div>
          <div><h3 className="text-xl font-semibold mb-2">{t('section.values.title')}</h3><ul className="list-disc list-inside"><li>{t('section.values.item1')}</li><li>{t('section.values.item2')}</li><li>{t('section.values.item3')}</li><li>{t('section.values.item4')}</li></ul></div>
          <div className="flex justify-center md:justify-end"><img src={VisionMisionValores} alt="Visión, Misión y Valores" className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-contain" /></div>
        </div>
      </section>

      <section id="como-funciona" className="px-4 sm:px-8 lg:px-24 py-16 bg-white text-zinc-800">
        <div className="max-w-4xl mx-auto mb-8 text-center"><h2 className="text-3xl font-extrabold">{t('section.howTitle')}</h2></div>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2"><video src="/video-mexico.mp4" className="w-full rounded-2xl shadow-xl object-cover" controls playsInline preload="metadata" /></div>
          <div className="lg:w-1/2"><ol className="list-decimal list-inside space-y-3 text-lg max-w-prose text-left"><li>{t('section.how.step1')}</li><li>{t('section.how.step2')}</li><li>{t('section.how.step3')}</li><li>{t('section.how.step4')}</li><li>{t('section.how.step5')}</li></ol></div>
        </div>
      </section>

      <section className="py-16 text-center bg-[#EAEAEA] text-zinc-800">
        <h2 className="text-3xl font-bold mb-2">{t('cta.title')}</h2>
        <p className="mb-6 text-lg">{t('cta.text')}</p>
        <Link to="/registro">
          <button className="px-8 py-3 rounded-full font-semibold bg-[#D92626] text-white hover:opacity-90 transition-transform hover:scale-105">
            {t('cta.button')}
          </button>
        </Link>
      </section>

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
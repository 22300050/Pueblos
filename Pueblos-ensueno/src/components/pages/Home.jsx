// Archivo: src/components/Home.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { View, Sparkles, Bot, Route, MapPin, Navigation, CheckCircle, Eye, Target, Gem, Check } from 'lucide-react';

// Componentes flotantes
import SpeedDial from "../SpeedDial";
import Chatbot from "../Chatbot";

// Imágenes
import placeholder from '../../assets/img2D/PueblosMagicos.png';
import LogoPueblos from '../../assets/Logos/LogoPueblos.png';
import ArtesanosRA from '../../assets/img2D/ArtesanosRA.png';
import ArtesanoGPS from '../../assets/img2D/ArtesanoGPS.png';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [showChatbot, setShowChatbot] = useState(false);
  const navigate = useNavigate();
  
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    // El div principal ya no necesita <Navbar />, App.jsx se encarga de eso.
    <div className="bg-white">

      {/* Hero Section */}
      <main id="contenido" className="container mx-auto grid lg:grid-cols-2 gap-12 items-center px-8 md:px-10 lg:px-20 py-10 lg:py-20">
        <div className="text-center lg:text-left">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-800 mb-5 leading-tight">
            {t('hero.subtitle')}
            <br />
            <span className="text-[#F39106]">{t('header.title')}</span>
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto lg:mx-0 text-gray-600">
            {t('hero.text')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
            <Link to="/nosotros">
              <button className="px-6 py-3 rounded-full font-bold bg-[#F39106] text-white shadow-lg hover:bg-opacity-90 transition-all transform hover:-translate-y-1">
                Nuestro equipo
              </button>
            </Link>
            <button
              onClick={() => scrollToId('como-funciona')}
              className="px-6 py-3 rounded-full font-bold border-2 border-[#F39106] text-[#F39106] bg-transparent hover:bg-[#F39106] hover:text-white shadow-md transition-all transform hover:-translate-y-1"
            >
              {t('section.howTitle')}
            </button>
          </div>
        </div>
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
      
      {/* ¿Qué es? */}
      <section id="que-es" className="bg-[#EAEAEA] py-10 lg:py-20">
        <div className="container mx-auto grid lg:grid-cols-3 gap-16 items-center px-8 md:px-10 lg:px-20">
          <div className="w-full lg:col-span-1">
            <img src={LogoPueblos} alt="Logo Pueblos de Ensueño" className="w-full h-auto object-cover rounded-2xl shadow-xl" loading="lazy" decoding="async" />
          </div>
          <div className="lg:col-span-2 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-zinc-800 leading-tight">{t('section.whatIsTitle')}</h2>
            <div className="w-24 h-1.5 bg-[#F39106] mt-4 mb-6 mx-auto lg:mx-0"></div>
            <p className="text-lg text-gray-600 leading-relaxed">{t('section.whatIsText')}</p>
          </div>
        </div>
      </section>

      {/* Tecnología */}
      <section id="tecnologia" className="bg-white py-10 lg:py-20">
        <div className="container mx-auto grid lg:grid-cols-3 gap-16 items-center px-8 md:px-10 lg:px-20">
          <div className="lg:col-span-2 mt-10 lg:mt-0">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-black text-zinc-800 leading-tight">{t('section.techTitle')}</h2>
              <div className="w-24 h-1.5 bg-[#F39106] mt-4 mb-6 mx-auto lg:mx-0"></div>
            </div>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-6 mt-8">
              <li className="flex items-start gap-4">
                <div className="bg-red-100 p-3 rounded-full"><View className="w-6 h-6 text-[#C3272B]" /></div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-800">Realidad Aumentada</h3>
                  <p className="text-gray-600">{t('section.tech.ar')}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-yellow-100 p-3 rounded-full"><Sparkles className="w-6 h-6 text-[#F39106]" /></div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-800">Recomendaciones</h3>
                  <p className="text-gray-600">{t('section.tech.maps')}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full"><Bot className="w-6 h-6 text-[#2E7D32]" /></div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-800">Chatbot Inteligente</h3>
                  <p className="text-gray-600">{t('section.tech.chatbot')}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full"><Route className="w-6 h-6 text-blue-600" /></div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-800">Itinerarios Personalizados</h3>
                  <p className="text-gray-600">{t('section.tech.itineraries')}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-pink-100 p-3 rounded-full"><MapPin className="w-6 h-6 text-[#E94E80]" /></div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-800">Mapa Interactivo</h3>
                  <p className="text-gray-600">{t('section.tech.interactiveMap')}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-gray-200 p-3 rounded-full"><Navigation className="w-6 h-6 text-[#1A2B3B]" /></div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-800">GPS para Artesanos</h3>
                  <p className="text-gray-600">{t('section.tech.gps')}</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="w-full lg:col-span-1">
            <img src={ArtesanosRA} alt="Representación de artesanos con Realidad Aumentada" className="w-full h-auto object-cover rounded-2xl shadow-xl" loading="lazy" decoding="async" />
          </div>
        </div>
      </section>

      {/* ¿Por qué? */}
      <section id="por-que" className="bg-[#EAEAEA] py-10 lg:py-20">
        <div className="container mx-auto grid lg:grid-cols-3 gap-16 items-center px-8 md:px-10 lg:px-20">
          <div className="w-full lg:col-span-1">
            <img src={ArtesanoGPS} alt="Artesano mostrando ubicación en el mapa" className="w-full h-auto object-cover rounded-2xl shadow-xl" loading="lazy" decoding="async" />
          </div>
          <div className="lg:col-span-2">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-black text-zinc-800 leading-tight">{t('section.whyTitle')}</h2>
              <div className="w-24 h-1.5 bg-[#F39106] mt-4 mb-6 mx-auto lg:mx-0"></div>
            </div>
            <ul className="space-y-5 mt-8">
              <li className="flex items-start gap-4">
                <CheckCircle className="w-7 h-7 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-lg text-gray-700">{t('section.why.item1')}</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle className="w-7 h-7 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-lg text-gray-700">{t('section.why.item2')}</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle className="w-7 h-7 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-lg text-gray-700">{t('section.why.item3')}</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle className="w-7 h-7 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-lg text-gray-700">{t('section.why.item4')}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Visión, Misión y Valores */}
      <section id="vision-mision-valores" className="bg-white py-10 lg:py-20">
        <div className="container mx-auto px-8 md:px-10 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-zinc-800 leading-tight">Nuestros Principios</h2>
            <div className="w-24 h-1.5 bg-[#F39106] mt-4 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl border-t-8 border-[#F39106] transition-transform duration-300 hover:-translate-y-2 h-full">
              <Eye className="w-12 h-12 text-[#F39106] mb-5" />
              <h3 className="text-2xl font-bold text-zinc-800 mb-3">{t('section.vision.title')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('section.vision.text')}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl border-t-8 border-[#C3272B] transition-transform duration-300 hover:-translate-y-2 h-full">
              <Target className="w-12 h-12 text-[#C3272B] mb-5" />
              <h3 className="text-2xl font-bold text-zinc-800 mb-3">{t('section.mission.title')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('section.mission.text')}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl border-t-8 border-[#2E7D32] transition-transform duration-300 hover:-translate-y-2 h-full">
              <Gem className="w-12 h-12 text-[#2E7D32] mb-5" />
              <h3 className="text-2xl font-bold text-zinc-800 mb-3">{t('section.values.title')}</h3>
              <ul className="space-y-3 text-left text-gray-600">
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" /><span>{t('section.values.item1')}</span></li>
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" /><span>{t('section.values.item2')}</span></li>
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" /><span>{t('section.values.item3')}</span></li>
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" /><span>{t('section.values.item4')}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section id="como-funciona" className="bg-[#EAEAEA] py-10 lg:py-20">
        <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center px-8 md:px-10 lg:px-20">
          <div>
            <div className="text-center lg:text-left mb-10">
              <h2 className="text-4xl md:text-5xl font-black text-zinc-800 leading-tight">{t('section.howTitle')}</h2>
              <div className="w-24 h-1.5 bg-[#F39106] mt-4 mb-6 mx-auto lg:mx-0"></div>
            </div>
            <ol className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-[#F39106] w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">1</div>
                <p className="text-lg text-gray-700 pt-1">{t('section.how.step1')}</p>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-[#F39106] w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">2</div>
                <p className="text-lg text-gray-700 pt-1">{t('section.how.step2')}</p>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-[#F39106] w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">3</div>
                <p className="text-lg text-gray-700 pt-1">{t('section.how.step3')}</p>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-[#F39106] w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">4</div>
                <p className="text-lg text-gray-700 pt-1">{t('section.how.step4')}</p>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-[#F39106] w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">5</div>
                <p className="text-lg text-gray-700 pt-1">{t('section.how.step5')}</p>
              </li>
            </ol>
          </div>
          <div className="relative w-full">
            <div className="absolute top-0 left-0 w-full h-full bg-green-300 rounded-2xl transform translate-x-4 translate-y-4"></div>
            <video src="/video-mexico.mp4" className="relative z-10 w-full rounded-2xl shadow-xl object-cover" controls playsInline preload="metadata" />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative bg-white pt-20 pb-16 lg:pt-24 lg:pb-20">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[linear-gradient(to_right,_#D92626,_#3A994A,_#F2B705,_#1C69A6)]"></div>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-zinc-800 mb-4">{t('cta.title')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600">{t('cta.text')}</p>
          <Link to="/registro">
            <button className="px-10 py-4 rounded-full font-bold bg-[#F39106] text-white shadow-lg transition-all duration-300 hover:bg-opacity-90 transform hover:-translate-y-1">
              {t('cta.button')}
            </button>
          </Link>
        </div>
      </section>
      
      {/* El Footer no se incluye aquí, porque ya está en App.jsx */}
      
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
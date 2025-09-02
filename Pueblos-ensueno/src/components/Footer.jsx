// Archivo: src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin } from 'lucide-react';
import logo from '../assets/Logos/Logo.png'; 

export default function Footer() {
  const { t } = useTranslation();

  return (
    <>
      <div className="h-1.5 w-full bg-[linear-gradient(to_right,_#D92626,_#3A994A,_#F2B705,_#1C69A6)]"></div>
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 px-4 text-left">
          <div className="flex flex-col items-center sm:items-start">
            <img src={logo} alt="Pueblos de Ensueño - Logotipo" className="h-12 mb-4" />
            <p className="text-center sm:text-left">{t('footer.description')}</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">{t('footer.linksTitle')}</h4>
            <ul className="space-y-2">
              <li><Link to="/puntos-cercanos" className="hover:text-white transition-colors">{t('menu.nearby')}</Link></li>
              <li><Link to="/mapa" className="hover:text-white transition-colors">{t('menu.map')}</Link></li>
              <li><Link to="/InterestsSelector" className="hover:text-white transition-colors">{t('menu.guest')}</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">{t('menu.login')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">{t('footer.techTitle')}</h4>
            <ul className="space-y-2">
              <li>React.js</li>
              <li>Node.js</li>
              <li>AWS</li>
              <li>MariaDB</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">{t('footer.contactTitle')}</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2"><Phone size={16} /><span>9934535365</span></li>
              <li className="flex items-center gap-2"><Mail size={16} /><span>info@pueblosdeensueno.mx</span></li>
              <li className="flex items-center gap-2"><MapPin size={16} /><span>Villahermosa, Tabasco</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 text-center text-sm text-gray-500 border-t border-white/10">
          © {new Date().getFullYear()} {t('footer.rights')}
        </div>
      </footer>
    </>
  );
}
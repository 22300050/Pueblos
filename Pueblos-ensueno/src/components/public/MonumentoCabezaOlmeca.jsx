import React from "react";
import { Link } from "react-router-dom";
import cabezaOlmecaImg from "../../assets/img/Tabasco/monumento/cabeza-olmeca.jpg";
// Íconos cambiados por alternativas más seguras y comunes
import { ArrowLeft, Box, MapPin, Clock, Ruler, Anchor, Gem } from 'lucide-react'; 

export default function MonumentoCabezaOlmeca() {
  const stats = [
    { icon: <MapPin className="w-6 h-6 text-orange-500" />, label: "Ubicación original", value: "Zona arqueológica de La Venta, Tabasco." },
    { icon: <Clock className="w-6 h-6 text-orange-500" />, label: "Periodo estimado", value: "1200 a.C. – 400 a.C." },
    { icon: <Ruler className="w-6 h-6 text-orange-500" />, label: "Altura", value: "~2.4 metros" }, // 'Scaling' cambiado por 'Ruler'
    { icon: <Anchor className="w-6 h-6 text-orange-500" />, label: "Peso aproximado", value: "8 toneladas" }, // 'Weight' cambiado por 'Anchor'
    { icon: <Gem className="w-6 h-6 text-orange-500" />, label: "Material", value: "Basalto volcánico" }, // 'Stone' cambiado por 'Gem'
  ];

  return (
    <div className="bg-slate-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <main className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 md:p-10">
          
          {/* Botón para regresar */}
          <div className="mb-8">
            <Link to="/puntos-cercanos" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-orange-600 transition-colors">
              <ArrowLeft size={16} />
              Volver a Puntos Cercanos
            </Link>
          </div>

          <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
            
            {/* --- Columna Izquierda (Imagen y Botón RA) --- */}
            <div className="md:col-span-2 space-y-5">
              <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200">
                <img
                  src={cabezaOlmecaImg}
                  alt="Cabeza olmeca en el Parque Museo La Venta"
                  className="w-full h-auto object-cover"
                />
              </div>
              <a
                href="https://kevinpriego.8thwall.app/cabezaolmeca/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-full bg-orange-500 text-white font-bold shadow-lg hover:bg-orange-600 transition-all transform hover:scale-105"
              >
                <Box size={22} />
                <span>Ver en Realidad Aumentada</span>
              </a>
            </div>

            {/* --- Columna Derecha (Información y Stats) --- */}
            <div className="md:col-span-3">
              <h1 className="text-3xl lg:text-4xl font-black text-zinc-800 mb-4 leading-tight">
                Monumento a la Cabeza Olmeca
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                Las cabezas colosales son uno de los legados más enigmáticos y representativos de la civilización olmeca, considerada la “cultura madre” de Mesoamérica.
              </p>

              {/* --- Tarjetas de Datos Clave --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-start gap-4">
                    <div className="flex-shrink-0">{stat.icon}</div>
                    <div>
                      <h3 className="font-bold text-sm text-zinc-700">{stat.label}</h3>
                      <p className="text-sm text-zinc-600">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* --- Párrafos de Descripción --- */}
              <article className="space-y-4 text-slate-700">
                <p>
                  La pieza que se encuentra en el Parque Museo La Venta fue descubierta en el sitio arqueológico de La Venta, y es una de las 17 cabezas colosales conocidas. Se cree que representan a gobernantes o personajes de alto rango, posiblemente con tocados ceremoniales.
                </p>
                <p>
                  Su manufactura implicó un enorme esfuerzo colectivo: el basalto era transportado desde canteras a más de 100 km. Cada cabeza tiene rasgos faciales únicos, sugiriendo que son retratos individuales. Hoy, es un símbolo de identidad para Tabasco y el patrimonio de México.
                </p>
              </article>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
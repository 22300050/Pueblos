import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Logo.png";
import cabezaOlmecaImg from "../assets/cabeza-olmeca.jpg";

export default function MonumentoCabezaOlmeca() {
  return (
    <div className="text-[var(--color-text)] min-h-screen flex flex-col bg-gradient-to-t from-[var(--color-cuatro)]/100 to-[var(--color-secondary)]/35">
      {/* Header como Home pero con único botón */}
      <header className="sticky top-0 z-50 w-full py-4 px-6 flex justify-between items-center bg-[var(--color-primary)] shadow-md">
        <Link to="/" className="flex items-center gap-4">
          <img
            src={logo}
            alt="Pueblos de Ensueño - Logotipo"
            className="h-10 sm:h-12 w-auto"
          />
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wide drop-shadow-md text-black">
            Pueblos de Ensueño
          </h1>
        </Link>

        <Link to="/puntos-cercanos">
          <button
            className="px-4 py-2 bg-[var(--orange-250)] hover:bg-[var(--color-secondary)] text-black rounded-full font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50"
            aria-label="Regresar a Puntos cercanos"
          >
            Regresar a Puntos cercanos
          </button>
        </Link>
      </header>

      {/* Contenido */}
      <main className="max-w-4xl w-full mx-auto p-6 flex-1">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Monumento a la Cabeza Olmeca
        </h2>

        <div className="rounded-xl overflow-hidden shadow-md mb-4">
          <img
            src={cabezaOlmecaImg}
            alt="Cabeza olmeca en el Parque Museo La Venta"
            className="w-full h-[320px] object-cover"
          />
        </div>

        {/* Botón RA debajo de la imagen */}
{/* Botón RA debajo de la imagen */}
<div className="mb-8">
  <a
    href="https://kevinpriego.8thwall.app/cabezaolmeca/"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block px-5 py-2 rounded-full bg-[var(--color-secondary)] hover:brightness-110 text-white font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50"
  >
    Ver en realidad aumentada
  </a>
</div>


<article className="prose max-w-none text-gray-800">
  <p>
    Las cabezas colosales olmecas son uno de los legados más enigmáticos y representativos de la civilización olmeca, considerada la “cultura madre” de Mesoamérica. Talladas en enormes bloques de basalto, estas esculturas pueden medir entre 1.5 y 3 metros de altura y llegar a pesar más de 8 toneladas.
  </p>
  <p>
    La pieza que se encuentra en el Parque Museo La Venta fue descubierta en el sitio arqueológico de La Venta, en el actual estado de Tabasco, y es una de las 17 cabezas colosales conocidas hasta hoy. Se cree que representan a gobernantes o personajes de alto rango, posiblemente con tocados ceremoniales.
  </p>
  <p>
    Su manufactura implicó un enorme esfuerzo colectivo: el basalto era transportado desde canteras ubicadas a más de 100 km, posiblemente por vía fluvial, y luego tallado con herramientas de piedra. Cada cabeza tiene rasgos faciales únicos, lo que sugiere que no son representaciones genéricas, sino retratos individuales.
  </p>
  <ul>
    <li><strong>Ubicación original:</strong> Zona arqueológica de La Venta, Tabasco.</li>
    <li><strong>Periodo estimado:</strong> 1200 a.C. – 400 a.C.</li>
    <li><strong>Altura:</strong> ~2.4 metros.</li>
    <li><strong>Peso aproximado:</strong> 8 toneladas.</li>
    <li><strong>Material:</strong> Basalto volcánico.</li>
  </ul>
  <p>
    Hoy en día, la Cabeza Colosal se ha convertido en un símbolo de identidad para Tabasco y para el patrimonio cultural de México. Su enigmática expresión sigue generando preguntas sobre el pensamiento, la organización social y las creencias de los antiguos olmecas.
  </p>
</article>

      </main>

      {/* Footer igual al de Home */}
      <footer className="py-12 text-center bg-[var(--color-primary)] text-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 px-4">
          <div>
            <img
              src={logo}
              alt="Pueblos de Ensueño - Logotipo"
              className="h-10 mb-3"
            />
            <p>
              Conectamos a visitantes con experiencias auténticas y a artesanos
              con más oportunidades.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-black">Enlaces</h4>
            <ul className="space-y-1">
              <li>
                <Link to="/puntos-cercanos">Puntos Cercanos</Link>
              </li>
              <li>
                <Link to="/mapa">Mapa Interactivo</Link>
              </li>
              <li>
                <Link to="/InterestsSelector">Invitado</Link>
              </li>
              <li>
                <Link to="/login">Iniciar sesión</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-black">Tecnologías</h4>
            <ul className="space-y-1">
              <li>React.js</li>
              <li>Node.js</li>
              <li>AWS</li>
              <li>MariaDB</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-black">Contacto</h4>
            <p>9934535365</p>
            <p>✉️ info@pueblosdeensueno.mx</p>
            <p>📍 Villahermosa Tabasco</p>
          </div>
        </div>

        <div className="mt-10 pt-4 text-sm text-black/80 border-t border-black/10">
          © {new Date().getFullYear()} Todos los derechos reservados
        </div>
      </footer>
    </div>
  );
}

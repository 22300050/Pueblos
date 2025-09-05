import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "../assets/Logo.png";

export default function Directorios() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const copiar = async (texto) => {
    try {
      await navigator.clipboard.writeText(texto);
      alert(`Copiado: ${texto}`);
    } catch {
      alert("No se pudo copiar");
    }
  };

  return (
    <div className="text-[var(--color-text)]">
      {/* === Header (idéntico al de Home) === */}
      <header className="sticky top-0 z-50 w-full py-4 px-6 flex justify-between items-center bg-[var(--color-primary)] shadow-md">
<Link to="/" className="flex items-center gap-4">
  <img src={logo} alt="Logo" className="h-10 sm:h-12 w-auto" />
  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wide drop-shadow-md text-black">
    {t("header.title")}
  </h1>
</Link>

<nav className="hidden md:flex gap-3 lg:gap-5 items-center">
  {/* Switch de idioma */}
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

  {/* Botón Ir al Home */}
  <Link to="/">
    <button className="px-4 py-2 bg-[var(--orange-250)] hover:bg-[var(--color-secondary)] text-black rounded-full font-semibold shadow-sm transition">
      Ir al Home
    </button>
  </Link>
</nav>


        <button
          className="block md:hidden text-gray-800"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Nav */}
{mobileMenuOpen && (
  <nav className="md:hidden bg-[var(--orange-250)] shadow-md px-6 py-4 space-y-2">
    <Link to="/mapa">
      <button className="w-full px-4 py-2 bg-[var(--orange-250)] rounded-lg font-semibold transition">
        {t("menu.map")}
      </button>
    </Link>
    <Link to="/login">
      <button className="w-full px-4 py-2 bg-[var(--orange-250)] rounded-lg font-semibold transition">
        {t("menu.login")}
      </button>
    </Link>
  </nav>
)}


      {/* === Hero local de esta página */}
      <section
        className="py-10 px-6 text-center text-white"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
        }}
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold drop-shadow">
          Directorios: Emergencias y Guías Turísticos (México)
        </h1>
        <p className="mt-2 opacity-90">
          Números útiles en carretera y cómo verificar guías certificados.
        </p>
      </section>

      {/* === Contenido principal === */}
      <main className="px-4 sm:px-8 lg:px-24 py-10 space-y-10">
        {/* Emergencias */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Emergencias nacionales</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 911 */}
            <div className="rounded-2xl p-4 shadow bg-white/80">
              <h3 className="font-semibold text-lg">911 — Emergencias</h3>
              <p className="text-sm mt-1">
                Número único nacional 24/7 para emergencias médicas, de seguridad y
                protección civil.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => copiar("911")}
                  className="px-3 py-1.5 rounded-full text-white"
                  style={{ background: "var(--color-secondary)" }}
                >
                  Copiar 911
                </button>
                <a
                  className="px-3 py-1.5 rounded-full bg-[var(--color-primary)] text-black"
                  href="https://www.gob.mx/911"
                  target="_blank"
                  rel="noreferrer"
                >
                  Sitio oficial
                </a>
              </div>
            </div>

            {/* 088 */}
            <div className="rounded-2xl p-4 shadow bg-white/80">
              <h3 className="font-semibold text-lg">088 — Guardia Nacional</h3>
              <p className="text-sm mt-1">
                Atención y canalización de reportes ciudadanos, útil también en
                carreteras federales.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => copiar("088")}
                  className="px-3 py-1.5 rounded-full text-white"
                  style={{ background: "var(--color-secondary)" }}
                >
                  Copiar 088
                </button>
                <a
                  className="px-3 py-1.5 rounded-full bg-[var(--color-primary)] text-black"
                  href="https://www.gob.mx/gncertmx/documentos/servicio-de-atencion-ciudadana-de-la-guardia-nacional-sac-088"
                  target="_blank"
                  rel="noreferrer"
                >
                  Sitio oficial
                </a>
              </div>
            </div>

            {/* 089 */}
            <div className="rounded-2xl p-4 shadow bg-white/80">
              <h3 className="font-semibold text-lg">089 — Denuncia anónima</h3>
              <p className="text-sm mt-1">
                Canal para denunciar de forma anónima posibles delitos o extorsiones.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => copiar("089")}
                  className="px-3 py-1.5 rounded-full text-white"
                  style={{ background: "var(--color-secondary)" }}
                >
                  Copiar 089
                </button>
                <a
                  className="px-3 py-1.5 rounded-full bg-[var(--color-primary)] text-black"
                  href="https://www.gob.mx/sspc/prensa/sesnsp-lanza-campana-de-difusion-del-numero-nacional-de-denuncia-anonima-089?idiom=es"
                  target="_blank"
                  rel="noreferrer"
                >
                  Más info
                </a>
              </div>
            </div>

            {/* 078 Ángeles Verdes */}
            <div className="rounded-2xl p-4 shadow bg-white/80">
              <h3 className="font-semibold text-lg">078 — Ángeles Verdes</h3>
              <p className="text-sm mt-1">
                Asistencia mecánica y turística en carretera. Horario habitual: 8:00–20:00.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => copiar("078")}
                  className="px-3 py-1.5 rounded-full text-white"
                  style={{ background: "var(--color-secondary)" }}
                >
                  Copiar 078
                </button>
                <a
                  className="px-3 py-1.5 rounded-full bg-[var(--color-primary)] text-black"
                  href="https://www.gob.mx/sectur/angelesverdes"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ángeles Verdes
                </a>
              </div>
            </div>

            {/* 074 CAPUFE */}
            <div className="rounded-2xl p-4 shadow bg-white/80">
              <h3 className="font-semibold text-lg">074 — CAPUFE</h3>
              <p className="text-sm mt-1">
                Información de autopistas operadas por CAPUFE: tránsito, clima, tarifas y rutas.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => copiar("074")}
                  className="px-3 py-1.5 rounded-full text-white"
                  style={{ background: "var(--color-secondary)" }}
                >
                  Copiar 074
                </button>
                <a
                  className="px-3 py-1.5 rounded-full bg-[var(--color-primary)] text-black"
                  href="https://www.gob.mx/capufe/articulos/capufe-y-074-al-servicio-del-usuario?idiom=es"
                  target="_blank"
                  rel="noreferrer"
                >
                  CAPUFE
                </a>
              </div>
            </div>
          </div>

          <p className="text-xs mt-4 opacity-70">
            Consejo: además del 911, guarda 078 (carretera), 074 (CAPUFE), 088 (Guardia Nacional)
            y 089 (denuncia). Verifica números locales de Protección Civil de tu municipio cuando viajes.
          </p>
        </section>

        {/* Guías certificados */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Guías turísticos certificados</h2>
          <div className="rounded-2xl p-5 shadow bg-white/80 space-y-3">
            <p>
              Antes de contratar, verifica que el/la guía esté certificado(a) por la Secretaría de Turismo.
              Puedes consultar el <strong>Directorio de Guías</strong> y el Registro Nacional de Turismo (RNT).
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                className="px-4 py-2 rounded-full text-white"
                style={{ background: "var(--color-secondary)" }}
                href="https://www.gob.mx/sectur/documentos/directorio-de-guias-de-turistas"
                target="_blank"
                rel="noreferrer"
              >
                Directorio de Guías (SECTUR)
              </a>
              <a
                className="px-4 py-2 rounded-full bg-[var(--color-primary)] text-black"
                href="https://rnt-consulta.sectur.gob.mx/"
                target="_blank"
                rel="noreferrer"
              >
                Consultar en RNT
              </a>
            </div>
            <ul className="list-disc list-inside text-sm opacity-90">
              <li>Pide identificación y número de RNT.</li>
              <li>Revisa reseñas y políticas de cancelación.</li>
              <li>Acuerda claramente el itinerario y costos.</li>
            </ul>
          </div>
        </section>

        {/* Enlaces útiles */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Enlaces útiles</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <a
              className="rounded-2xl p-4 shadow bg-white/80 hover:shadow-md transition"
              href="https://www.gob.mx/911"
              target="_blank"
              rel="noreferrer"
            >
              911 Emergencias (Gobierno de México)
            </a>
            <a
              className="rounded-2xl p-4 shadow bg-white/80 hover:shadow-md transition"
              href="https://www.gob.mx/sectur/angelesverdes"
              target="_blank"
              rel="noreferrer"
            >
              Ángeles Verdes — 078
            </a>
          </div>
        </section>

        {/* CTA volver */}
        <div className="pt-2">
          <Link to="/mapa">
            <button
              className="px-6 py-3 rounded-full font-semibold text-black shadow"
              style={{ background: "var(--color-primary)" }}
            >
              Ir al mapa interactivo
            </button>
          </Link>
        </div>
      </main>

      {/* === Footer  === */}
      <footer className="py-10 text-center bg-[var(--color-primary)] text-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4">
          <div>
            <img src={logo} alt="Logo Pueblos de Ensueño" className="h-10 mb-3" />
            <p>{t("footer.description")}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-black">{t("footer.linksTitle")}</h4>
            <ul className="space-y-1">
              <li>
                <Link to="/puntos-cercanos">{t("menu.nearby")}</Link>
              </li>
              <li>
                <Link to="/mapa">{t("menu.map")}</Link>
              </li>
              <li>
                <Link to="/InterestsSelector">{t("menu.guest")}</Link>
              </li>
              <li>
                <Link to="/login">{t("menu.login")}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-black">{t("footer.techTitle")}</h4>
            <ul className="space-y-1">
              <li>React.js</li>
              <li>Node.js</li>
              <li>AWS</li>
              <li>MariaDB</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-black">{t("footer.contactTitle")}</h4>
            <p>9934535365</p>
            <p>✉️ info@pueblosdeensueno.mx</p>
            <p>📍 Villahermosa Tabasco</p>
          </div>
        </div>
        <div className="mt-8 pt-4 text-sm text-black">© 2025 {t("footer.rights")}</div>
      </footer>
    </div>
  );
}

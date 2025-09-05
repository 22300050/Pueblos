import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logo from '../assets/Logo.png';
import googleIcon from '../assets/google-icon.png';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', form); // POST al backend aquí
    navigate('/homelogin');
  };

  const handleGoogleLogin = () => {
    console.log('Iniciar sesión con Google');
  };

  return (
    <div className="text-[var(--color-text)] min-h-screen flex flex-col bg-[var(--color-bg)]">
      {/* HEADER (como en Home) */}
      <header className="sticky top-0 z-50 w-full py-4 px-6 flex justify-between items-center bg-[var(--color-primary)] shadow-md">
        <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white px-3 py-2 rounded">
          Saltar al formulario de inicio de sesión
        </a>

<Link to="/" className="flex items-center gap-4">
  <img src={logo} alt="Pueblos de Ensueño - Logotipo" className="h-10 sm:h-12 w-auto" />
  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wide drop-shadow-md text-black">
    Pueblos de Ensueño
  </h1>
</Link>


<nav aria-label="Navegación principal" className="hidden md:flex gap-3 lg:gap-5 items-center">
  {['/mapa', '/login', '/'].map((path, i) => (
    <Link key={path} to={path}>
      <button className="px-4 py-2 bg-[var(--orange-250)] hover:bg-[var(--color-secondary)] text-black rounded-full font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50">
        {['Mapa Interactivo', 'Iniciar sesión', 'Ir a Home'][i]}
      </button>
    </Link>
  ))}
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

      {/* Mobile Nav (coherente con Home, pero sin “Puntos cercanos” ni “Invitado”) */}
      {mobileMenuOpen && (
        <nav
          id="menu-movil"
          aria-label="Menú móvil"
          className="md:hidden bg-white shadow-md px-6 py-4 space-y-2 border-t border-black/10"
        >
          {['/mapa', '/login'].map((path, i) => (
            <Link key={path} to={path}>
              <button className="w-full px-4 py-2 rounded-lg font-semibold bg-[var(--color-primary)] text-black hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 transition">
                {i === 0 ? t('menu.map', 'Mapa Interactivo') : t('menu.login', 'Iniciar sesión')}
              </button>
            </Link>
          ))}
        </nav>
      )}

      {/* MAIN: fondo y colores como Home */}
      <main
        id="contenido"
        className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 sm:py-20
                   bg-gradient-to-t from-[var(--color-cuatro)]/100 to-[var(--color-secondary)]/35"
      >
        <div className="bg-white/80 shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-xs sm:max-w-md border-2 border-[var(--color-tertiary)]">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center mb-6 tracking-wide text-black">
            {t('menu.login', 'Iniciar sesión')}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
            <label className="block">
              <span className="text-black font-medium">Correo electrónico</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full mt-1 p-3 sm:p-4 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] text-sm sm:text-base"
                required
              />
            </label>

            <label className="block">
              <span className="text-black font-medium">Contraseña</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full mt-1 p-3 sm:p-4 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] text-sm sm:text-base"
                required
              />
            </label>

            <button
              type="submit"
              className="w-full bg-[var(--color-secondary)] text-white py-3 sm:py-4 rounded-lg font-semibold hover:brightness-110 transition-all shadow-md text-sm sm:text-base"
            >
              Entrar
            </button>
          </form>

          <div className="mt-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-[var(--color-secondary)] text-white flex items-center justify-center py-3 sm:py-4 rounded-lg font-semibold hover:brightness-110 transition-all shadow-md text-sm sm:text-base gap-2"
            >
              <img src={googleIcon} alt="Google" className="h-5 w-5" />
              Iniciar sesión con Google
            </button>

            <div className="pt-4 text-center">
              <Link
                to="/register"
                className="text-sm text-black hover:underline font-medium"
              >
                ¿No tienes una cuenta? Regístrate aquí
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER (como en Home) */}
      <footer className="py-12 text-center bg-[var(--color-primary)] text-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 px-4">
          <div>
            <img src={logo} alt="Pueblos de Ensueño - Logotipo" className="h-10 mb-3" />
            <p>{t('footer.description', 'Descubre los pueblos más encantadores.')}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-black">{t('footer.linksTitle', 'Enlaces')}</h4>
            <ul className="space-y-1">
              {/* Mantengo coherencia con el Home, pero podrías limpiar más rutas si ya no existen */}
              <li><Link to="/mapa">{t('menu.map', 'Mapa Interactivo')}</Link></li>
              <li><Link to="/login">{t('menu.login', 'Iniciar sesión')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-black">{t('footer.techTitle', 'Tecnologías')}</h4>
            <ul className="space-y-1">
              <li>React.js</li>
              <li>Node.js</li>
              <li>AWS</li>
              <li>MariaDB</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-black">{t('footer.contactTitle', 'Contacto')}</h4>
            <p>9934535365</p>
            <p>✉️ info@pueblosdeensueno.mx</p>
            <p>📍 Villahermosa Tabasco</p>
          </div>
        </div>

        <div className="mt-10 pt-4 text-sm text-black/80 border-t border-black/10">
          © 2025 {t('footer.rights', 'Todos los derechos reservados')}
        </div>
      </footer>
    </div>
  );
}

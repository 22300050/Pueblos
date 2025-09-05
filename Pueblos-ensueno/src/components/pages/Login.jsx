import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import googleIcon from '../../assets/Logos/google-icon.png';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', form);
    navigate('/homelogin');
  };

  const handleGoogleLogin = () => {
    console.log('Iniciar sesión con Google');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-amber-100 p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-center mb-2 text-zinc-800">
            Bienvenido de Nuevo
          </h2>
          <p className="text-center text-slate-500 mb-8">
            Inicia sesión para continuar tu aventura.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Correo electrónico"
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Contraseña"
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Entrar
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O continúa con</span>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white text-slate-700 flex items-center justify-center py-3 rounded-lg font-medium border-2 border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
            >
              <img src={googleIcon} alt="Google" className="h-6 w-6 mr-3" />
              Iniciar sesión con Google
            </button>
          </div>

          <div className="pt-6 text-center">
            <Link
              to="/register"
              className="text-sm text-orange-600 hover:underline font-medium"
            >
              ¿No tienes una cuenta? Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


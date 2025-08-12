import React, { useState } from 'react';
import googleIcon from '../assets/google-icon.png';
import { useNavigate } from 'react-router-dom';


export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
const navigate = useNavigate();

const handleSubmit = (e) => {
  e.preventDefault();
  console.log('Login:', form); // Aquí iría el POST al backend
  navigate('/homelogin'); // Redirección a HomeLogin tras "login"
};


  const handleGoogleLogin = () => {
    // Aquí va la lógica de autenticación con Google
    console.log('Iniciar sesión con Google');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-200 via-amber-200 to-lime-200 flex items-center justify-center px-4 sm:px-6">
      <div className="bg-white/80 shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-xs sm:max-w-md border-2 border-pink-200">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-pink-500 mb-6 tracking-wide">
          Iniciar sesión
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
          <label className="block">
            <span className="text-pink-600 font-medium">Correo electrónico</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 p-3 sm:p-4 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm sm:text-base"
              required
            />
          </label>

          <label className="block">
            <span className="text-pink-600 font-medium">Contraseña</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 p-3 sm:p-4 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm sm:text-base"
              required
            />
          </label>

          <button
            type="submit"
            className="w-full bg-pink-400 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-pink-500 transition-all shadow-md text-sm sm:text-base"
          >
            Entrar
          </button>
        </form>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-pink-400 text-white flex items-center justify-center py-3 sm:py-4 rounded-lg font-semibold hover:bg-pink-500 transition-all shadow-md text-sm sm:text-base gap-2"
          >
            <img src={googleIcon} alt="Google" className="h-5 w-5" />
            Iniciar sesión con Google
          </button>
          <div className="pt-4 text-center">
  <button
    type="button"
    onClick={() => window.location.href = '/register'}
    className="text-sm text-pink-600 hover:underline font-medium"
  >
    ¿No tienes una cuenta? Regístrate aquí
  </button>
</div>

        </div>
      </div>
    </div>
  );
}

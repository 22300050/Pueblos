import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Cake, Phone, Accessibility } from 'lucide-react';
import axios from 'axios';
// import { useTranslation } from 'react-i18next'; // Eliminado para la previsualización

import googleIcon from '../../assets/Logos/google-icon.png';

export default function Register() {
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    fechaNacimiento: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: '',
    discapacidad: ''
  });
  const [error, setError] = useState('');


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => { // Cambia a una función asíncrona
  e.preventDefault();
  if (form.password && form.password !== form.confirmPassword) {
    setError('Las contraseñas no coinciden.');
    return;
  }
  setError('');

  try {
// 1) Registro
await axios.post('http://localhost:3001/api/auth/register', form);

// 2) Login inmediato usando el mismo email/password
const loginRes = await axios.post('http://localhost:3001/api/auth/login', {
  email: form.email,
  password: form.password,
});

// 3) Guardar sesión normalizada
const { user: rawUser, token } = loginRes.data || {};
if (token) localStorage.setItem('token', token);

if (rawUser) {
  const normalizedUser = {
    ...rawUser,
    name:
      rawUser.name ||
      [rawUser.nombre, rawUser.apellidos].filter(Boolean).join(' ').trim() ||
      'Explorador',
  };
  localStorage.setItem('user', JSON.stringify(normalizedUser));
  localStorage.setItem('isLoggedIn', 'true');
}

// 4) Redirección con recarga completa
window.location.replace('/homelogin');


} catch (err) {
  const msg = err?.response?.data?.message || 'Error al registrar el usuario.';
  console.error('Error al registrar:', err);
  setError(msg);
}
};

  const handleGoogleRegister = () => {
    console.log('Registrarse con Google');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-amber-100 p-4 font-sans py-12">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-center mb-2 text-zinc-800">
            Crea tu Cuenta
          </h2>
          <p className="text-center text-slate-500 mb-8">
            Únete y comienza a planear tu próxima aventura.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Nombre(s)"
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                    />
                </div>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                    type="text"
                    name="apellidos"
                    value={form.apellidos}
                    onChange={handleChange}
                    placeholder="Apellidos"
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                    />
                </div>
            </div>

            <div className="relative">
              <Cake className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
<input
  type="date"
  name="fechaNacimiento"
  value={form.fechaNacimiento}
  onChange={handleChange}
  placeholder="Fecha de nacimiento"
  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
/>

            </div>
            
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Número telefónico"
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Correo electrónico"
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
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
              />
            </div>
{/* Confirmar contraseña */}
<div className="relative">
  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
  <input
    type="password"
    name="confirmPassword"
    value={form.confirmPassword}
    onChange={handleChange}
    placeholder="Confirmar Contraseña"
    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
  />
</div>

{/* Discapacidad */}
<div className="relative">
  <Accessibility className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
  <select
    name="discapacidad"
    value={form.discapacidad}
    onChange={handleChange}
    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
  >
    <option value="">¿Tienes alguna discapacidad?</option>
    <option value="ninguna">Ninguna</option>
    <option value="visual">Discapacidad visual</option>
    <option value="auditiva">Discapacidad auditiva</option>
    <option value="motriz">Discapacidad motriz o física</option>
    <option value="intelectual">Discapacidad intelectual</option>
    <option value="psicosocial">Discapacidad psicosocial o mental</option>
    <option value="multiple">Discapacidad múltiple</option>
    <option value="otra">Otra (especificar)</option>
  </select>
</div>


{/* Mensaje de error (una sola vez) */}
{error && <p className="text-sm text-red-600 text-center">{error}</p>}

<button
  type="submit"
  className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
>
  Crear Cuenta
</button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O regístrate con</span>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleGoogleRegister}
              className="w-full bg-white text-slate-700 flex items-center justify-center py-3 rounded-lg font-medium border-2 border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
            >
              <img src={googleIcon} alt="Google" className="h-6 w-6 mr-3" />
              Continuar con Google
            </button>
          </div>

          <div className="pt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-orange-600 hover:underline font-medium"
            >
              ¿Ya tienes una cuenta? Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    fechaNacimiento: '',
    telefono: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registrando usuario:', form);
    // Aquí podrías enviar datos al backend antes de redirigir
    navigate('/perfil');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-200 via-amber-200 to-lime-200 flex items-center justify-center px-4 sm:px-6">
      <div className="bg-white/80 shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-xs sm:max-w-md border-2 border-pink-200">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-pink-500 mb-6 tracking-wide">
          ¡Regístrate!
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
          <label className="block">
            <span className="text-pink-600 font-medium">Nombre</span>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              required
              className="w-full mt-1 p-3 sm:p-4 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm sm:text-base"
            />
          </label>

          <label className="block">
            <span className="text-pink-600 font-medium">Apellidos</span>
            <input
              type="text"
              name="apellidos"
              value={form.apellidos}
              onChange={handleChange}
              placeholder="Apellidos"
              required
              className="w-full mt-1 p-3 sm:p-4 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm sm:text-base"
            />
          </label>

          <label className="block">
            <span className="text-pink-600 font-medium">Fecha de nacimiento</span>
            <input
              type="date"
              name="fechaNacimiento"
              value={form.fechaNacimiento}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 sm:p-4 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm sm:text-base"
            />
          </label>

          <label className="block">
            <span className="text-pink-600 font-medium">Número telefónico</span>
            <input
              type="tel"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="Número telefónico"
              required
              className="w-full mt-1 p-3 sm:p-4 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm sm:text-base"
            />
          </label>

          <label className="block">
            <span className="text-pink-600 font-medium">Correo electrónico</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Correo electrónico"
              required
              className="w-full mt-1 p-3 sm:p-4 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm sm:text-base"
            />
          </label>

          <label className="block">
            <span className="text-pink-600 font-medium">Contraseña</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Contraseña"
              required
              className="w-full mt-1 p-3 sm:p-4 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm sm:text-base"
            />
          </label>

          <button
            type="submit"
            className="w-full bg-pink-400 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-pink-500 transition-all shadow-md text-sm sm:text-base"
          >
            Crear cuenta
          </button>
          <div className="pt-2 text-center">
  <button
    type="button"
    onClick={() => navigate('/login')}
    className="text-sm text-pink-600 hover:underline font-medium"
  >
    ¿Ya tienes una cuenta? Inicia sesión aquí
  </button>
</div>

        </form>
      </div>
    </div>
  );
}

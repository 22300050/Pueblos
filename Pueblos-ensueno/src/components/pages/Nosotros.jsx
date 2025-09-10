import React from 'react';
import { useNavigate } from 'react-router-dom';

// Imágenes del equipo
import ArcelyImg from '../../assets/Integrantes/Arcely.jpg';
import DulceImg from '../../assets/Integrantes/Dulce.jpg';
import FernandoImg from '../../assets/Integrantes/Fernando.jpg';
import DarwinImg from '../../assets/Integrantes/Darwin.jpg';
import KevinImg from '../../assets/Integrantes/Kevin.jpg';
import RonaldoImg from '../../assets/Integrantes/Ronaldo.jpg';
import KristelImg from '../../assets/Integrantes/Kristel.jpg';
import TeamImg from '../../assets/Integrantes/Team.jpg';

// Datos del equipo
const TEAM = [
  { name: "Arcely Aquino Ruíz", role: "Asesora del Proyecto", img: ArcelyImg },
  { name: "Dulce María León De La O", role: "Co-Asesora del Proyecto", img: DulceImg },
  { name: "Fernando Estrella Martínez", role: "Estudiante", img: FernandoImg },
  { name: "Darwin Sánchez Cano", role: "Estudiante", img: DarwinImg },
  { name: "Kevin Priego Ulloa", role: "Estudiante", img: KevinImg },
  { name: "José Ronaldo León Evia", role: "Estudiante", img: RonaldoImg },
  { name: "Cindy Kristel De La Cruz López", role: "Estudiante", img: KristelImg },
];

// Tarjeta de integrante
function TeamCard({ name, role, img }) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 text-center
                    transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full">
      <div className="mx-auto mb-4 w-28 h-28 rounded-full ring-4 ring-[#F39106]/50
                      bg-gray-100 overflow-hidden flex items-center justify-center">
        {img ? (
          <img src={img} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl font-semibold text-gray-600">{initials}</span>
        )}
      </div>
      <h3 className="text-xl font-bold text-zinc-800">{name}</h3>
      <p className="mt-1 font-semibold text-[#F39106]">{role}</p>
    </div>
  );
}

// Componente principal de la página "Nosotros"
export default function Nosotros() {
  const navigate = useNavigate();

  const asesores = TEAM.filter(m => m.role.includes("Asesor"));
  const estudiantes = TEAM.filter(m => m.role.includes("Estudiante"));

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      {/* SECCIÓN HERO */}
      <section className="bg-gradient-to-br from-white to-blue-50 py-10 md:py-12 lg:py-16 overflow-hidden">
        <div className="container mx-auto px-8 md:px-10 lg:px-20 grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-zinc-800 leading-tight">
              Nuestro Equipo
            </h1>
            <p className="text-xl md:text-2xl mt-4 max-w-2xl mx-auto lg:mx-0 text-gray-700">
              Somos la fuerza detrás de "Pueblos de Ensueño", un grupo apasionado de estudiantes y asesores dedicados a transformar la experiencia turística.
            </p>
          </div>

          <div className="w-full mt-10 lg:mt-0 flex justify-center lg:justify-end">
            <img
              src={TeamImg}
              alt="Foto grupal del equipo"
              className="w-full max-w-md h-auto rounded-3xl shadow-xl border-4 border-white transform rotate-3 scale-105"
            />
          </div>
        </div>
      </section>

      {/* --- SECCIÓN DE ESTUDIANTES (FONDO GRIS) --- */}
      <section id="estudiantes" className="bg-[#EAEAEA] py-10 lg:py-20">
        <div className="container mx-auto px-8 md:px-10 lg:px-20">
          <h2 className="text-3xl font-bold text-center mb-10 text-zinc-700">Equipo de Desarrollo</h2>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {estudiantes.map((member, idx) => (
              <TeamCard key={idx} {...member} />
            ))}
          </div>
        </div>
      </section>

      {/* --- SECCIÓN DE ASESORES (FONDO BLANCO) --- */}
      <section id="asesores" className="bg-white py-10 lg:py-20">
        <div className="container mx-auto px-8 md:px-10 lg:px-20">
          <h2 className="text-3xl font-bold text-center mb-10 text-zinc-700">Nuestros Asesores</h2>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto">
            {asesores.map((member, idx) => (
              <TeamCard key={idx} {...member} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
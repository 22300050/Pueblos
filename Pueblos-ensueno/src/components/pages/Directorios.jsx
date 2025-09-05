import { Link } from "react-router-dom";
import { Phone, Shield, Siren, Car, Navigation, UserCheck, Link as LinkIcon, Copy } from "lucide-react";


export default function Directorios() {

  const copiar = async (texto) => {
    try {
      await navigator.clipboard.writeText(texto);
      alert(`Copiado: ${texto}`); // Puedes reemplazar esto con un toast/snackbar para una mejor UX
    } catch {
      alert("No se pudo copiar");
    }
  };

  const emergencyContacts = [
    {
      Icon: Siren,
      title: "911 — Emergencias",
      description: "Número único nacional 24/7 para emergencias médicas, de seguridad y protección civil.",
      number: "911",
      link: "https://www.gob.mx/911",
      color: "red"
    },
    {
      Icon: Shield,
      title: "088 — Guardia Nacional",
      description: "Atención y canalización de reportes ciudadanos, útil también en carreteras federales.",
      number: "088",
      link: "https://www.gob.mx/gncertmx/documentos/servicio-de-atencion-ciudadana-de-la-guardia-nacional-sac-088",
      color: "slate"
    },
    {
      Icon: Phone,
      title: "089 — Denuncia anónima",
      description: "Canal para denunciar de forma anónima posibles delitos o extorsiones.",
      number: "089",
      link: "https://www.gob.mx/sspc/prensa/sesnsp-lanza-campana-de-difusion-del-numero-nacional-de-denuncia-anonima-089?idiom=es",
      color: "blue"
    },
    {
      Icon: Car,
      title: "078 — Ángeles Verdes",
      description: "Asistencia mecánica y turística en carretera. Horario habitual: 8:00–20:00.",
      number: "078",
      link: "https://www.gob.mx/sectur/angelesverdes",
      color: "green"
    },
    {
      Icon: Navigation,
      title: "074 — CAPUFE",
      description: "Información de autopistas: tránsito, clima, tarifas y rutas.",
      number: "074",
      link: "https://www.gob.mx/capufe/articulos/capufe-y-074-al-servicio-del-usuario?idiom=es",
      color: "amber"
    },
  ];

  const getCardColorClasses = (color) => {
    switch (color) {
      case 'red': return 'border-red-500 bg-red-50';
      case 'slate': return 'border-slate-500 bg-slate-50';
      case 'blue': return 'border-blue-500 bg-blue-50';
      case 'green': return 'border-green-500 bg-green-50';
      case 'amber': return 'border-amber-500 bg-amber-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getButtonColorClasses = (color) => {
    switch (color) {
        case 'red': return 'bg-red-500 hover:bg-red-600 focus:ring-red-300';
        case 'slate': return 'bg-slate-500 hover:bg-slate-600 focus:ring-slate-300';
        case 'blue': return 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-300';
        case 'green': return 'bg-green-500 hover:bg-green-600 focus:ring-green-300';
        case 'amber': return 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-300';
        default: return 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-300';
    }
  };

  return (
    <div className="bg-slate-50">
      <section className="bg-gradient-to-r from-orange-500 to-amber-500 py-16 px-6 text-center text-white">
        <Siren className="w-16 h-16 mx-auto mb-4 opacity-80" strokeWidth={1.5} />
        <h1 className="text-4xl sm:text-5xl font-black drop-shadow-lg">
          Directorio de Ayuda al Viajero
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg opacity-90">
          Números de emergencia y recursos para verificar guías turísticos certificados en México.
        </p>
      </section>

      <main className="px-4 sm:px-8 lg:px-24 py-16 space-y-16">
        <section>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-800 mb-2">Emergencias Nacionales</h2>
            <p className="text-slate-600 mb-10 max-w-3xl mx-auto">Contactos clave para asistencia en carreteras y ciudades. Guarda estos números antes de tu viaje.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className={`rounded-2xl p-6 shadow-lg border-t-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${getCardColorClasses(contact.color)}`}>
                <contact.Icon className="w-10 h-10 mb-4 text-zinc-700" strokeWidth={1.5} />
                <h3 className="font-bold text-xl text-zinc-800">{contact.title}</h3>
                <p className="text-sm mt-2 text-slate-600 min-h-[60px]">{contact.description}</p>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => copiar(contact.number)}
                    className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${getButtonColorClasses(contact.color)}`}
                  >
                    <Copy className="w-4 h-4" />
                    Copiar {contact.number}
                  </button>
                  <a
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition-colors"
                    href={contact.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Sitio Oficial
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-800 mb-2">Guías Turísticos Certificados</h2>
            <p className="text-slate-600 mb-10 max-w-3xl mx-auto">Para una experiencia segura y de calidad, verifica siempre que tu guía esté certificado por la Secretaría de Turismo.</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg grid md:grid-cols-2 gap-8 items-center border-t-4 border-orange-500">
            <div>
              <UserCheck className="w-12 h-12 mb-4 text-orange-500" strokeWidth={1.5}/>
              <h3 className="font-bold text-2xl text-zinc-800 mb-3">Verifica a tu Guía</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Pide su credencial de acreditación vigente.</li>
                <li>Consulta su número en el Registro Nacional de Turismo (RNT).</li>
                <li>Acuerda claramente el itinerario, duración y costos.</li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <a
                className="w-full text-center px-5 py-3 rounded-full font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors"
                href="https://www.gob.mx/sectur/documentos/directorio-de-guias-de-turistas"
                target="_blank"
                rel="noreferrer"
              >
                Ver Directorio de Guías (SECTUR)
              </a>
              <a
                className="w-full text-center px-5 py-3 rounded-full font-semibold text-zinc-700 bg-slate-200 hover:bg-slate-300 transition-colors"
                href="https://rnt-consulta.sectur.gob.mx/"
                target="_blank"
                rel="noreferrer"
              >
                Consultar en RNT
              </a>
            </div>
          </div>
        </section>

        <div className="text-center pt-8">
          <Link to="/mapa">
            <button className="px-8 py-3 rounded-full font-semibold text-white bg-zinc-800 shadow-lg hover:bg-zinc-700 transition-colors transform hover:-translate-y-1">
              Ir al Mapa Interactivo
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}


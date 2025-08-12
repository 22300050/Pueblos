import imgCabeza from '../assets/cabeza-olmeca.jpg';
import imgQr     from '../assets/qr-cabeza-olmeca.jpg';
import { Star, Bookmark, Share2, X } from 'lucide-react';

export default function DetailsPanel({ markerData, onClose }) {
  const {
    title,
    rating = 0,
    description,
    arLink
  } = markerData;

  const fullStars = Math.floor(rating);
  const halfStar  = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="relative flex-1 h-full flex flex-col bg-yellow-50 rounded-l-xl shadow-lg overflow-hidden">
      {/* Imagen de cabecera más alta */}
      <img
        src={imgCabeza}
        alt={title}
        className="w-full h-64 object-cover" 
      />

      <div className="p-6 flex-1 flex flex-col">
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-yellow-100"
        >
          <X size={20} className="text-pink-600" />
        </button>

        {/* Título */}
        <h2 className="text-3xl font-bold mb-4 text-pink-600">{title}</h2>

        {/* Rating */}
        <div className="flex items-center mb-6">
          {[...Array(fullStars)].map((_, i) => (
            <Star key={`full-${i}`} className="text-yellow-400 mr-1" />
          ))}
          {halfStar && (
            <Star className="text-yellow-400 mr-1" fill="url(#half)" />
          )}
          {[...Array(emptyStars)].map((_, i) => (
            <Star key={`empty-${i}`} className="text-gray-300 mr-1" />
          ))}
          <span className="text-gray-700 ml-2">({rating.toFixed(1)})</span>
        </div>

        {/* Descripción */}
        <p className="text-gray-800 mb-6 flex-1">{description}</p>

        {/* Acciones */}
        <div className="flex justify-around text-gray-700 mb-6">
          <button className="flex flex-col items-center hover:text-pink-600">
            <Star size={24} />
            <span className="text-sm mt-1">Favoritos</span>
          </button>
          <button className="flex flex-col items-center hover:text-pink-600">
            <Bookmark size={24} />
            <span className="text-sm mt-1">Guardar</span>
          </button>
          <button className="flex flex-col items-center hover:text-pink-600">
            <Share2 size={24} />
            <span className="text-sm mt-1">Compartir</span>
          </button>
        </div>

        {/* Botón realidad aumentada */}
        {arLink && (
          <a
            href={arLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center bg-pink-500 hover:bg-pink-600 transition text-white py-4 rounded-lg font-medium mb-6"
          >
            Ver en realidad aumentada
          </a>
        )}

        {/* Código QR */}
        <div className="flex justify-center mb-6">
          <img
            src={imgQr}
            alt="QR Code"
            className="w-40 h-40 object-contain"
          />
          <div className="p-4">
            <button onClick={onClose} className="w-full px-4 py-2 bg-yellow-200 hover:bg-yellow-300 rounded text-pink-700 font-semibold">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
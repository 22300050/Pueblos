// src/utils/itinerarioStore.js
const KEY = "selecciones";
const KEY_IT = "itinerario";

export function getSelecciones() {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

export function addSeleccion(item) {
  const prev = getSelecciones();
  const existe = prev.some(x => x.id === item.id);
  if (existe) return false;
  localStorage.setItem(KEY, JSON.stringify([...prev, item]));
  return true;
}


export function removeSeleccion(id) {
  const next = getSelecciones().filter(x => x.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function clearSelecciones() {
  localStorage.removeItem(KEY);
}

export function getItinerarioBase() {
  return JSON.parse(localStorage.getItem(KEY_IT) || "null");
}

export function setItinerarioBase(data) {
  localStorage.setItem(KEY_IT, JSON.stringify(data));
}

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      let u = JSON.parse(storedUser);
      // Si no hay name, constrúyelo de nombre/apellidos o usa fallback
      if (!u.name) {
        const name =
          u.name ||
          [u.nombre, u.apellidos].filter(Boolean).join(' ').trim() ||
          'Explorador';
        u = { ...u, name };
        localStorage.setItem('user', JSON.stringify(u)); // 🔧 migra en localStorage
      }
      setUser(u);
    } catch {
      // Si algo raro viene en localStorage, lo limpiamos
      localStorage.removeItem('user');
    }
  }
}, []);


  const logout = () => {
    // 1. Elimina los datos del usuario y el token de localStorage.
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // 2. Limpia el estado del contexto.
    setUser(null);
    
    // 3. Navega a la página de inicio.
    navigate('/');

    // 4. Recarga la página para forzar la actualización visual del navegador.
    window.location.reload();
  };
  
const login = (userData) => {
  const normalizedUser = {
    ...userData,
    name:
      userData.name ||
      [userData.nombre, userData.apellidos].filter(Boolean).join(' ').trim() ||
      'Explorador',
  };

  localStorage.setItem('user', JSON.stringify(normalizedUser));
  setUser(normalizedUser);
};



  return (
    <AuthContext.Provider value={{ user, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
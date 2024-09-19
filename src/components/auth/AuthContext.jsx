import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// Crear el contexto de autenticación
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [authState, setAuthState] = useState({
    token: null,
    user: null,
    role: null
  });

 useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
      const decodedUser = jwtDecode(token);
      const {user} = decodedUser;
      const role = user.role;
      if (token && user) {
        setAuthState({ token, user, role });
      }
    }
    
  }, []);

  
    // Función cuando se inicia sesión
    const login = (token, user, role) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', role);
      setAuthState({ token, user, role });
    };
 
 // Función para cerrar sesión
 const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setAuthState({ token: null, user: null, role: null});
  };
  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
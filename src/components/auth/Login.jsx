import { useState,useContext } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../auth/authContext';


const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  
  const sendLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', credentials);
      if(response.status===200){
        const {token} = response.data;
        // Decodificar el token para obtener los claims (incluido el user)
        const decodedToken = jwtDecode(token);
        const {user} = decodedToken;
        //llamar al login del contexto
        login(token,user, user.role);
        if (user.role === 'ADMIN' || user.role === 'INSTRUCTOR') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      }
    
    } catch (error) {
      if(error.response.status===403){
        alert("Usuario o Constraseña incorrectos...!"); //pueden implementar SweetAlert2
      }
        console.error('Error al iniciar sesión', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Inicio de Sesion en <br /> PlayFlix</h2>
      <form onSubmit={(e) => sendLogin(e, credentials)}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            required
            placeholder="usuario"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            placeholder="contraseña"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  </div>
  );
};

export default Login;
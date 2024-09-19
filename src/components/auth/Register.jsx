import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Register = () => {
  let emptyRegister  = {
    id:null,
    nombre:'',
    username:'',
    email:'',
    password:'',
    enabled: true

  }
  const [registerRequest, setRegisterRequest] = useState(emptyRegister);
  const [nombre, setNombre] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const url = 'http://localhost:8080/auth/register';

  const sendRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    try {
      //seteando datos del objeto antes de enviar la petición
      let _registerRequest = {...emptyRegister};
      _registerRequest.nombre = nombre;
      _registerRequest.username = username;
      _registerRequest.email = email;
      _registerRequest.password = password;
      setRegisterRequest(_registerRequest);
      const response = await axios.post(url, _registerRequest);
      if(response.status===200){
        //console.log('User registered:', response.data);
        MySwal.fire({
            title: <p>Registrado</p>,
            text: 'Se ha creado el registro del usuario',
            icon: 'success',
            confirmButtonText: 'Ok',
        });
        navigate("/login");          
      }
      
    } catch (error) {
      console.error('error:', error);
      setErrorMessage('El registro falló. Por favor inténtalo de nuevo');
    }
  };

  const getFechaActual = () =>{
    let date = new Date();
    let day = `${(date.getDate())}`.padStart(2,'0');
    let month = `${(date.getMonth()+1)}`.padStart(2,'0');
    let year = date.getFullYear();
    let fullDate = `${year}-${month}-${day}`;
    return fullDate;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Registro de Usuarios</h2>
        
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={sendRegister} className="space-y-4">
        <div>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite un nombre y un apellido"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div> 
          <div>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese su username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese su email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese su password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirme su password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Registrase
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
import React, { useState } from 'react'
import { FaBars, FaHome, FaEtsy, FaBraille, FaCheckDouble, FaCog } from "react-icons/fa";
import { FaPersonChalkboard } from "react-icons/fa6";
import { Link } from 'react-router-dom/dist';


const Sidebar = () => {
    const [isOpen, setIsOpen ] = useState(false);
  return (
    <div>
      {/* button para tamaños pequeñas->moviles */}
       <button 
            className='md:hidden p-4 text-white bg-gray-800'
            onClick={() => setIsOpen(!isOpen)}          
       >
        <FaBars />
        </button> 
        <div className={`h-full md:w-64 bg-[#172554] text-white p-4 fixed 
            md:relative transition-transform transform ${isOpen ?  
            "translate-x-0" : "-translate-x-full"} md:translate-x-0` }>
                <h1 className='text-2xl font-bold mb-6'>PlayFlix-App</h1>
            <ul>
                <li className='mb-4 flex items-center'>
                    <FaHome className='mr-3' />
                    <Link to="/" className="hover:text-gray-200">Inicio</Link>
                </li>
                <li className='mb-4 flex items-center'>
                <i className='pi pi-list-check mr-3'></i>
                    <Link to="/clasificaciones" className="hover:text-gray-200">Clasificaciones</Link>
                </li>
                <li className='mb-4 flex items-center'>
                <i className='pi pi-play-circle mr-3'></i>
                    <Link to="/contenidos" className="hover:text-gray-200">Peliculas</Link>
                </li>
                <li className='mb-4 flex items-center'>
                <i className='pi pi-heart mr-3'></i>
                    <Link to="/favoritos" className="hover:text-gray-200">Favoritos</Link>
                </li>
                <li className='mb-4 flex items-center'>
                <i className='pi pi-comments mr-3'></i>
                    <Link to="/comentarios" className="hover:text-gray-200">Comentarios</Link>
                </li>
                <li className='mb-4 flex items-center'>
                <i className='pi pi-comments mr-3'></i>
                    <Link to="/login" className="hover:text-gray-200">Iniciar Sesion</Link>
                </li>
                <li className='mb-4 flex items-center'>
                <i className='pi pi-comments mr-3'></i>
                    <Link to="/register" className="hover:text-gray-200">Registrarse</Link>
                </li>
            </ul>    
        </div>
    </div>
  )
}

export default Sidebar
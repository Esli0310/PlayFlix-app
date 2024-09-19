import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import Sidebar from './dashoard/Sidedar';
import Dashboard from './dashoard/Dashoard';
import Navbar from './dashoard/Navbar';
import Footer from './dashoard/Footer';
import React from 'react';
import Clasificacion from './components/Clasificacion'
import Contenido from './components/Contenido.jsx'
import Comentario from './components/Comentario.jsx'
import Favorito from './components/Favorito'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import './App.css'

function App() {
  return (
    <Router>
      <div className='absolute w-full top-0 bottom-0 right-0 left-0 flex flex-col md:flex-row h-screen'>
          <Sidebar />
          <div className='flex flex-col flex-grow'>
              <Navbar />
              <div className='flex-grow overflow-y-auto p-4 bg-gray-100'>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/clasificaciones" element={<Clasificacion />} />
                    <Route path="/contenidos" element={<Contenido />} />
                    <Route path="/favoritos" element={<Favorito />} />
                    <Route path="/comentarios" element={<Comentario />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                  </Routes>
              </div>
              <Footer />
          </div>  
      </div>
    </Router>
  );
}

export default App

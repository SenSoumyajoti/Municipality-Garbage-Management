import { useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import io from 'socket.io-client'
import './App.css'
import Home from './pages/Home'
import LoginPage from './pages/Login'
const backendURL = import.meta.env.VITE_BACKEND_URL

const isAdmin = 'flase';

export const socket = io(`${backendURL}`,{
  query: {isAdmin},
});

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element={< LoginPage />} />
          <Route path='/' element={< Home />} />
        </Routes>
      </Router>
    </>
  )
}

export default App

import { useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import io from 'socket.io-client'
import './App.css'
import LoginPage from './pages/Login'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element={< LoginPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App

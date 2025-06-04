import { useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import io from 'socket.io-client'
import './App.css'
import LoginPage from './pages/Login'
import HomePage from './pages/Dashboard'
import FeedbackPage from './pages/Feedback'
import CollectionRequestPage from './pages/CollectionRequest'
import HistoryPage from './pages/History'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element={< LoginPage />} />
          <Route path='/' element={< HomePage />} />
          <Route path='/feedback' element={<FeedbackPage />} />
          <Route path='/request' element={<CollectionRequestPage />} />
          <Route path='/history' element={<HistoryPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App

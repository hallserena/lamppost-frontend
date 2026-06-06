import { Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/Nav'
import Journal from './pages/Journal'
import Mood from './pages/Mood'
import Analytics from './pages/Analytics'
import Skills from './pages/Skills'
import Login from './pages/Login'

function App() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px' }}>
      <Nav />
      <Routes>
        <Route path="/" element={<Navigate to="/journal" />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/mood" element={<Mood />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App

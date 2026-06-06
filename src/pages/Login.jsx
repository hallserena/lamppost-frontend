import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError]       = useState('')
  const navigate                = useNavigate()

  const handleSubmit = async () => {
    setError('')
    try {
      const endpoint = isSignUp ? '/auth/signup' : '/auth/signin'
      const response = await api.post(endpoint, { email, password })
      if (!isSignUp) {
        localStorage.setItem('token', response.data.access_token)
        navigate('/journal')
      } else {
        setError('Account created! Check your email to confirm, then sign in.')
        setIsSignUp(false)
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 500, marginBottom: '24px' }}>
        {isSignUp ? 'Create account' : 'Sign in'}
      </h1>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '4px' }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '0.5px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '4px' }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '0.5px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
        />
      </div>

      {error && (
        <p style={{ fontSize: '13px', color: '#E24B4A', marginBottom: '12px' }}>{error}</p>
      )}

      <button
        onClick={handleSubmit}
        style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#4F46E5', color: 'white', border: 'none', fontSize: '14px', fontWeight: 500, cursor: 'pointer', marginBottom: '12px' }}
      >
        {isSignUp ? 'Create account' : 'Sign in'}
      </button>

      <p style={{ fontSize: '13px', color: '#666', textAlign: 'center' }}>
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <span
          onClick={() => setIsSignUp(!isSignUp)}
          style={{ color: '#4F46E5', cursor: 'pointer' }}
        >
          {isSignUp ? 'Sign in' : 'Sign up'}
        </span>
      </p>
    </div>
  )
}

export default Login

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Confirm() {
  const [message, setMessage] = useState('Confirming your account...')
  const navigate = useNavigate()

  useEffect(() => {
    // Supabase puts the token in the URL hash
    const hash = window.location.hash
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1))
      const token = params.get('access_token')
      if (token) {
        localStorage.setItem('token', token)
        setMessage('Account confirmed! Redirecting...')
        setTimeout(() => navigate('/journal'), 2000)
      }
    } else {
      setMessage('Invalid confirmation link. Please try signing up again.')
    }
  }, [navigate])

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center' }}>
      <p style={{ fontSize: '16px', color: '#444' }}>{message}</p>
    </div>
  )
}

export default Confirm
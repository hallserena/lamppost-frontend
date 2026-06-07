import { useState } from 'react'
import api from '../api'

const PAGES = ['Journal', 'Mood', 'Analytics', 'Skills', 'Other']
const SEVERITIES = [
  { value: 'minor',  label: 'Minor',  desc: 'Small issue, app still works' },
  { value: 'major',  label: 'Major',  desc: 'Feature broken or unusable' },
  { value: 'crash',  label: 'Crash',  desc: 'App crashes or data lost' },
]

function BugReport({ onClose }) {
  const [description, setDescription] = useState('')
  const [page, setPage]               = useState('')
  const [severity, setSeverity]       = useState('')
  const [userEmail, setUserEmail]     = useState('')
  const [submitted, setSubmitted]     = useState(false)
  const [error, setError]             = useState('')
  const [loading, setLoading]         = useState(false)

  const handleSubmit = async () => {
    if (!description || !severity) return
    setLoading(true)
    try {
      await api.post('/bugs', {
        description,
        page:       page || null,
        severity,
        user_email: userEmail || null,
      })
      setSubmitted(true)
    } catch {
      setError('Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div style={overlay}>
        <div style={modal}>
          <p style={{ fontSize: '32px', textAlign: 'center', margin: '0 0 12px' }}>✓</p>
          <h2 style={{ fontSize: '18px', fontWeight: 500, margin: '0 0 8px', textAlign: 'center' }}>Thanks for the report!</h2>
          <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', margin: '0 0 20px' }}>We'll look into it soon.</p>
          <button onClick={onClose} style={btn}>Close</button>
        </div>
      </div>
    )
  }

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 500, margin: 0 }}>Report a bug</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666' }}>×</button>
        </div>

        <label style={label}>What page did this happen on?</label>
        <select value={page} onChange={e => setPage(e.target.value)} style={input}>
          <option value="">Select a page...</option>
          {PAGES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <label style={label}>Severity</label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {SEVERITIES.map(s => (
            <button
              key={s.value}
              onClick={() => setSeverity(s.value)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: severity === s.value ? '2px solid #4F46E5' : '1px solid #ddd',
                background: severity === s.value ? '#EEF2FF' : 'white',
                color: severity === s.value ? '#4F46E5' : '#444',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: severity === s.value ? 500 : 400,
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <label style={label}>Describe the bug *</label>
        <textarea
          placeholder="What happened? What were you expecting?"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
          style={{ ...input, resize: 'vertical' }}
        />

        <label style={label}>Your email (optional, for follow-up)</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={userEmail}
          onChange={e => setUserEmail(e.target.value)}
          style={input}
        />

        {error && <p style={{ color: '#E24B4A', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={!description || !severity || loading}
          style={{
            ...btn,
            background: !description || !severity ? '#ddd' : '#4F46E5',
            color: !description || !severity ? '#999' : 'white',
            cursor: !description || !severity ? 'default' : 'pointer',
          }}
        >
          {loading ? 'Submitting...' : 'Submit report'}
        </button>
      </div>
    </div>
  )
}

const overlay = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.4)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 1000,
}
const modal = {
  background: 'white', borderRadius: '16px', padding: '24px',
  width: '100%', maxWidth: '480px', margin: '0 16px',
}
const label = { display: 'block', fontSize: '13px', color: '#666', marginBottom: '6px' }
const input = {
  width: '100%', padding: '8px 10px', borderRadius: '8px',
  border: '1px solid #ddd', fontSize: '14px', marginBottom: '16px',
  boxSizing: 'border-box',
}
const btn = {
  width: '100%', padding: '10px', borderRadius: '8px',
  border: 'none', fontSize: '14px', fontWeight: 500,
}

export default BugReport
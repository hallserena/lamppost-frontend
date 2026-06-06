import { useState, useEffect } from 'react'
import api from '../api'

const MOODS = ['great', 'good', 'neutral', 'low', 'terrible']

const MOOD_COLORS = {
  great:   { bg: '#DCFCE7', text: '#166534' },
  good:    { bg: '#DBEAFE', text: '#1E40AF' },
  neutral: { bg: '#F3F4F6', text: '#374151' },
  low:     { bg: '#FEF9C3', text: '#854D0E' },
  terrible:{ bg: '#FEE2E2', text: '#991B1B' },
}

function Mood() {
  const [selected, setSelected] = useState('')
  const [note, setNote]         = useState('')
  const [logs, setLogs]         = useState([])
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')

  const fetchLogs = async () => {
    try {
      const response = await api.get('/moods', { params: { days: 30 } })
      setLogs(response.data.reverse())
    } catch {
      setError('Could not load mood logs.')
    }
  }

  useEffect(() => { fetchLogs() }, [])

  const handleLog = async () => {
    if (!selected) return
    try {
      await api.post('/moods', { mood: selected, note: note || null })
      setSelected('')
      setNote('')
      setSuccess('Mood logged!')
      setTimeout(() => setSuccess(''), 2000)
      fetchLogs()
    } catch {
      setError('Could not log mood.')
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 500, marginBottom: '24px' }}>Mood tracker</h1>

      <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>How are you feeling?</p>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {MOODS.map(mood => (
          <button
            key={mood}
            onClick={() => setSelected(mood)}
            style={{
              padding: '8px 16px',
              borderRadius: '99px',
              border: '0.5px solid #ddd',
              fontSize: '14px',
              cursor: 'pointer',
              background: selected === mood ? MOOD_COLORS[mood].bg : 'white',
              color: selected === mood ? MOOD_COLORS[mood].text : '#666',
              fontWeight: selected === mood ? 500 : 400,
            }}
          >
            {mood.charAt(0).toUpperCase() + mood.slice(1)}
          </button>
        ))}
      </div>

      <textarea
        placeholder="Add a note (optional)..."
        value={note}
        onChange={e => setNote(e.target.value)}
        rows={3}
        style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '0.5px solid #ddd', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box', resize: 'vertical' }}
      />

      {error   && <p style={{ color: '#E24B4A', fontSize: '13px', marginBottom: '8px' }}>{error}</p>}
      {success && <p style={{ color: '#166534', fontSize: '13px', marginBottom: '8px' }}>{success}</p>}

      <button
        onClick={handleLog}
        disabled={!selected}
        style={{ padding: '10px 24px', borderRadius: '8px', background: selected ? '#4F46E5' : '#ddd', color: selected ? 'white' : '#999', border: 'none', fontSize: '14px', fontWeight: 500, cursor: selected ? 'pointer' : 'default', marginBottom: '32px' }}
      >
        Log mood
      </button>

      <h2 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '12px' }}>Recent log</h2>
      {logs.length === 0 && <p style={{ color: '#999', fontSize: '14px' }}>No moods logged yet.</p>}
      {logs.map(log => (
        <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '0.5px solid #f0f0f0' }}>
          <span style={{ padding: '3px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 500, background: MOOD_COLORS[log.mood].bg, color: MOOD_COLORS[log.mood].text }}>
            {log.mood.charAt(0).toUpperCase() + log.mood.slice(1)}
          </span>
          <span style={{ fontSize: '13px', color: '#555', flex: 1 }}>{log.note || ''}</span>
          <span style={{ fontSize: '12px', color: '#999' }}>
            {new Date(log.logged_at).toLocaleDateString()}
          </span>
        </div>
      ))}
    </div>
  )
}

export default Mood

import { useState, useEffect } from 'react'
import api from '../api'

function Journal() {
  const [entries, setEntries]   = useState([])
  const [title, setTitle]       = useState('')
  const [body, setBody]         = useState('')
  const [tags, setTags]         = useState('')
  const [search, setSearch]     = useState('')
  const [showForm, setShowForm] = useState(false)
  const [error, setError]       = useState('')

  const fetchEntries = async () => {
    try {
      const params = search ? { search } : {}
      const response = await api.get('/entries', { params })
      setEntries(response.data)
    } catch {
      setError('Could not load entries. Are you signed in?')
    }
  }

  useEffect(() => { fetchEntries() }, [search])

  const handleCreate = async () => {
    if (!body) return
    try {
      await api.post('/entries', {
        title: title || null,
        body,
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
      })
      setTitle('')
      setBody('')
      setTags('')
      setShowForm(false)
      fetchEntries()
    } catch {
      setError('Could not save entry.')
    }
  }

  const handleDelete = async (id) => {
    await api.delete(`/entries/${id}`)
    fetchEntries()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 500, margin: 0 }}>Journal</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '8px 16px', borderRadius: '8px', background: '#4F46E5', color: 'white', border: 'none', fontSize: '14px', cursor: 'pointer' }}
        >
          {showForm ? 'Cancel' : '+ New entry'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#F9F9F9', border: '0.5px solid #ddd', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <input
            placeholder="Title (optional)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '0.5px solid #ddd', fontSize: '14px', marginBottom: '10px', boxSizing: 'border-box' }}
          />
          <textarea
            placeholder="Write your entry..."
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={6}
            style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '0.5px solid #ddd', fontSize: '14px', marginBottom: '10px', boxSizing: 'border-box', resize: 'vertical' }}
          />
          <input
            placeholder="Tags (comma separated, e.g. work, goals)"
            value={tags}
            onChange={e => setTags(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '0.5px solid #ddd', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box' }}
          />
          <button
            onClick={handleCreate}
            style={{ padding: '8px 20px', borderRadius: '8px', background: '#4F46E5', color: 'white', border: 'none', fontSize: '14px', cursor: 'pointer' }}
          >
            Save entry
          </button>
        </div>
      )}

      <input
        placeholder="Search entries..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '0.5px solid #ddd', fontSize: '14px', marginBottom: '16px', boxSizing: 'border-box' }}
      />

      {error && <p style={{ color: '#E24B4A', fontSize: '13px' }}>{error}</p>}

      {entries.length === 0 && (
        <p style={{ color: '#999', fontSize: '14px' }}>No entries yet. Write your first one!</p>
      )}

      {entries.map(entry => (
        <div key={entry.id} style={{ background: 'white', border: '0.5px solid #ddd', borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <p style={{ margin: 0, fontWeight: 500, fontSize: '15px' }}>{entry.title || 'Untitled'}</p>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#999' }}>
                {new Date(entry.created_at).toLocaleDateString()}
              </span>
              <button
                onClick={() => handleDelete(entry.id)}
                style={{ background: 'none', border: 'none', color: '#E24B4A', cursor: 'pointer', fontSize: '13px' }}
              >
                Delete
              </button>
            </div>
          </div>
          <p style={{ margin: '8px 0 10px', fontSize: '14px', color: '#444', lineHeight: 1.6 }}>
            {entry.body.length > 200 ? entry.body.slice(0, 200) + '...' : entry.body}
          </p>
          {entry.tags.length > 0 && (
            <div>
              {entry.tags.map(tag => (
                <span key={tag} style={{ display: 'inline-block', fontSize: '11px', padding: '2px 8px', borderRadius: '99px', background: '#EEF2FF', color: '#4F46E5', marginRight: '4px' }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Journal

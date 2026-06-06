import { useState, useEffect } from 'react'
import api from '../api'

function Skills() {
  const [skills, setSkills]     = useState([])
  const [skill, setSkill]       = useState('')
  const [description, setDesc]  = useState('')
  const [tags, setTags]         = useState('')
  const [showForm, setShowForm] = useState(false)
  const [error, setError]       = useState('')

  const fetchSkills = async () => {
    try {
      const response = await api.get('/skills')
      setSkills(response.data)
    } catch {
      setError('Could not load skills. Are you signed in?')
    }
  }

  useEffect(() => { fetchSkills() }, [])

  const handleCreate = async () => {
    if (!skill) return
    try {
      await api.post('/skills', {
        skill,
        description: description || null,
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
      })
      setSkill('')
      setDesc('')
      setTags('')
      setShowForm(false)
      fetchSkills()
    } catch {
      setError('Could not save skill.')
    }
  }

  const handleDelete = async (id) => {
    await api.delete(`/skills/${id}`)
    fetchSkills()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 500, margin: 0 }}>Skills log</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '8px 16px', borderRadius: '8px', background: '#4F46E5', color: 'white', border: 'none', fontSize: '14px', cursor: 'pointer' }}
        >
          {showForm ? 'Cancel' : '+ Log skill'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#F9F9F9', border: '0.5px solid #ddd', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <input
            placeholder="Skill name (e.g. FastAPI routing)"
            value={skill}
            onChange={e => setSkill(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '0.5px solid #ddd', fontSize: '14px', marginBottom: '10px', boxSizing: 'border-box' }}
          />
          <textarea
            placeholder="Description (optional)..."
            value={description}
            onChange={e => setDesc(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '0.5px solid #ddd', fontSize: '14px', marginBottom: '10px', boxSizing: 'border-box', resize: 'vertical' }}
          />
          <input
            placeholder="Tags (comma separated, e.g. python, backend)"
            value={tags}
            onChange={e => setTags(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '0.5px solid #ddd', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box' }}
          />
          <button
            onClick={handleCreate}
            style={{ padding: '8px 20px', borderRadius: '8px', background: '#4F46E5', color: 'white', border: 'none', fontSize: '14px', cursor: 'pointer' }}
          >
            Save skill
          </button>
        </div>
      )}

      {error && <p style={{ color: '#E24B4A', fontSize: '13px' }}>{error}</p>}

      {skills.length === 0 && (
        <p style={{ color: '#999', fontSize: '14px' }}>No skills logged yet. Add your first one!</p>
      )}

      {skills.map(s => (
        <div key={s.id} style={{ background: 'white', border: '0.5px solid #ddd', borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <p style={{ margin: 0, fontWeight: 500, fontSize: '15px' }}>{s.skill}</p>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#999' }}>
                {new Date(s.created_at).toLocaleDateString()}
              </span>
              <button
                onClick={() => handleDelete(s.id)}
                style={{ background: 'none', border: 'none', color: '#E24B4A', cursor: 'pointer', fontSize: '13px' }}
              >
                Delete
              </button>
            </div>
          </div>
          {s.description && (
            <p style={{ margin: '8px 0 10px', fontSize: '14px', color: '#444', lineHeight: 1.6 }}>{s.description}</p>
          )}
          {s.tags.length > 0 && (
            <div>
              {s.tags.map(tag => (
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

export default Skills

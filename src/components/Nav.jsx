import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import BugReport from './BugReport'

const tabs = [
  { label: 'Journal',   path: '/journal' },
  { label: 'Mood',      path: '/mood' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Skills',    path: '/skills' },
]

function Nav() {
  const location = useLocation()
  const [showBug, setShowBug] = useState(false)

  return (
    <>
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0',
        borderBottom: '0.5px solid #ddd',
        marginBottom: '24px',
      }}>
        <span style={{ fontWeight: 500, fontSize: '18px' }}>🪔 Lamppost</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {tabs.map(tab => (
            <Link
              key={tab.path}
              to={tab.path}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                background: location.pathname === tab.path ? '#EEF2FF' : 'transparent',
                color: location.pathname === tab.path ? '#4F46E5' : '#666',
                fontWeight: location.pathname === tab.path ? 500 : 400,
              }}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>

      <button
        onClick={() => setShowBug(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          padding: '10px 18px',
          borderRadius: '99px',
          background: '#1a1a1a',
          color: 'white',
          border: 'none',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          zIndex: 999,
        }}
      >
        🐛 Report a bug
      </button>

      {showBug && <BugReport onClose={() => setShowBug(false)} />}
    </>
  )
}

export default Nav
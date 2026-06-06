import { Link, useLocation } from 'react-router-dom'

const tabs = [
  { label: 'Journal', path: '/journal' },
  { label: 'Mood',    path: '/mood' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Skills',  path: '/skills' },
]

function Nav() {
  const location = useLocation()

  return (
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
  )
}

export default Nav

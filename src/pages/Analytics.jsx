import { useState, useEffect } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid
} from 'recharts'
import api from '../api'

const MOOD_LABELS = { 5: 'Great', 4: 'Good', 3: 'Neutral', 2: 'Low', 1: 'Terrible' }

function HeatMap({ data }) {
  if (!data.length) return <p style={{ color: '#999', fontSize: '14px' }}>No data yet.</p>
  const max = Math.max(...data.map(d => d.count))
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
      {data.map(d => {
        const intensity = max > 0 ? d.count / max : 0
        const blue = Math.round(255 - intensity * 200)
        const red  = Math.round(intensity * 220)
        const bg   = `rgb(${red}, 80, ${blue})`
        return (
          <div
            key={d.date}
            title={`${d.date}: ${d.count} log${d.count !== 1 ? 's' : ''}`}
            style={{ width: '28px', height: '28px', borderRadius: '4px', background: bg }}
          />
        )
      })}
    </div>
  )
}

function Analytics() {
  const [charts, setCharts] = useState(null)
  const [error, setError]   = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await api.get('/moods/charts', { params: { days: 90 } })
        setCharts(response.data)
      } catch {
        setError('Could not load chart data. Are you signed in?')
      }
    }
    fetch()
  }, [])

  if (error)   return <p style={{ color: '#E24B4A', fontSize: '14px' }}>{error}</p>
  if (!charts) return <p style={{ color: '#999', fontSize: '14px' }}>Loading...</p>

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 500, marginBottom: '24px' }}>Analytics</h1>

      <h2 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '12px' }}>Mood over time</h2>
      <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>Every individual mood logged</p>
      {charts.timeline.length === 0
        ? <p style={{ color: '#999', fontSize: '14px', marginBottom: '32px' }}>No data yet.</p>
        : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={charts.timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={d => d.slice(5)} />
              <YAxis domain={[1, 5]} tickFormatter={v => MOOD_LABELS[v] || v} tick={{ fontSize: 11 }} width={55} />
              <Tooltip formatter={(v) => MOOD_LABELS[v] || v} labelFormatter={l => l.slice(0, 10)} />
              <Line type="monotone" dataKey="score" stroke="#4F46E5" dot={{ r: 3 }} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )
      }

      <h2 style={{ fontSize: '16px', fontWeight: 500, margin: '32px 0 8px' }}>Trend line</h2>
      <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>Daily average mood score</p>
      {charts.trend.length === 0
        ? <p style={{ color: '#999', fontSize: '14px', marginBottom: '32px' }}>No data yet.</p>
        : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={charts.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={d => d.slice(5)} />
              <YAxis domain={[1, 5]} tickFormatter={v => MOOD_LABELS[v] || v} tick={{ fontSize: 11 }} width={55} />
              <Tooltip formatter={(v) => v + ' avg'} labelFormatter={l => l.slice(0, 10)} />
              <Line type="monotone" dataKey="avg_score" stroke="#1D9E75" dot={false} strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        )
      }

      <h2 style={{ fontSize: '16px', fontWeight: 500, margin: '32px 0 8px' }}>Activity heat map</h2>
      <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
        Blue = fewer logs that day · Red = more logs that day
      </p>
      <HeatMap data={charts.heatmap} />
    </div>
  )
}

export default Analytics

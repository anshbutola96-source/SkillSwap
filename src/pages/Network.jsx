import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAnsh } from '../context.jsx'
import { initials } from '../data.js'
import { RoleBadge } from '../components/Cards.jsx'

export default function Network() {
  const { db, user, toggleFollow } = useAnsh()
  const [who, setWho] = useState('all')
  const following = user.following || []
  const people = db.people.filter((p) => p.id !== user.id)
  const list =
    who === 'teachers'
      ? people.filter((p) => p.role === 'Teacher')
      : who === 'students'
        ? people.filter((p) => p.role === 'Student')
        : people.filter((p) => p.role !== 'Admin')

  return (
    <main className="shell page">
      <h1>People</h1>
      <p className="muted">
        Follow classmates and faculty. Message them about a free item or a Meet session.
      </p>
      <div className="filters">
        {[
          { id: 'all', label: 'Everyone' },
          { id: 'teachers', label: 'Teachers' },
          { id: 'students', label: 'Students' },
        ].map((f) => (
          <button key={f.id} className={who === f.id ? 'on' : ''} onClick={() => setWho(f.id)}>
            {f.label}
          </button>
        ))}
      </div>
      <div className="network-grid">
        {list.map((p) => (
          <article className="panel network-card" key={p.id}>
            <Link to={`/u/${p.id}`} className="person">
              <span className={`avatar lg ${p.role === 'Teacher' ? 'teacher' : p.role === 'Admin' ? 'admin' : ''}`}>
                {initials(p.name)}
              </span>
              <div>
                <div className="post-name">
                  <strong>{p.name}</strong>
                  <RoleBadge role={p.role} />
                </div>
                <p className="meta">{p.branch}</p>
              </div>
            </Link>
            <p className="muted" style={{ marginTop: 10 }}>
              {p.bio}
            </p>
            <div className="hero-actions">
              <button className="btn ghost" type="button" onClick={() => toggleFollow(p.id)}>
                {following.includes(p.id) ? 'Following' : 'Follow'}
              </button>
              <Link className="btn" to={`/u/${p.id}`}>
                Profile
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

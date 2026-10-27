import { Link } from 'react-router-dom'
import { useAnsh } from '../context.jsx'
import { initials } from '../data.js'
import { RoleBadge } from '../components/Cards.jsx'

export default function Inbox() {
  const { db, person, user } = useAnsh()
  const mine = db.inbox.filter((i) => i.from === user.id || i.to === user.id)

  return (
    <main className="shell page">
      <h1>Inbox</h1>
      <p className="muted">Messages between students and teachers, item requests, and Meet sessions.</p>
      {mine.length === 0 ? (
        <div className="empty" style={{ marginTop: 18 }}>
          No messages yet. Follow someone, request a free item, or message them from their profile.
        </div>
      ) : (
        <div className="list" style={{ marginTop: 18 }}>
          {mine.map((item) => {
            const otherId = item.from === user.id ? item.to : item.from
            const other = person(otherId)
            const href =
              item.type === 'resource'
                ? `/share/${item.listingId}`
                : item.type === 'skill'
                  ? `/skills/${item.listingId}`
                  : `/u/${otherId}`
            return (
              <div className="row" key={item.id}>
                <div className="person" style={{ margin: 0, alignItems: 'start' }}>
                  <span className={`avatar ${other?.role === 'Teacher' ? 'teacher' : ''}`}>
                    {initials(other?.name || '?')}
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <div className="meta">
                      {item.from === user.id ? 'You → ' : ''}
                      {other?.name} <RoleBadge role={other?.role} /> · {item.status}
                    </div>
                    <div className="meta">{item.message}</div>
                  </div>
                </div>
                <Link className="btn ghost" to={href}>
                  Open
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}

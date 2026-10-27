import { Link, useNavigate, useParams } from 'react-router-dom'
import { PencilRuler } from 'lucide-react'
import { useAnsh } from '../context.jsx'
import { initials } from '../data.js'

export default function ShareDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { db, person, user, requestResource, removeResource, admin } = useAnsh()
  const item = db.resources.find((r) => r.id === id)
  if (!item) {
    return (
      <main className="shell page">
        <p>Listing not found.</p>
        <Link to="/share">Back to items</Link>
      </main>
    )
  }
  const owner = person(item.ownerId)
  const mine = item.ownerId === user.id

  return (
    <main className="shell detail">
      <article>
        <div className="hero-photo" data-cat={item.category}>
          {item.photo ? (
            <img src={item.photo} alt={item.title} />
          ) : (
            <div className="thumb" data-cat={item.category} style={{ height: '100%', width: '100%', border: 0 }}>
              <PencilRuler size={56} strokeWidth={1.5} />
            </div>
          )}
        </div>
        <p className="muted">{item.category}</p>
        <h1>{item.title}</h1>
        <p className="story">{item.story}</p>
        <div className="meta" style={{ marginTop: 16 }}>
          <span className="chip">{item.condition}</span>
          <span className="chip">Free</span>
          <span className="chip">{item.status}</span>
        </div>
      </article>
      <aside className="side">
        <div className="person" style={{ marginBottom: 14 }}>
          <span className="avatar">{initials(owner?.name || '?')}</span>
          <div>
            <strong>{owner?.name}</strong>
            <div className="meta">{owner?.branch}</div>
          </div>
        </div>
        <p className="muted" style={{ marginBottom: 16 }}>
          {owner?.bio}
        </p>
        {mine ? (
          <p className="muted">This is your listing.</p>
        ) : (
          <button
            className="btn"
            disabled={item.status !== 'Available'}
            onClick={() => requestResource(item.id)}
          >
            {item.status === 'Available' ? 'Request free item' : 'Already requested'}
          </button>
        )}
        {admin || mine ? (
          <button
            className="btn ghost danger-btn"
            type="button"
            style={{ marginTop: 10 }}
            onClick={async () => {
              if (!window.confirm('Remove this item listing?')) return
              await removeResource(item.id)
              navigate('/share')
            }}
          >
            Remove listing
          </button>
        ) : null}
        <p className="meta" style={{ marginTop: 12 }}>
          No payment. Coordinate in Inbox after you request.
        </p>
      </aside>
    </main>
  )
}

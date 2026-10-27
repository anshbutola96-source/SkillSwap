import { Link, useNavigate, useParams } from 'react-router-dom'
import { Clock, Video } from 'lucide-react'
import { useAnsh } from '../context.jsx'
import { initials } from '../data.js'

export default function SkillDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { db, person, user, joinSession, removeSkill, admin } = useAnsh()
  const item = db.skills.find((s) => s.id === id)
  if (!item) {
    return (
      <main className="shell page">
        <p>This session is no longer listed.</p>
        <Link to="/skills">Back to knowledge sessions</Link>
      </main>
    )
  }
  const mentor = person(item.mentorId)
  const mine = item.mentorId === user.id

  return (
    <main className="shell detail">
      <article>
        {item.photo ? (
          <div className="hero-photo">
            <img src={item.photo} alt={item.title} />
          </div>
        ) : null}
        <p className="muted">{item.category}</p>
        <h1>{item.title}</h1>
        <p className="story">{item.cover}</p>
        <ul className="bullets">
          {item.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <div className="meta" style={{ marginTop: 16 }}>
          <span className="chip">
            <Clock size={14} /> 25 minutes
          </span>
          <span className="chip">
            <Video size={14} /> Free on Google Meet
          </span>
        </div>
      </article>
      <aside className="side">
        <div className="person" style={{ marginBottom: 14 }}>
          <span className="avatar">{initials(mentor?.name || '?')}</span>
          <div>
            <strong>{mentor?.name}</strong>
            <div className="meta">{mentor?.branch}</div>
          </div>
        </div>
        <p className="muted" style={{ marginBottom: 14 }}>
          {mentor?.bio}
        </p>
        {admin || mine ? (
          <button
            className="btn ghost danger-btn"
            type="button"
            style={{ marginBottom: 12 }}
            onClick={async () => {
              if (!window.confirm('Remove this session?')) return
              await removeSkill(item.id)
              navigate('/skills')
            }}
          >
            Remove session
          </button>
        ) : null}
        {mine ? (
          <p className="muted">This is your session. Students join on your Meet link.</p>
        ) : (
          <div className="list">
            {item.slots.map((slot) => (
              <div className="row" key={slot.id}>
                <div>
                  <strong>{slot.label}</strong>
                  <div className="meta">Online · Google Meet</div>
                </div>
                <button className="btn" type="button" onClick={() => joinSession(item.id, slot.id)}>
                  Join Meet
                </button>
              </div>
            ))}
            {item.meetLink ? (
              <a className="btn ghost" href={item.meetLink} target="_blank" rel="noreferrer">
                Open Meet link
              </a>
            ) : null}
          </div>
        )}
      </aside>
    </main>
  )
}

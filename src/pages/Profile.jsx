import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAnsh } from '../context.jsx'
import { initials } from '../data.js'
import { FeedPost, RoleBadge } from '../components/Cards.jsx'

export default function Profile() {
  const { id } = useParams()
  const { user, db, person, resetDemo, toggleFollow, sendMessage, logout, online } = useAnsh()
  const p = id ? person(id) : user
  const isMe = !p || p.id === user.id
  const profile = isMe ? user : p
  const following = user.following || []
  const [note, setNote] = useState('')

  if (!profile) {
    return (
      <main className="shell page">
        <div className="empty">This person is not on SkillSwap yet.</div>
      </main>
    )
  }

  const mineRes = db.resources.filter((r) => r.ownerId === profile.id)
  const mineSkill = db.skills.filter((s) => s.mentorId === profile.id)
  const upcoming = db.bookings.filter((b) => b.from === profile.id || b.to === profile.id)
  const posts = (db.posts || []).filter((post) => post.authorId === profile.id)

  function send(e) {
    e.preventDefault()
    if (!note.trim()) return
    sendMessage(profile.id, note.trim())
    setNote('')
  }

  return (
    <main className="shell page">
      <div className="identity-card profile-hero">
        <div className="identity-cover" />
        <span className={`avatar xl ${profile.role === 'Teacher' ? 'teacher' : profile.role === 'Admin' ? 'admin' : ''}`}>
          {initials(profile.name)}
        </span>
        <div className="identity-body">
          <div className="post-name">
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>{profile.name}</h1>
            <RoleBadge role={profile.role} />
          </div>
          <p className="meta">{profile.branch}</p>
          {profile.enrollment ? <p className="meta">{profile.enrollment}</p> : null}
          <p className="muted" style={{ marginTop: 10 }}>
            {profile.bio}
          </p>
          <div className="identity-stats">
            <span>
              <b>{posts.length}</b> posts
            </span>
            <span>
              <b>{mineRes.length}</b> items
            </span>
            <span>
              <b>{mineSkill.length}</b> sessions
            </span>
            {isMe ? (
              <span>
                <b>{(profile.following || []).length}</b> following
              </span>
            ) : null}
          </div>
          {isMe ? (
            <Link to="/post">List an item or session</Link>
          ) : (
            <div className="hero-actions">
              <button className="btn ghost" type="button" onClick={() => toggleFollow(profile.id)}>
                {following.includes(profile.id) ? 'Following' : 'Follow'}
              </button>
            </div>
          )}
        </div>
      </div>

      {!isMe ? (
        <form className="composer" onSubmit={send} style={{ marginTop: 16 }}>
          <label>
            Message {profile.name.split(' ')[0]}
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                profile.role === 'Teacher'
                  ? 'Ask about a class, notes, or a Meet hour…'
                  : 'Ask about an item, notes, or a session…'
              }
            />
          </label>
          <div className="composer-bar">
            <span className="muted">Goes to Inbox. Not a public post.</span>
            <button className="btn" type="submit" disabled={!note.trim()}>
              Send
            </button>
          </div>
        </form>
      ) : null}

      <section className="section">
        <div className="section-head">
          <h2>Posts</h2>
        </div>
        {posts.length === 0 ? (
          <div className="empty">No posts yet.</div>
        ) : (
          <div className="feed-col">
            {posts.map((post) => (
              <FeedPost key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Listings</h2>
          {isMe ? <Link to="/post">Create listing</Link> : null}
        </div>
        {mineRes.length + mineSkill.length === 0 ? (
          <div className="empty">Nothing listed yet.</div>
        ) : (
          <div className="list">
            {mineRes.map((r) => (
              <Link className="row" key={r.id} to={`/share/${r.id}`}>
                <div>
                  <strong>{r.title}</strong>
                  <div className="meta">
                    {r.category} · {r.status} · Free
                  </div>
                </div>
              </Link>
            ))}
            {mineSkill.map((s) => (
              <Link className="row" key={s.id} to={`/skills/${s.id}`}>
                <div>
                  <strong>{s.title}</strong>
                  <div className="meta">{s.category} · free Meet session</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {isMe ? (
        <section className="section">
          <div className="section-head">
            <h2>Sessions you joined</h2>
          </div>
          {upcoming.length === 0 ? (
            <div className="empty">No sessions yet.</div>
          ) : (
            <div className="list">
              {upcoming.map((b) => (
                <div className="row" key={b.id}>
                  <div>
                    <strong>{b.title}</strong>
                    <div className="meta">{b.when} · Google Meet</div>
                  </div>
                  {b.meetLink ? (
                    <a className="btn" href={b.meetLink} target="_blank" rel="noreferrer">
                      Join Meet
                    </a>
                  ) : (
                    <Link to={`/skills/${b.skillId}`}>Open</Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}

      {isMe ? (
        <div className="hero-actions" style={{ marginTop: 24 }}>
          {online ? null : (
            <button className="btn ghost" type="button" onClick={resetDemo}>
              Reset demo data
            </button>
          )}
          <button className="btn ghost" type="button" onClick={logout}>
            Log out
          </button>
        </div>
      ) : null}
    </main>
  )
}

import { Link, Navigate } from 'react-router-dom'
import { useAnsh } from '../context.jsx'
import { isAdmin } from '../data.js'

export default function Admin() {
  const { user, db, person, removePost, removeResource, removeSkill } = useAnsh()
  if (!isAdmin(user)) return <Navigate to="/" replace />

  const posts = [...(db.posts || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <main className="shell page">
      <h1>Campus moderation</h1>
      <p className="muted" style={{ maxWidth: '40rem' }}>
        Take down a feed post, leftover item, or Meet session if it does not belong on SkillSwap.
        Students and teachers still see everything that stays up.
      </p>

      <section className="section">
        <div className="section-head">
          <h2>Feed posts</h2>
          <span className="meta">{posts.length}</span>
        </div>
        {posts.length === 0 ? (
          <div className="empty">No posts.</div>
        ) : (
          <div className="list">
            {posts.map((post) => {
              const author = person(post.authorId)
              return (
                <div className="row" key={post.id}>
                  <div>
                    <strong>{author?.name || 'Unknown'}</strong>
                    <div className="meta">
                      {post.type} · {post.text.slice(0, 90)}
                      {post.text.length > 90 ? '…' : ''}
                    </div>
                  </div>
                  <button
                    className="btn ghost danger-btn"
                    type="button"
                    onClick={() => {
                      if (window.confirm('Remove this post?')) removePost(post.id)
                    }}
                  >
                    Remove
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Items</h2>
          <span className="meta">{db.resources.length}</span>
        </div>
        {db.resources.length === 0 ? (
          <div className="empty">No items listed.</div>
        ) : (
          <div className="list">
            {db.resources.map((item) => (
              <div className="row" key={item.id}>
                <div>
                  <Link to={`/share/${item.id}`}>
                    <strong>{item.title}</strong>
                  </Link>
                  <div className="meta">
                    {item.category} · {item.status} · {person(item.ownerId)?.name}
                  </div>
                </div>
                <button
                  className="btn ghost danger-btn"
                  type="button"
                  onClick={() => {
                    if (window.confirm('Remove this item listing?')) removeResource(item.id)
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Meet sessions</h2>
          <span className="meta">{db.skills.length}</span>
        </div>
        {db.skills.length === 0 ? (
          <div className="empty">No sessions listed.</div>
        ) : (
          <div className="list">
            {db.skills.map((item) => (
              <div className="row" key={item.id}>
                <div>
                  <Link to={`/skills/${item.id}`}>
                    <strong>{item.title}</strong>
                  </Link>
                  <div className="meta">
                    {item.category} · {person(item.mentorId)?.name}
                  </div>
                </div>
                <button
                  className="btn ghost danger-btn"
                  type="button"
                  onClick={() => {
                    if (window.confirm('Remove this session?')) removeSkill(item.id)
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

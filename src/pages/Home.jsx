import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAnsh } from '../context.jsx'
import { POST_TYPES, initials } from '../data.js'
import { FeedPost, RoleBadge, SkillCard } from '../components/Cards.jsx'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'following', label: 'Following' },
  { id: 'faculty', label: 'Faculty' },
  { id: 'knowledge', label: 'Knowledge' },
  { id: 'need', label: 'Needs' },
  { id: 'update', label: 'Updates' },
]

export default function Home() {
  const { db, user, person, addPost, toggleFollow } = useAnsh()
  const [type, setType] = useState('knowledge')
  const [text, setText] = useState('')
  const [filter, setFilter] = useState('all')
  const following = user.following || []

  const feed = useMemo(() => {
    const posts = [...(db.posts || [])].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    )
    if (filter === 'following') {
      return posts.filter((p) => p.authorId === user.id || following.includes(p.authorId))
    }
    if (filter === 'faculty') {
      const teachers = new Set(db.people.filter((p) => p.role === 'Teacher').map((p) => p.id))
      return posts.filter((p) => teachers.has(p.authorId))
    }
    if (filter === 'all') return posts
    return posts.filter((p) => p.type === filter)
  }, [db.people, db.posts, filter, following, user.id])

  const classmates = db.people.filter((p) => p.role === 'Student' && p.id !== user.id).slice(0, 5)

  function submit(e) {
    e.preventDefault()
    if (!text.trim()) return
    addPost({ type, text })
    setText('')
  }

  return (
    <main>
      <section className="campus-banner campus-banner-slim">
        <img src="/photos/vips-campus.jpg" alt="VIPS Technical Campus, Pitampura" />
        <div className="campus-banner-copy">
          <img src="/vips-logo.png" alt="VIPS" />
          <div>
            <strong>Campus knowledge network</strong>
            <p>Students and teachers sharing what they know — and what they need</p>
          </div>
        </div>
      </section>

      <div className="shell feed-layout">
        <aside className="feed-col">
          <div className="identity-card">
            <div className="identity-body">
              <span className={`avatar lg ${user.role === 'Teacher' ? 'teacher' : user.role === 'Admin' ? 'admin' : ''}`}>
                {initials(user.name)}
              </span>
              <h2>{user.name}</h2>
              <RoleBadge role={user.role} />
              <p className="meta">{user.branch}</p>
              <p className="muted">{user.bio}</p>
              <div className="identity-stats">
                <span>
                  <b>{db.posts.filter((p) => p.authorId === user.id).length}</b> posts
                </span>
                <span>
                  <b>{following.length}</b> following
                </span>
              </div>
              <Link to="/me">View profile</Link>
            </div>
          </div>
          <div className="panel feed-side">
            <h3>On this campus</h3>
            <p className="muted">Free leftover items. Free 25-minute Meet sessions. Ask a teacher in the feed.</p>
            <div className="hero-actions" style={{ marginTop: 10 }}>
              <Link className="btn ghost" to="/share">
                Items
              </Link>
              <Link className="btn ghost" to="/skills">
                Sessions
              </Link>
            </div>
          </div>
        </aside>

        <section className="feed-col">
          <form className="composer" onSubmit={submit}>
            <div className="composer-top">
              <span className={`avatar ${user.role === 'Teacher' ? 'teacher' : user.role === 'Admin' ? 'admin' : ''}`}>
                {initials(user.name)}
              </span>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={
                  user.role === 'Teacher'
                    ? 'Share a note for class, a Meet hour, or an update…'
                    : 'Share knowledge, ask for a book, or post a campus update…'
                }
              />
            </div>
            <div className="composer-bar">
              <div className="composer-types">
                {POST_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={type === t.id ? 'on' : ''}
                    onClick={() => setType(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <button className="btn" type="submit" disabled={!text.trim()}>
                Post
              </button>
            </div>
          </form>

          <div className="filters">
            {FILTERS.map((f) => (
              <button key={f.id} className={filter === f.id ? 'on' : ''} onClick={() => setFilter(f.id)}>
                {f.label}
              </button>
            ))}
          </div>

          {feed.length === 0 ? (
            <div className="empty">No posts in this view yet. Write one above.</div>
          ) : (
            feed.map((post) => <FeedPost key={post.id} post={post} />)
          )}
        </section>

        <aside className="feed-col">
          <div className="panel feed-side">
            <div className="section-head" style={{ marginBottom: 10 }}>
              <h3>People to follow</h3>
              <Link to="/network">See all</Link>
            </div>
            <div className="people-list">
              {classmates.map((p) => (
                <div className="people-row" key={p.id}>
                  <Link to={`/u/${p.id}`} className="person">
                    <span className="avatar">{initials(p.name)}</span>
                    <div>
                      <strong>{p.name}</strong>
                      <div className="meta">{p.branch.split('·')[0].trim()}</div>
                    </div>
                  </Link>
                  <button className="btn ghost" type="button" onClick={() => toggleFollow(p.id)}>
                    {following.includes(p.id) ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="panel feed-side">
            <div className="section-head" style={{ marginBottom: 10 }}>
              <h3>Free Meet sessions</h3>
              <Link to="/skills">See all</Link>
            </div>
            <div className="mini-board">
              {db.skills.slice(0, 2).map((item) => (
                <SkillCard key={item.id} item={item} mentor={person(item.mentorId)} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}

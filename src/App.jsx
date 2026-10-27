import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Bell, LogOut, Plus, Shield } from 'lucide-react'
import { useAnsh } from './context.jsx'
import { BRANCHES, ROLES } from './data.js'
import Home from './pages/Home.jsx'
import Share from './pages/Share.jsx'
import ShareDetail from './pages/ShareDetail.jsx'
import Skills from './pages/Skills.jsx'
import SkillDetail from './pages/SkillDetail.jsx'
import Post from './pages/Post.jsx'
import Inbox from './pages/Inbox.jsx'
import Profile from './pages/Profile.jsx'
import How from './pages/How.jsx'
import Network from './pages/Network.jsx'
import Admin from './pages/Admin.jsx'
import { useEffect, useState } from 'react'

function Logo() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 5h7a3 3 0 0 1 0 6H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5 3 3 5l2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Boot() {
  return (
    <div className="boot">
      <div className="brand">
        <span className="brand-mark">
          <Logo />
        </span>
        SkillSwap
      </div>
      <p className="muted">Connecting to campus accounts…</p>
    </div>
  )
}

function Gate() {
  const { signup, login, online } = useAnsh()
  const [mode, setMode] = useState('login')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    enrollment: '',
    role: 'Student',
    branch: BRANCHES[0],
    bio: '',
  })

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
    setError('')
  }

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      if (mode === 'login') await login(form)
      else await signup(form)
    } catch (err) {
      setError(err.message || 'Could not continue.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="gate">
      <aside className="gate-side">
        <div>
          <div className="brand" style={{ color: '#fff' }}>
            <span className="brand-mark">
              <Logo />
            </span>
            SkillSwap
            <img className="vips-logo vips-logo-light" src="/vips-logo.png" alt="VIPS" />
          </div>
          <h1>A campus knowledge network for students and teachers.</h1>
          <p>
            Create an account, log in later from any browser, and keep your profile on the server.
          </p>
          <ul>
            <li>Email + password. Passwords are not stored in the campus database.</li>
            <li>Feed, leftover items, and free Google Meet sessions.</li>
            <li>No public comments. Message someone from their profile if you need to ask.</li>
          </ul>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
          {online
            ? 'Accounts are saved on Google Firebase (online).'
            : 'Firebase keys are not in .env yet — accounts stay on this computer until the cloud project is connected.'}
        </p>
      </aside>
      <div className="gate-form">
        <form className="gate-card form" onSubmit={submit}>
          <img className="vips-logo-form" src="/vips-logo.png" alt="VIPS" />
          <h2>{mode === 'login' ? 'Log in' : 'Create your account'}</h2>
          <p className="muted">
            {mode === 'login'
              ? 'Use the email you signed up with.'
              : 'Join as a student or teacher. Items and Meet sessions are free.'}
          </p>
          <div className="tabs">
            <button type="button" className={mode === 'login' ? 'on' : ''} onClick={() => setMode('login')}>
              Log in
            </button>
            <button type="button" className={mode === 'signup' ? 'on' : ''} onClick={() => setMode('signup')}>
              Create account
            </button>
          </div>
          {mode === 'signup' ? (
            <label>
              Name
              <input
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                placeholder="Your name"
                required
              />
            </label>
          ) : null}
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              placeholder="you@gmail.com"
              autoComplete="email"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
              placeholder={mode === 'signup' ? 'At least 6 characters' : 'Password'}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              minLength={6}
            />
          </label>
          {mode === 'signup' ? (
            <>
              <label>
                Confirm password
                <input
                  type="password"
                  value={form.confirm}
                  onChange={(e) => setField('confirm', e.target.value)}
                  placeholder="Type it again"
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
              </label>
              <label>
                Enrollment number <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(optional)</span>
                <input
                  value={form.enrollment}
                  onChange={(e) => setField('enrollment', e.target.value)}
                  placeholder="Optional"
                />
              </label>
              <label>
                I am a
                <select value={form.role} onChange={(e) => setField('role', e.target.value)}>
                  {ROLES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </label>
              <label>
                Programme
                <select value={form.branch} onChange={(e) => setField('branch', e.target.value)}>
                  {BRANCHES.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </label>
              <label>
                Short bio
                <input
                  value={form.bio}
                  onChange={(e) => setField('bio', e.target.value)}
                  placeholder="Spare calculator. Can explain loops."
                />
              </label>
            </>
          ) : null}
          {error ? <p className="auth-error">{error}</p> : null}
          <button className="btn" type="submit" disabled={busy}>
            {busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Layout() {
  const { user, db, toast, logout, online, admin } = useAnsh()
  const location = useLocation()
  const waiting = db.inbox.filter((i) => i.to === user.id || i.from === user.id).length

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <>
      <header className="nav">
        <div className="shell nav-inner">
          <NavLink to="/" end className="brand">
            <span className="brand-mark">
              <Logo />
            </span>
            SkillSwap
            <img className="vips-logo" src="/vips-logo.png" alt="VIPS" />
          </NavLink>
          <nav className="nav-links">
            <NavLink to="/" end>
              Feed
            </NavLink>
            <NavLink to="/share">Items</NavLink>
            <NavLink to="/skills">Knowledge</NavLink>
            <NavLink to="/network">People</NavLink>
            <NavLink to="/how">About</NavLink>
            {admin ? (
              <NavLink to="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Shield size={16} /> Moderate
              </NavLink>
            ) : null}
            <NavLink to="/inbox" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Bell size={16} /> Inbox {waiting ? `(${waiting})` : ''}
            </NavLink>
            <NavLink to="/me">{(user.name || 'You').split(' ')[0]}</NavLink>
            <NavLink to="/post" className="btn" style={{ padding: '8px 12px', minHeight: 36 }}>
              <Plus size={16} /> Post
            </NavLink>
            <button
              className="btn ghost"
              type="button"
              onClick={logout}
              title="Log out"
              style={{ padding: '8px 10px', minHeight: 36, marginLeft: 4 }}
            >
              <LogOut size={16} />
            </button>
          </nav>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/share" element={<Share />} />
        <Route path="/share/:id" element={<ShareDetail />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/skills/:id" element={<SkillDetail />} />
        <Route path="/post" element={<Post />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/network" element={<Network />} />
        <Route path="/me" element={<Profile />} />
        <Route path="/u/:id" element={<Profile />} />
        <Route path="/how" element={<How />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer className="footer">
        <div className="shell footer-inner">
          <span className="footer-brand">
            <span className="brand-mark">
              <Logo />
            </span>
            SkillSwap
            <img className="vips-logo" src="/vips-logo.png" alt="VIPS" />
          </span>
          <span className={online ? 'cloud-pill' : ''}>
            {online ? 'Accounts online · Firebase' : 'VIPS-TC · campus knowledge network'}
          </span>
        </div>
      </footer>
      {toast ? <div className="toast">{toast}</div> : null}
    </>
  )
}

export default function App() {
  const { user, ready } = useAnsh()
  if (!ready) return <Boot />
  if (!user) return <Gate />
  return <Layout />
}

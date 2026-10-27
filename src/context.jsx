import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { initials, isAdmin, roleForAccount, seedDb } from './data'
import { auth, authMessage, firebaseEnabled } from './lib/firebase.js'
import {
  arrayRemove,
  arrayUnion,
    ensureSeed,
  listenCampus,
  patchDoc,
  removeDoc,
  saveDoc,
  saveUser,
} from './lib/cloud.js'
import {
  clearSession,
  createLocalAccount,
  loginLocalAccount,
  publicAccount,
  readSession,
  updateLocalAccount,
} from './lib/localAuth.js'

const KEY_DB = 'skillswap-db-v5'
const AnshContext = createContext(null)

function read(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function withSeed(saved) {
  const seed = seedDb()
  if (!saved) return seed
  const fromSeed = (list, id) => list.find((x) => x.id === id)
  const people = (saved.people || []).map((p) => {
    const s = fromSeed(seed.people, p.id)
    return s
      ? { ...s, ...p, role: p.role || s.role || 'Student', following: p.following || [] }
      : { ...p, role: p.role || 'Student', following: p.following || [] }
  })
  seed.people.forEach((s) => {
    if (!people.find((p) => p.id === s.id)) people.push({ ...s, following: [] })
  })
  return {
    ...seed,
    ...saved,
    people,
    resources: (saved.resources || seed.resources).map((r) => {
      const s = fromSeed(seed.resources, r.id)
      return s ? { ...s, ...r, photo: r.photo || s.photo } : r
    }),
    skills: (saved.skills || seed.skills).map((sk) => {
      const s = fromSeed(seed.skills, sk.id)
      return s ? { ...s, ...sk, photo: sk.photo || s.photo, meetLink: sk.meetLink || s.meetLink } : sk
    }),
    posts: saved.posts?.length ? saved.posts : seed.posts,
  }
}

function emptyDb() {
  return { people: [], posts: [], resources: [], skills: [], inbox: [], bookings: [] }
}

function profileFromForm(id, form) {
  const role = roleForAccount(form.email, form.role)
  return {
    id,
    email: form.email.trim().toLowerCase(),
    name: form.name.trim(),
    branch: role === 'Admin' ? 'Campus office · Admin' : form.branch,
    role,
    bio: (form.bio || '').trim() || 'Sharing knowledge and leftover campus things.',
    enrollment: (form.enrollment || '').trim(),
    karma: 0,
    following: [],
  }
}

export function AnshProvider({ children }) {
  const online = firebaseEnabled
  const [sessionUser, setSessionUser] = useState(null)
  const [db, setDb] = useState(() => (online ? emptyDb() : withSeed(read(KEY_DB))))
  const [ready, setReady] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (online) return
    write(KEY_DB, db)
  }, [db, online])

  function ping(message) {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }

  useEffect(() => {
    if (!online) {
      const acc = publicAccount(readSession())
      if (acc) {
        setSessionUser(acc)
        setDb((prev) => ({
          ...prev,
          people: [acc, ...prev.people.filter((p) => p.id !== acc.id)],
        }))
      }
      setReady(true)
      return undefined
    }

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setSessionUser(null)
        setDb(emptyDb())
        setReady(true)
        return
      }
      setSessionUser((prev) => ({
        id: fbUser.uid,
        email: fbUser.email || '',
        name: prev?.name || fbUser.displayName || (fbUser.email || 'Student').split('@')[0],
        branch: prev?.branch || '',
        role: prev?.role || roleForAccount(fbUser.email, 'Student'),
        bio: prev?.bio || '',
        enrollment: prev?.enrollment || '',
        karma: prev?.karma || 0,
        following: prev?.following || [],
      }))
      try {
        await ensureSeed()
        if (roleForAccount(fbUser.email) === 'Admin') {
          await saveUser(fbUser.uid, {
            email: (fbUser.email || '').toLowerCase(),
            role: 'Admin',
            branch: 'Campus office · Admin',
            name: fbUser.displayName || 'Campus Admin',
          })
        }
      } catch (err) {
        ping(authMessage(err))
      }
      setReady(true)
    })
    return () => unsub()
  }, [online])

  useEffect(() => {
    if (!online || !sessionUser?.id) return undefined
    return listenCampus(setDb)
  }, [online, sessionUser?.id])

  async function signup(form) {
    if (!form.email?.trim() || !form.password) {
      throw new Error('Email and password are required.')
    }
    if (form.password.length < 6) {
      throw new Error('Password must be at least 6 characters.')
    }
    if (form.password !== form.confirm) {
      throw new Error('Passwords do not match.')
    }
    try {
      if (online) {
        const cred = await createUserWithEmailAndPassword(auth, form.email.trim(), form.password)
        const me = profileFromForm(cred.user.uid, form)
        await updateProfile(cred.user, { displayName: me.name })
        await saveUser(me.id, me)
        await ensureSeed()
        setSessionUser(me)
        ping('Account saved on the server.')
        return
      }
      const me = await createLocalAccount(form)
      setSessionUser(me)
      setDb((prev) => ({
        ...prev,
        people: [me, ...prev.people.filter((p) => p.id !== me.id)],
      }))
      ping('Account created. Connect Firebase to save it online.')
    } catch (err) {
      throw new Error(authMessage(err))
    }
  }

  async function login(form) {
    try {
      if (online) {
        await signInWithEmailAndPassword(auth, form.email.trim(), form.password)
        ping('Logged in. Data is on the server.')
        return
      }
      const me = await loginLocalAccount(form.email, form.password)
      setSessionUser(me)
      setDb((prev) => ({
        ...prev,
        people: [me, ...prev.people.filter((p) => p.id !== me.id)],
      }))
      ping('Logged in.')
    } catch (err) {
      throw new Error(authMessage(err))
    }
  }

  async function logout() {
    if (online) await signOut(auth)
    else clearSession()
    setSessionUser(null)
    ping('Logged out.')
  }

  function person(id) {
    return db.people.find((p) => p.id === id)
  }

  async function addPost({ type, text }) {
    const body = (text || '').trim()
    if (!body) return
    const post = {
      id: `po-${Date.now()}`,
      authorId: user.id,
      type: type || 'update',
      text: body,
      createdAt: new Date().toISOString(),
      likes: [],
    }
    if (online) {
      await saveDoc('posts', post)
      ping('Posted to the campus feed.')
      return
    }
    setDb((prev) => ({ ...prev, posts: [post, ...(prev.posts || [])] }))
    ping('Posted to the campus feed.')
  }

  async function toggleLike(postId) {
    const post = db.posts.find((p) => p.id === postId)
    if (!post) return
    const liked = post.likes.includes(user.id)
    if (online) {
      await patchDoc('posts', postId, {
        likes: liked ? arrayRemove(user.id) : arrayUnion(user.id),
      })
      return
    }
    setDb((prev) => ({
      ...prev,
      posts: prev.posts.map((p) => {
        if (p.id !== postId) return p
        return {
          ...p,
          likes: liked ? p.likes.filter((id) => id !== user.id) : [...p.likes, user.id],
        }
      }),
    }))
  }

  async function toggleFollow(personId) {
    if (!personId || personId === user.id) return
    const following = user.following || []
    const isFollowing = following.includes(personId)
    const next = isFollowing ? following.filter((id) => id !== personId) : [...following, personId]
    if (online) {
      await patchDoc('users', user.id, {
        following: isFollowing ? arrayRemove(personId) : arrayUnion(personId),
      })
      setSessionUser((u) => ({ ...u, following: next }))
      ping(isFollowing ? 'Unfollowed.' : 'Following.')
      return
    }
    setSessionUser((u) => ({ ...u, following: next }))
    updateLocalAccount(user.id, { following: next })
    setDb((prev) => ({
      ...prev,
      people: prev.people.map((p) => (p.id === user.id ? { ...p, following: next } : p)),
    }))
    ping(isFollowing ? 'Unfollowed.' : 'Following.')
  }

  async function sendMessage(toId, text) {
    const body = (text || '').trim()
    if (!toId || toId === user.id || !body) return
    const other = person(toId)
    const row = {
      id: `in-${Date.now()}`,
      type: 'message',
      listingId: toId,
      title: `Message to ${other?.name || 'classmate'}`,
      from: user.id,
      to: toId,
      status: 'Sent',
      message: body,
      createdAt: new Date().toISOString(),
    }
    if (online) {
      await saveDoc('inbox', row)
      ping('Message sent.')
      return
    }
    setDb((prev) => ({ ...prev, inbox: [row, ...prev.inbox] }))
    ping('Message sent.')
  }

  async function requestResource(id, message) {
    const item = db.resources.find((r) => r.id === id)
    if (!item || item.status !== 'Available') return
    const row = {
      id: `in-${Date.now()}`,
      type: 'resource',
      listingId: id,
      title: item.title,
      from: user.id,
      to: item.ownerId,
      status: 'Waiting',
      message: message || 'I would like this item. It is listed as free.',
      createdAt: new Date().toISOString(),
    }
    if (online) {
      await patchDoc('resources', id, { status: 'Requested', requestedBy: user.id })
      await saveDoc('inbox', row)
      ping('Request sent.')
      return
    }
    setDb((prev) => ({
      ...prev,
      resources: prev.resources.map((r) =>
        r.id === id ? { ...r, status: 'Requested', requestedBy: user.id } : r,
      ),
      inbox: [row, ...prev.inbox],
    }))
    ping('Request sent.')
  }

  async function joinSession(skillId, slotId) {
    const skill = db.skills.find((s) => s.id === skillId)
    const slot = skill?.slots.find((s) => s.id === slotId) || skill?.slots[0]
    if (!skill) return
    const booking = {
      id: `bk-${Date.now()}`,
      skillId,
      slotId: slot?.id,
      title: skill.title,
      when: slot?.label || 'Live',
      meetLink: skill.meetLink,
      from: user.id,
      to: skill.mentorId,
      createdAt: new Date().toISOString(),
    }
    const row = {
      id: `in-${Date.now()}`,
      type: 'skill',
      listingId: skillId,
      title: skill.title,
      from: user.id,
      to: skill.mentorId,
      status: 'Joined',
      message: `${slot?.label || 'Online'} · Google Meet`,
      createdAt: new Date().toISOString(),
    }
    if (online) {
      await saveDoc('bookings', booking)
      await saveDoc('inbox', row)
    } else {
      setDb((prev) => ({
        ...prev,
        bookings: [booking, ...prev.bookings],
        inbox: [row, ...prev.inbox],
      }))
    }
    ping('Session is free. Opening Google Meet…')
    if (skill.meetLink) window.open(skill.meetLink, '_blank', 'noopener,noreferrer')
  }

  async function addResource(payload) {
    const item = {
      id: `r-${Date.now()}`,
      status: 'Available',
      ownerId: user.id,
      ...payload,
    }
    const post = {
      id: `po-${Date.now()}`,
      authorId: user.id,
      type: 'need',
      text: `Listed a free item: ${item.title}. Anyone on campus can request it.`,
      createdAt: new Date().toISOString(),
      likes: [],
    }
    const karma = (user.karma || 0) + 1
    if (online) {
      await saveDoc('resources', item)
      await saveDoc('posts', post)
      await patchDoc('users', user.id, { karma })
      setSessionUser((u) => ({ ...u, karma }))
      ping('Item listed. It is free.')
      return item.id
    }
    setDb((prev) => ({
      ...prev,
      resources: [item, ...prev.resources],
      posts: [post, ...(prev.posts || [])],
      people: prev.people.map((p) => (p.id === user.id ? { ...p, karma } : p)),
    }))
    setSessionUser((u) => ({ ...u, karma }))
    updateLocalAccount(user.id, { karma })
    ping('Item listed. It is free.')
    return item.id
  }

  async function addSkill(payload) {
    const item = {
      id: `s-${Date.now()}`,
      mentorId: user.id,
      slots: [
        {
          id: `sl-${Date.now()}`,
          label: payload.when,
        },
      ],
      bullets: payload.bullets
        .split('\n')
        .map((b) => b.trim())
        .filter(Boolean),
      title: payload.title,
      category: payload.category,
      cover: payload.cover,
      meetLink: payload.meetLink.trim(),
      photo: payload.photo || '',
    }
    const post = {
      id: `po-${Date.now()}`,
      authorId: user.id,
      type: 'knowledge',
      text: `Hosting a free Meet session: ${item.title}. Join from Knowledge — no fee.`,
      createdAt: new Date().toISOString(),
      likes: [],
    }
    if (online) {
      await saveDoc('skills', item)
      await saveDoc('posts', post)
      ping('Knowledge session listed. Free to attend on Meet.')
      return item.id
    }
    setDb((prev) => ({
      ...prev,
      skills: [item, ...prev.skills],
      posts: [post, ...(prev.posts || [])],
    }))
    ping('Knowledge session listed. Free to attend on Meet.')
    return item.id
  }

  async function removePost(id) {
    if (!id) return
    const post = db.posts.find((p) => p.id === id)
    if (!post) return
    if (!isAdmin(user) && post.authorId !== user.id) return
    if (online) {
      await removeDoc('posts', id)
      ping('Post removed.')
      return
    }
    setDb((prev) => ({ ...prev, posts: prev.posts.filter((p) => p.id !== id) }))
    ping('Post removed.')
  }

  async function removeResource(id) {
    if (!id) return
    const item = db.resources.find((r) => r.id === id)
    if (!item) return
    if (!isAdmin(user) && item.ownerId !== user.id) return
    if (online) {
      await removeDoc('resources', id)
      ping('Item listing removed.')
      return
    }
    setDb((prev) => ({ ...prev, resources: prev.resources.filter((r) => r.id !== id) }))
    ping('Item listing removed.')
  }

  async function removeSkill(id) {
    if (!id) return
    const item = db.skills.find((s) => s.id === id)
    if (!item) return
    if (!isAdmin(user) && item.mentorId !== user.id) return
    if (online) {
      await removeDoc('skills', id)
      ping('Session removed.')
      return
    }
    setDb((prev) => ({ ...prev, skills: prev.skills.filter((s) => s.id !== id) }))
    ping('Session removed.')
  }

  function resetDemo() {
    if (online) {
      ping('Live campus data is on the server. It is not reset from here.')
      return
    }
    const next = seedDb()
    localStorage.removeItem(KEY_DB)
    if (sessionUser) {
      const me = { ...sessionUser, karma: 0, following: [] }
      updateLocalAccount(me.id, { karma: 0, following: [] })
      setSessionUser(me)
      setDb({ ...next, people: [me, ...next.people] })
    } else {
      setDb(next)
    }
    ping('Demo data reset.')
  }

  const user = db.people.find((p) => p.id === sessionUser?.id) || sessionUser

  const value = useMemo(
    () => ({
      user,
      db,
      toast,
      ready,
      online,
      signup,
      login,
      logout,
      person,
      addPost,
      toggleLike,
      toggleFollow,
      sendMessage,
      requestResource,
      joinSession,
      addResource,
      addSkill,
      removePost,
      removeResource,
      removeSkill,
      resetDemo,
      ping,
      initials,
      admin: isAdmin(user),
    }),
    [user, db, toast, ready, online],
  )

  return <AnshContext.Provider value={value}>{children}</AnshContext.Provider>
}

export function useAnsh() {
  const ctx = useContext(AnshContext)
  if (!ctx) throw new Error('useAnsh must be inside provider')
  return ctx
}

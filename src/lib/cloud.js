import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { seedDb } from '../data.js'
import { firestore } from './firebase.js'

function payload(row) {
  const { id, ...rest } = row
  return JSON.parse(JSON.stringify({ ...rest, id }))
}

export async function ensureSeed() {
  const marker = doc(firestore, 'meta', 'seed')
  const snap = await getDoc(marker)
  if (snap.exists()) return
  const seed = seedDb()
  const batch = writeBatch(firestore)
  seed.people.forEach((p) => {
    batch.set(doc(firestore, 'users', p.id), payload({ ...p, following: p.following || [] }))
  })
  seed.posts.forEach((p) => batch.set(doc(firestore, 'posts', p.id), payload(p)))
  seed.resources.forEach((r) => batch.set(doc(firestore, 'resources', r.id), payload(r)))
  seed.skills.forEach((s) => batch.set(doc(firestore, 'skills', s.id), payload(s)))
  batch.set(marker, { createdAt: new Date().toISOString() })
  await batch.commit()
}

export function listenCampus(onData) {
  const state = {
    people: [],
    posts: [],
    resources: [],
    skills: [],
    inbox: [],
    bookings: [],
  }
  const map = [
    ['users', 'people'],
    ['posts', 'posts'],
    ['resources', 'resources'],
    ['skills', 'skills'],
    ['inbox', 'inbox'],
    ['bookings', 'bookings'],
  ]
  const unsubs = map.map(([col, key]) =>
    onSnapshot(collection(firestore, col), (snap) => {
      state[key] = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      onData({
        people: state.people,
        posts: state.posts,
        resources: state.resources,
        skills: state.skills,
        inbox: state.inbox,
        bookings: state.bookings,
      })
    }),
  )
  return () => unsubs.forEach((u) => u())
}

export async function saveUser(id, data) {
  await setDoc(doc(firestore, 'users', id), payload({ id, ...data }), { merge: true })
}

export async function saveDoc(col, row) {
  await setDoc(doc(firestore, col, row.id), payload(row), { merge: true })
}

export async function patchDoc(col, id, data) {
  await updateDoc(doc(firestore, col, id), data)
}

export async function removeDoc(col, id) {
  await deleteDoc(doc(firestore, col, id))
}

export { arrayRemove, arrayUnion }

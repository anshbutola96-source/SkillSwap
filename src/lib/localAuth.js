import { roleForAccount } from '../data.js'

const KEY_ACCOUNTS = 'skillswap-accounts-v1'
const KEY_SESSION = 'skillswap-session-v1'

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

async function hashPassword(email, password) {
  const bytes = new TextEncoder().encode(`${email.toLowerCase().trim()}::${password}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function readAccounts() {
  return read(KEY_ACCOUNTS) || []
}

export function readSession() {
  return read(KEY_SESSION)
}

export function clearSession() {
  localStorage.removeItem(KEY_SESSION)
}

export async function createLocalAccount(profile) {
  const email = profile.email.trim().toLowerCase()
  const accounts = readAccounts()
  if (accounts.some((a) => a.email === email)) {
    const err = new Error('That email already has an account. Log in instead.')
    err.code = 'auth/email-already-in-use'
    throw err
  }
  const id = `u-${Date.now()}`
  const role = roleForAccount(email, profile.role)
  const account = {
    id,
    email,
    passHash: await hashPassword(email, profile.password),
    name: profile.name.trim(),
    branch: role === 'Admin' ? 'Campus office · Admin' : profile.branch,
    role,
    bio: profile.bio.trim() || 'Sharing knowledge and leftover campus things.',
    enrollment: (profile.enrollment || '').trim(),
    karma: 0,
    following: [],
  }
  write(KEY_ACCOUNTS, [...accounts, account])
  write(KEY_SESSION, id)
  const { passHash, ...publicProfile } = account
  return publicProfile
}

export async function loginLocalAccount(email, password) {
  const normalized = email.trim().toLowerCase()
  const account = readAccounts().find((a) => a.email === normalized)
  if (!account) {
    const err = new Error('Email or password is wrong.')
    err.code = 'auth/invalid-credential'
    throw err
  }
  const hash = await hashPassword(normalized, password)
  if (hash !== account.passHash) {
    const err = new Error('Email or password is wrong.')
    err.code = 'auth/invalid-credential'
    throw err
  }
  write(KEY_SESSION, account.id)
  const { passHash, ...publicProfile } = account
  return publicProfile
}

export function publicAccount(id) {
  const account = readAccounts().find((a) => a.id === id)
  if (!account) return null
  const { passHash, ...publicProfile } = account
  return publicProfile
}

export function updateLocalAccount(id, patch) {
  const accounts = readAccounts().map((a) => (a.id === id ? { ...a, ...patch } : a))
  write(KEY_ACCOUNTS, accounts)
  const next = accounts.find((a) => a.id === id)
  if (!next) return null
  const { passHash, ...publicProfile } = next
  return publicProfile
}

export const RESOURCE_CATEGORIES = [
  'Textbooks',
  'Notes',
  'Lab & drawing',
  'Electronics',
  'Stationery',
  'Gadgets',
]

export const SKILL_CATEGORIES = [
  'Coding',
  'Data',
  'Design',
  'Academics',
  'Career',
  'Languages',
]

export const ROLES = ['Student', 'Teacher']

export const ADMIN_EMAIL = 'admin@vips.edu'

export function isAdmin(user) {
  if (!user) return false
  if (user.role === 'Admin') return true
  return (user.email || '').toLowerCase().trim() === ADMIN_EMAIL
}

export function roleForAccount(email, chosen = 'Student') {
  if ((email || '').toLowerCase().trim() === ADMIN_EMAIL) return 'Admin'
  return chosen === 'Admin' ? 'Student' : chosen || 'Student'
}

export const BRANCHES = [
  'B.Tech AIDS-B · 1st sem',
  'B.Tech CSE · 1st sem',
  'B.Tech AIDS · 2nd sem',
  'B.Tech CSE · 2nd sem',
  'Faculty · CSE',
  'Faculty · AIDS',
  'Other VIPS programme',
]

export const people = [
  {
    id: 'p1',
    name: 'Raghav Singh',
    branch: 'B.Tech ECE · 3rd sem',
    role: 'Student',
    bio: 'EG is over. A drafter should not retire in a drawer.',
    karma: 4,
  },
  {
    id: 'p2',
    name: 'Diya Kapoor',
    branch: 'B.Tech AIDS-B · 1st sem',
    role: 'Student',
    bio: 'Good at making ugly slides look like a faculty expects them.',
    karma: 2,
  },
  {
    id: 'p3',
    name: 'Arjun Mehta',
    branch: 'B.Tech CSE · 2nd sem',
    role: 'Student',
    bio: 'Will sit with you until git push actually works.',
    karma: 6,
  },
  {
    id: 'p4',
    name: 'Sana Qureshi',
    branch: 'B.Tech AIDS-B · 1st sem',
    role: 'Student',
    bio: 'Pandas, charts, and not crying at CSV files.',
    karma: 3,
  },
  {
    id: 'p5',
    name: 'Meher Gill',
    branch: 'B.Tech CSE · 1st sem',
    role: 'Student',
    bio: 'Viva voice. I was terrified last semester. I can help.',
    karma: 1,
  },
  {
    id: 'p6',
    name: 'Kabir Anand',
    branch: 'B.Tech AIDS · 2nd sem',
    role: 'Student',
    bio: 'Handwritten notes. No coaching-module watermarks.',
    karma: 5,
  },
  {
    id: 't1',
    name: 'Dr. Neha Sharma',
    branch: 'Faculty · AIDS',
    role: 'Teacher',
    bio: 'Data lab. Ask here before you panic in WhatsApp.',
    karma: 12,
  },
  {
    id: 't2',
    name: 'Prof. Vikram Sethi',
    branch: 'Faculty · CSE',
    role: 'Teacher',
    bio: 'Programming fundamentals. Extra Meet hours on weekends.',
    karma: 9,
  },
]

export const POST_TYPES = [
  { id: 'knowledge', label: 'Share knowledge' },
  { id: 'need', label: 'Need something' },
  { id: 'update', label: 'Campus update' },
]

export const posts = [
  {
    id: 'po1',
    authorId: 't1',
    type: 'knowledge',
    text: 'AIDS-B: bring any CSV to Saturday’s extra class. We will make one chart you can actually defend in viva. Meet is free — link is on the Knowledge tab.',
    createdAt: '2026-10-27T08:10:00.000Z',
    likes: ['p4', 'p2', 'p6'],
  },
  {
    id: 'po2',
    authorId: 'p1',
    type: 'need',
    text: 'Giving away my mini-drafter. EG is over. If a first-year still needs one, request the item — it is free. Photo is on the listing.',
    createdAt: '2026-10-27T07:40:00.000Z',
    likes: ['p5', 't2'],
  },
  {
    id: 'po3',
    authorId: 'p3',
    type: 'knowledge',
    text: 'Hosting a 25-min GitHub session today 6 PM. Free Google Meet. If your project form needs a repo URL, come. No credits.',
    createdAt: '2026-10-26T18:05:00.000Z',
    likes: ['p2', 'p6', 't2', 'p4'],
  },
  {
    id: 'po4',
    authorId: 't2',
    type: 'update',
    text: 'CSE 1st sem: do not buy a new Let Us C if a senior is already giving one away on SkillSwap. Ask here first.',
    createdAt: '2026-10-26T11:20:00.000Z',
    likes: ['p3', 'p1'],
  },
]

export const resources = [
  {
    id: 'r1',
    title: 'Mini-drafter + set squares',
    category: 'Lab & drawing',
    condition: 'Used one semester',
    ownerId: 'p1',
    status: 'Available',
    photo: '/photos/drafter.jpg',
    story:
      'Engineering Graphics is done. Joints are tight, scale has a little ink. Do not spend ₹400 on a new one for a subject that lasts one sem.',
  },
  {
    id: 'r2',
    title: 'Let Us C — Yashavant Kanetkar',
    category: 'Textbooks',
    condition: 'Like new',
    ownerId: 'p3',
    status: 'Available',
    photo: '/photos/textbook.jpg',
    story:
      'Bought in August, coded from PDFs anyway. Highlighted chapter 1–4 only. Free if you actually want to read it.',
  },
  {
    id: 'r3',
    title: 'Casio fx-991EX ClassWiz',
    category: 'Gadgets',
    condition: 'Used a semester',
    ownerId: 'p4',
    status: 'Available',
    photo: '/photos/calculator.jpg',
    story:
      'Works. Menu in English. I moved to a laptop for labs. First-years still get asked to bring this to mid-terms.',
  },
  {
    id: 'r4',
    title: 'Discrete Maths handwritten notes (units 1–4)',
    category: 'Notes',
    condition: 'Photocopy-ready',
    ownerId: 'p6',
    status: 'Available',
    photo: '/photos/notes.jpg',
    story:
      'Written for IPU-style questions, not coaching dumps. You can photograph them in 10 minutes. I keep the original.',
  },
  {
    id: 'r5',
    title: 'White lab coat · size M',
    category: 'Lab & drawing',
    condition: 'Worn but clean',
    ownerId: 'p1',
    status: 'Available',
    photo: '/photos/labcoat.jpg',
    story:
      'Mandatory, overpriced in the market outside gate. Washed. Name mark on the collar — take a marker to it.',
  },
  {
    id: 'r6',
    title: 'Arduino Uno + jumper wires',
    category: 'Electronics',
    condition: 'Workshop leftover',
    ownerId: 'p2',
    status: 'Available',
    photo: '/photos/arduino.jpg',
    story:
      'From a one-day IoT workshop. Board is fine. Sitting in a box while someone else is buying the same kit for a mini-project.',
  },
  {
    id: 'r7',
    title: 'Graph notebooks × 3, unused',
    category: 'Stationery',
    condition: 'Unused',
    ownerId: 'p5',
    status: 'Available',
    photo: '/photos/notebooks.jpg',
    story:
      'Bookshop combo. EG needed one. Two are still wrapped. Take both.',
  },
  {
    id: 'r8',
    title: 'Python notes — loops to pandas (AIDS)',
    category: 'Notes',
    condition: 'Google Doc + printout',
    ownerId: 'p4',
    status: 'Available',
    photo: '/photos/python-notes.jpg',
    story:
      'What I wish I had in week 2. No 400-page textbook. Just what the lab actually asks.',
  },
]

export const skills = [
  {
    id: 's1',
    title: 'Your first GitHub repo in 25 minutes',
    category: 'Coding',
    mentorId: 'p3',
    photo: '/photos/coding.jpg',
    meetLink: 'https://meet.google.com/vps-git-repo',
    cover:
      'init, commit, README, public link. The project form asks for a GitHub URL. Leave with one that opens on a phone.',
    bullets: ['GitHub account + repo', 'Push from VS Code or CLI', 'README that a faculty will actually read'],
    slots: [
      { id: 's1a', label: 'Today · 6:00 PM' },
      { id: 's1b', label: 'Tomorrow · 1:10 PM' },
    ],
  },
  {
    id: 's2',
    title: 'Faculty PPT that does not look like Canva vomit',
    category: 'Design',
    mentorId: 'p2',
    photo: '/photos/ppt.jpg',
    meetLink: 'https://meet.google.com/vps-ppt-help',
    cover:
      'One title system, real screenshots, no stock-handshake photos. Built for the 1st-sem project presentation slot.',
    bullets: ['Structure: problem → method → demo', 'Type and colour that print well', 'Export to Drive / Slides link'],
    slots: [
      { id: 's2a', label: 'Tomorrow · 5:30 PM' },
      { id: 's2b', label: 'Saturday · 11:00 AM' },
    ],
  },
  {
    id: 's3',
    title: 'Pandas: CSV to a chart you can defend',
    category: 'Data',
    mentorId: 'p4',
    photo: '/photos/data.jpg',
    meetLink: 'https://meet.google.com/vps-csv-plot',
    cover:
      'AIDS lab panic, compressed. You bring any CSV. We make one honest chart and you explain it.',
    bullets: ['read_csv without fear', 'One clean plot', 'What to say when they ask “why this graph”'],
    slots: [
      { id: 's3a', label: 'Today · 4:45 PM' },
      { id: 's3b', label: 'Thursday · 3:00 PM' },
    ],
  },
  {
    id: 's4',
    title: 'Viva in English without freezing',
    category: 'Languages',
    mentorId: 'p5',
    photo: '/photos/viva.jpg',
    meetLink: 'https://meet.google.com/vps-viva-eng',
    cover:
      'Not grammar class. 25 minutes of answering “explain your project” out loud, badly, then better.',
    bullets: ['30-second project pitch', 'What to do when you forget a word', 'Two questions faculty always ask'],
    slots: [{ id: 's4a', label: 'Friday · 6:15 PM' }],
  },
  {
    id: 's5',
    title: 'Record the 3-minute project video on a phone',
    category: 'Career',
    mentorId: 'p3',
    photo: '/photos/video.jpg',
    meetLink: 'https://meet.google.com/vps-rec-vid',
    cover:
      'The submission form wants a video link. Script, screen record, YouTube unlisted. No editing degree.',
    bullets: ['90-second script', 'Screen + voice on Android/iPhone', 'Unlisted YouTube / Drive setting'],
    slots: [
      { id: 's5a', label: 'Tomorrow · 4:00 PM' },
      { id: 's5b', label: 'Sunday · 12:00 PM' },
    ],
  },
  {
    id: 's6',
    title: 'HTML/CSS landing page — no tutorial tab-hopping',
    category: 'Coding',
    mentorId: 'p6',
    photo: '/photos/web.jpg',
    meetLink: 'https://meet.google.com/vps-html-css',
    cover:
      'One page, live on GitHub Pages by the end of the slot if you already have the repo from Arjun.',
    bullets: ['Semantic layout', 'CSS that is not Bootstrap soup', 'Deploy checklist'],
    slots: [{ id: 's6a', label: 'Saturday · 2:00 PM' }],
  },
]

export function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

export function timeAgo(iso) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 2) return 'just now'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}

export function seedDb() {
  return {
    people: people.map((p) => ({ ...p })),
    resources: resources.map((r) => ({ ...r })),
    skills: skills.map((s) => ({
      ...s,
      slots: s.slots.map((sl) => ({ ...sl })),
    })),
    inbox: [],
    bookings: [],
    posts: posts.map((p) => ({
      ...p,
      likes: [...p.likes],
    })),
  }
}

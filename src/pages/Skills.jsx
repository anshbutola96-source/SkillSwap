import { useMemo, useState } from 'react'
import { useAnsh } from '../context.jsx'
import { SKILL_CATEGORIES } from '../data.js'
import { SkillCard } from '../components/Cards.jsx'

export default function Skills() {
  const { db, person } = useAnsh()
  const [cat, setCat] = useState('All')

  const list = useMemo(() => {
    return db.skills.filter((s) => (cat === 'All' ? true : s.category === cat))
  }, [db.skills, cat])

  return (
    <main className="shell page">
      <h1>Knowledge sessions</h1>
      <p className="muted">
        25 minutes, free, online. Join on Google Meet — no credits, no fee.
      </p>
      <div className="filters">
        <button type="button" className={cat === 'All' ? 'on' : ''} onClick={() => setCat('All')}>
          All
        </button>
        {SKILL_CATEGORIES.map((c) => (
          <button type="button" key={c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="board">
        {list.map((item) => (
          <SkillCard key={item.id} item={item} mentor={person(item.mentorId)} />
        ))}
      </div>
    </main>
  )
}

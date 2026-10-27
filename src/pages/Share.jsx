import { useMemo, useState } from 'react'
import { useAnsh } from '../context.jsx'
import { RESOURCE_CATEGORIES } from '../data.js'
import { ItemCard } from '../components/Cards.jsx'

export default function Share() {
  const { db, person } = useAnsh()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')

  const list = useMemo(() => {
    return db.resources
      .filter((r) => (cat === 'All' ? true : r.category === cat))
      .filter((r) => `${r.title} ${r.story}`.toLowerCase().includes(q.toLowerCase()))
  }, [db.resources, q, cat])

  return (
    <main className="shell page">
      <h1>Items</h1>
      <p className="muted">Free leftover books, kits and notes. Upload a photo of the object when you list it.</p>
      <div style={{ marginTop: 16 }}>
        <input
          className="search"
          placeholder="Search drafter, notes, Arduino…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="filters">
        <button type="button" className={cat === 'All' ? 'on' : ''} onClick={() => setCat('All')}>
          All
        </button>
        {RESOURCE_CATEGORIES.map((c) => (
          <button type="button" key={c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <div className="empty">No items match that filter.</div>
      ) : (
        <div className="board">
          {list.map((item) => (
            <ItemCard key={item.id} item={item} owner={person(item.ownerId)} />
          ))}
        </div>
      )}
    </main>
  )
}

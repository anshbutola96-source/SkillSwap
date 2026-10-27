import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAnsh } from '../context.jsx'
import { RESOURCE_CATEGORIES, SKILL_CATEGORIES } from '../data.js'

function readImage(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve('')
      return
    }
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please choose an image file.'))
      return
    }
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const max = 900
      const scale = Math.min(1, max / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(img.width * scale))
      canvas.height = Math.max(1, Math.round(img.height * scale))
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.82))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read that image.'))
    }
    img.src = url
  })
}

export default function Post() {
  const { addResource, addSkill, ping } = useAnsh()
  const navigate = useNavigate()
  const [tab, setTab] = useState('resource')
  const [resource, setResource] = useState({
    title: '',
    category: RESOURCE_CATEGORIES[0],
    condition: 'Used a semester',
    story: '',
    photo: '',
  })
  const [skill, setSkill] = useState({
    title: '',
    category: SKILL_CATEGORIES[0],
    cover: '',
    bullets: '',
    when: 'Tomorrow · 5:00 PM',
    meetLink: '',
  })

  async function onItemPhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const photo = await readImage(file)
      setResource((r) => ({ ...r, photo }))
    } catch (err) {
      ping(err.message)
    }
  }

  function submitResource(e) {
    e.preventDefault()
    const id = addResource(resource)
    navigate(`/share/${id}`)
  }

  function submitSkill(e) {
    e.preventDefault()
    const id = addSkill(skill)
    navigate(`/skills/${id}`)
  }

  return (
    <main className="shell page">
      <h1>Create a listing</h1>
      <p className="muted">Items and knowledge sessions are free. Upload a photo of the object. Sessions join on Google Meet.</p>
      <div className="tabs">
        <button type="button" className={tab === 'resource' ? 'on' : ''} onClick={() => setTab('resource')}>
          Item
        </button>
        <button type="button" className={tab === 'skill' ? 'on' : ''} onClick={() => setTab('skill')}>
          Knowledge session
        </button>
      </div>

      {tab === 'resource' ? (
        <form className="form panel" onSubmit={submitResource}>
          <label>
            Title
            <input
              required
              value={resource.title}
              onChange={(e) => setResource({ ...resource, title: e.target.value })}
              placeholder="Mini-drafter, lab coat, Let Us C…"
            />
          </label>
          <label>
            Photo of the item
            <input type="file" accept="image/*" onChange={onItemPhoto} />
          </label>
          {resource.photo ? (
            <img className="upload-preview" src={resource.photo} alt="Preview" />
          ) : (
            <p className="muted">Upload your own picture of the tool or object.</p>
          )}
          <label>
            Category
            <select
              value={resource.category}
              onChange={(e) => setResource({ ...resource, category: e.target.value })}
            >
              {RESOURCE_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Condition
            <select
              value={resource.condition}
              onChange={(e) => setResource({ ...resource, condition: e.target.value })}
            >
              <option>Unused</option>
              <option>Like new</option>
              <option>Used a semester</option>
              <option>Worn but working</option>
              <option>Photocopy-ready</option>
            </select>
          </label>
          <label>
            Description
            <textarea
              required
              value={resource.story}
              onChange={(e) => setResource({ ...resource, story: e.target.value })}
              placeholder="EG is over. Don't buy a new one."
            />
          </label>
          <button className="btn" type="submit">
            Publish free item
          </button>
        </form>
      ) : (
        <form className="form panel" onSubmit={submitSkill}>
          <label>
            Title
            <input
              required
              value={skill.title}
              onChange={(e) => setSkill({ ...skill, title: e.target.value })}
              placeholder="First GitHub repo, viva pitch, Pandas chart…"
            />
          </label>
          <label>
            Category
            <select
              value={skill.category}
              onChange={(e) => setSkill({ ...skill, category: e.target.value })}
            >
              {SKILL_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Description
            <textarea
              required
              value={skill.cover}
              onChange={(e) => setSkill({ ...skill, cover: e.target.value })}
              placeholder="What they will learn in 25 minutes."
            />
          </label>
          <label>
            What you will cover (one point per line)
            <textarea
              required
              value={skill.bullets}
              onChange={(e) => setSkill({ ...skill, bullets: e.target.value })}
              placeholder={'Account + repo\nFirst push\nREADME faculty will read'}
            />
          </label>
          <label>
            When
            <input
              required
              value={skill.when}
              onChange={(e) => setSkill({ ...skill, when: e.target.value })}
            />
          </label>
          <label>
            Google Meet link
            <input
              required
              type="url"
              value={skill.meetLink}
              onChange={(e) => setSkill({ ...skill, meetLink: e.target.value })}
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
            />
          </label>
          <p className="muted">Anyone can join this session for free on the Meet link.</p>
          <button className="btn" type="submit">
            Publish free session
          </button>
        </form>
      )}
    </main>
  )
}

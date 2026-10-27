import { Link } from 'react-router-dom'
import {
  BarChart3,
  BookOpen,
  Briefcase,
  Clock,
  Code2,
  Cpu,
  FileText,
  GraduationCap,
  Languages,
  Palette,
  PenLine,
  PencilRuler,
  ThumbsUp,
  Trash2,
  Video,
  Watch,
} from 'lucide-react'
import { initials, isAdmin, timeAgo } from '../data.js'
import { useAnsh } from '../context.jsx'

const ICONS = {
  Textbooks: BookOpen,
  Notes: FileText,
  'Lab & drawing': PencilRuler,
  Electronics: Cpu,
  Stationery: PenLine,
  Gadgets: Watch,
  Coding: Code2,
  Data: BarChart3,
  Design: Palette,
  Academics: GraduationCap,
  Career: Briefcase,
  Languages: Languages,
}

export function ItemCard({ item, owner }) {
  const Icon = ICONS[item.category] || BookOpen
  const taken = item.status !== 'Available'
  return (
    <Link className="card" to={`/share/${item.id}`}>
      <div className="thumb" data-cat={item.category}>
        {item.photo ? (
          <img className="thumb-img" src={item.photo} alt={item.title} />
        ) : (
          <Icon size={36} strokeWidth={1.75} />
        )}
        <span className={`badge ${taken ? 'warn' : ''}`}>{taken ? item.status : 'Free'}</span>
      </div>
      <div className="card-body">
        <h3>{item.title}</h3>
        <p className="meta">{item.condition}</p>
        <div className="card-foot">
          <span>{item.category}</span>
          <span className="avatar">{initials(owner?.name || '?')}</span>
        </div>
      </div>
    </Link>
  )
}

export function SkillCard({ item, mentor }) {
  const Icon = ICONS[item.category] || Code2
  return (
    <Link className="card" to={`/skills/${item.id}`}>
      <div className="thumb" data-cat={item.category}>
        {item.photo ? (
          <img className="thumb-img" src={item.photo} alt={item.title} />
        ) : (
          <Icon size={36} strokeWidth={1.75} />
        )}
        <span className="badge">Free · Online</span>
      </div>
      <div className="card-body">
        <h3>{item.title}</h3>
        <p className="meta">
          <Clock size={13} /> 25 min · <Video size={13} /> Google Meet
        </p>
        <div className="card-foot">
          <span>{mentor?.name}</span>
          <span className={`avatar ${mentor?.role === 'Teacher' ? 'teacher' : ''}`}>
            {initials(mentor?.name || '?')}
          </span>
        </div>
      </div>
    </Link>
  )
}

export function RoleBadge({ role }) {
  if (role === 'Admin') return <span className="role-badge admin">Admin</span>
  if (role === 'Teacher') return <span className="role-badge teacher">Teacher</span>
  return <span className="role-badge student">Student</span>
}

const TYPE_LABEL = {
  knowledge: 'Knowledge',
  need: 'Need',
  update: 'Update',
}

export function FeedPost({ post }) {
  const { person, user, toggleLike, removePost } = useAnsh()
  const author = person(post.authorId)
  const liked = post.likes.includes(user.id)
  const canRemove = isAdmin(user) || post.authorId === user.id

  return (
    <article className="post">
      <div className="post-head">
        <Link to={`/u/${author?.id || ''}`} className="person">
          <span className={`avatar ${author?.role === 'Teacher' ? 'teacher' : author?.role === 'Admin' ? 'admin' : ''}`}>
            {initials(author?.name || '?')}
          </span>
          <div>
            <div className="post-name">
              <strong>{author?.name}</strong>
              <RoleBadge role={author?.role} />
            </div>
            <div className="meta">
              {author?.branch} · {timeAgo(post.createdAt)}
            </div>
          </div>
        </Link>
        <span className="chip">{TYPE_LABEL[post.type] || 'Update'}</span>
      </div>
      <p className="post-text">{post.text}</p>
      <div className="post-actions">
        <button className={liked ? 'on' : ''} type="button" onClick={() => toggleLike(post.id)}>
          <ThumbsUp size={16} /> Helpful{post.likes.length ? ` ${post.likes.length}` : ''}
        </button>
        {canRemove ? (
          <button
            className="danger"
            type="button"
            onClick={() => {
              if (window.confirm('Remove this post from the campus feed?')) removePost(post.id)
            }}
          >
            <Trash2 size={16} /> {isAdmin(user) && post.authorId !== user.id ? 'Remove' : 'Delete'}
          </button>
        ) : null}
      </div>
    </article>
  )
}

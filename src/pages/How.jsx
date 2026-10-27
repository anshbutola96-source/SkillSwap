import { Link } from 'react-router-dom'

export default function How() {
  return (
    <main className="shell page">
      <h1>Why this exists</h1>
      <p className="muted" style={{ maxWidth: '40rem' }}>
        First-year students buy a drafter, textbooks, a calculator and a lab coat in August. By
        November the subject is over and the same objects sit unused. Seniors leave with notes on
        a pen drive. WhatsApp groups cannot be searched, and files expire.
      </p>
      <p className="muted" style={{ maxWidth: '40rem', marginTop: 12 }}>
        Help is also stuck. A teacher already posted the lab format. A classmate already knows
        GitHub. There is no campus place that feels like a knowledge network — a feed where
        students and teachers can share leftover things and free Meet hours without turning it
        into a paid course.
      </p>

      <div className="how-grid">
        <article>
          <h3>Campus feed</h3>
          <p>
            Log in with email. Post knowledge, a need, or an update. Follow classmates and faculty.
            There are no public comments — Inbox is for a direct message if you need to ask.
          </p>
        </article>
        <article>
          <h3>Items are free</h3>
          <p>
            List leftover kits and notes with your own photo. Anyone on campus can request them.
            Listing also appears on the feed. Request the item or message the owner in Inbox.
          </p>
        </article>
        <article>
          <h3>Sessions are free and online</h3>
          <p>
            Knowledge sessions join on a Google Meet link. No credits, no UPI. Click Join Meet
            and attend.
          </p>
        </article>
      </div>

      <section className="panel" style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: 8 }}>What it is not</h2>
        <p className="muted">
          Not OLX. Not a paid mentorship app. Not Facebook. SkillSwap is a VIPS knowledge
          network: leftover objects, free Meet hours, and a feed of notices. There are no
          public comment threads. A campus admin can take down a post, item, or session.
        </p>
        <div className="hero-actions">
          <Link className="btn" to="/">
            Open feed
          </Link>
          <Link className="btn ghost" to="/network">
            People
          </Link>
        </div>
      </section>
    </main>
  )
}

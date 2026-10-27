# SkillSwap

**Hyperlocal Campus Resource Sharing and Student-to-Student Micro-Mentoring Platform**

Vivekananda Institute of Professional Studies (VIPS), Pitampura  
B.Tech — 1st Semester Project  
Domain: Web Development

---

## 1. Abstract

First-year students at GGSIPU-affiliated colleges routinely buy textbooks, mini-drafters, scientific calculators and lab coats at full price, while the same items sit unused with seniors or with students who have already finished the subject. Peer help also exists — a classmate who has already created a GitHub repository or prepared a project PPT — but there is no structured way to book a short session. Both problems currently live in WhatsApp groups that cannot be searched and whose files expire.

SkillSwap is a campus-only web platform with two modules. **Items** is a hyperlocal micro-donation board: leftover academic resources are listed as free, with pickup limited to walking distance from the VIPS gate (campus, Pitampura metro, Kohat Enclave, Rohini, Rithala, NSP). **Skills** is a student-to-student micro-mentoring network: 25-minute sessions are booked using time credits instead of money. A new user starts with one credit and earns the next by teaching.

The working prototype is built in React and Vite, with client-side routing and browser storage so the demo can run without a backend. Seed listings reflect real first-semester needs at VIPS (drafter, lab coat, Casio calculator, GitHub, Pandas, viva practice).

**Keywords:** campus sharing, micro-donation, peer mentoring, hyperlocal web app, time credits

---

## 2. Problem statement

### 2.1 Unused academic resources

A typical first-semester engineering student is asked to buy:

- a mini-drafter and drawing kit for Engineering Graphics
- a scientific calculator
- a white lab coat
- subject textbooks and graph notebooks

These items are often used for one semester. After the subject ends they become dead inventory. Seniors graduate with handwritten notes on a pen drive. First-years have no senior network yet, so they repurchase the same objects from shops outside the gate.

### 2.2 Unbookable peer help

Help is physically close. A second-semester student already knows Git, Canva slides, or how to plot a CSV in Pandas. There is no campus channel to book 25 minutes without:

- making it socially awkward in a WhatsApp group, or
- turning it into a paid “mentorship” product

### 2.3 Why existing tools fail

| Tool | Why it does not solve this |
|---|---|
| WhatsApp groups | Unsearchable, files expire, no pickup point, no time slot |
| OLX / Marketplace | City-wide, priced, courier-oriented, not campus-trust |
| Unacademy / YouTube courses | Long-form content, not a 25-minute peer session |
| Google Drive dumps | No matching, no neighbourhood, no booking |

The gap is a **closed, hyperlocal campus board** that treats leftover stuff as gifts and leftover skill as a short, credit-based session.

---

## 3. Objectives

1. Build a single website that combines resource sharing and micro-mentoring.
2. Restrict pickup to neighbourhoods day-scholars already travel (hyperlocal, not pan-India).
3. Keep items free (gift economy). Keep skills paid in time, not UPI.
4. Let a student create an account, list or request an item, book a 25-minute slot, and track requests in an inbox.
5. Produce a demo that can be recorded, deployed, and explained in a viva.

---

## 4. Scope

**In scope**

- Campus account (name, programme, area, optional enrollment)
- Item listings with category, condition, neighbourhood, pickup point
- Skill listings with 25-minute slots and a 1-credit wallet
- Request / booking inbox
- Profile with credits, listings and upcoming sessions
- Sample VIPS / Pitampura data for demonstration

**Out of scope (current version)**

- Real payments
- Server-side database and authentication
- Chat, maps SDK, or courier
- Admin moderation panel

---

## 5. Proposed solution

SkillSwap is one product with two rails:

### 5.1 Items (hyperlocal micro-donation)

A student lists something they no longer need. Another student requests it. They meet at a public point already on their commute (canteen bench, library steps, metro gate). No price. No courier. Distance is shown from the VIPS gate.

Categories used in the prototype: Textbooks, Notes, Lab & drawing, Electronics, Stationery, Gadgets.

### 5.2 Skills (micro-mentoring)

A student offers a 25-minute slot (GitHub repo, faculty PPT, Pandas chart, viva English, project video). Booking costs **1 time credit**. Teaching earns 1 credit. A new account receives **1 welcome credit** so the first booking is possible.

Categories: Coding, Data, Design, Academics, Career, Languages.

### 5.3 Design rules

1. If it cannot be picked up after a lecture, it should not be listed.
2. Stuff is a gift. Time is a credit.
3. Trust comes from a real name, programme, neighbourhood and pickup point — not star ratings.

---

## 6. Methodology

1. **Problem observation** — first-semester purchase cycle, WhatsApp-group failure, GGSIPU campus commute pattern around Pitampura.
2. **Requirement split** — two user jobs: give/get an object; give/get 25 minutes.
3. **Information architecture** — Home, Items, Skills, List, Inbox, Profile, About.
4. **Prototype** — React single-page application with seed data for VIPS neighbourhoods.
5. **Client-side persistence** — `localStorage` so the live demo works without a backend.
6. **Verification** — account creation, item request, skill booking, new listing, inbox.

---

## 7. System features

| Module | What the user can do |
|---|---|
| Account | Join with name, programme (AIDS/CSE), area |
| Home | See counts, nearby items, open skill slots |
| Items | Search, filter by category and area, open a listing, request pickup |
| Skills | Filter by category, see credit wallet, book a slot |
| List | Publish an item or a 25-minute skill |
| Inbox | See item requests and skill bookings |
| Profile | Credits, karma, own listings, upcoming sessions, reset demo data |
| About | Problem, rules, and what the product is not |

**Neighbourhoods in the prototype**

VIPS campus, Pitampura metro, Kohat Enclave, Rohini Sec 8–16, Rithala / PG belt, Netaji Subhash Place.

**Sample listings (for demo/video)**

- Mini-drafter + set squares (campus canteen)
- Let Us C textbook (Pitampura metro)
- Casio fx-991EX (Kohat Enclave)
- Arduino Uno leftover kit (Rohini)
- Skill: first GitHub repo in 25 minutes
- Skill: faculty PPT
- Skill: Pandas CSV to a defendable chart

---

## 8. Technical architecture

### 8.1 Stack

| Layer | Choice |
|---|---|
| UI library | React 19 |
| Bundler | Vite |
| Routing | React Router DOM |
| Styling | Custom CSS (IBM Plex Sans) |
| Icons | Lucide React |
| Data (demo) | JavaScript seed data + `localStorage` |

**Form field — Technologies / Tools Used**

`React, Vite, JavaScript, CSS, React Router, Lucide, localStorage, GitHub`

### 8.2 Folder structure (source)

```
src/
  App.jsx              routes, header, account gate
  context.jsx          shared state, credits, inbox, listings
  data.js              people, items, skills, neighbourhoods
  components/Cards.jsx item and skill cards
  pages/
    Home.jsx
    Share.jsx          items catalogue
    ShareDetail.jsx
    Skills.jsx
    SkillDetail.jsx
    Post.jsx           create listing
    Inbox.jsx
    Profile.jsx
    How.jsx            about / problem
```

### 8.3 Data flow

- On first visit the user creates a campus account (stored locally).
- Listings and bookings live in React context and are written to `localStorage`.
- Requesting an item marks it as Requested and appends an inbox row.
- Booking a skill consumes 1 credit, marks the slot taken, and appends inbox + booking records.
- Listing an item increases karma. Listing a skill creates a bookable slot.

This is an honest frontend prototype: suitable for a 1st-semester demo. A later version would replace `localStorage` with a database and login.

---

## 9. User flow (for video)

1. Open the site → **Create your account**.
2. Home shows item and skill counts.
3. **Items** → Mini-drafter → **Request item**.
4. **Skills** → “Your first GitHub repo in 25 minutes” → **Book**.
5. **List** → publish a spare notebook or a skill you can teach.
6. **Inbox** and **Profile** show the request, booking and remaining credits.

---

## 10. Outcomes

- A working campus website combining micro-donation and micro-mentoring.
- Clear problem → method → product story for evaluation.
- Hyperlocal constraint (pickup near VIPS) instead of a generic classifieds clone.
- A credit rule that prevents the skill side from becoming only-takers.
- Demo data that a faculty member at VIPS will recognise (EG drafter, lab coat, IPU-style notes).

---

## 11. Limitations

- No real server, so data stays in the browser of each device.
- No photograph upload; item cards use category colour blocks.
- No live chat; coordination is implied via inbox + pickup text.
- Seed users are sample classmates, not a live campus network.

---

## 12. Future work

- College email / enrollment verification
- Image upload for items
- Firebase or a simple backend for shared live data
- Push reminder before a booked slot
- Optional condonation of credits for teaching first-year lab skills
- Institute notice-board mode for faculty-approved leftover kits

---

## 13. Conclusion

SkillSwap treats two everyday campus failures as one product: unused academic objects and unbookable peer time. By keeping items free and local, and by pricing skills in 25-minute credits, the platform stays realistic for first-year students who have more leftovers and spare hours than money. The current build is a complete frontend prototype ready for GitHub, a live demo, a screen-recorded video, and a viva.

---

## 14. Google Form — ready answers

**Domain:** Web Development

**Student introduction (interest / exposure)**  
I want first-semester exposure to building a real web product, not only classroom programs. SkillSwap let me practice React, page structure, and turning a campus problem (unused kits + no way to book 25 minutes of help) into a working site.

**Project abstract / description**  
First-year students buy drafters, textbooks, calculators and lab coats that go unused after one subject, while peer help stays trapped in WhatsApp. SkillSwap is a VIPS-only website with two parts: a hyperlocal free-item board (pickup after class, within a few kilometres of the gate) and a 25-minute peer skill marketplace paid in time credits. Built with React and Vite; listings, requests and bookings work in the browser for demo.

**Technologies / tools used**  
React, Vite, JavaScript, CSS, React Router, Lucide, GitHub

**What to attach later**

- Source code URL — GitHub repository  
- Live URL — Vercel / Netlify deploy of this Vite app  
- Video — 2–3 min: account → request drafter → book GitHub slot → inbox  
- PPT — problem, two modules, screenshots, tech, future work  
- Report — this document as PDF

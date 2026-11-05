# AI University Help Desk

A prototype chat assistant for university students. It answers common questions, uses each student's own (fictional) data, creates help tickets and hands the conversation over to staff.

This is a student course project for **INF451**. It is **not an official SDU service**, and **all data in it is fictional** (students, IDs, balances, tickets, advisors).

Developed by a student team as part of INF451.

**Live demo:** https://ai-university-helpdesk.netlify.app/

## Features

**Student side**
- Chat assistant that answers in the language of the question (English, Kazakh, Russian), with a source for every answer
- Question understanding in plain JavaScript: text normalisation (including Kazakh letters), a synonym, slang and transliteration dictionary per topic ("эдд дроп", "вайфай не ловит", "мен грантпын ба"), typo tolerance (Levenshtein distance) and similarity scoring against every question variant in the knowledge base; confident matches are answered, close ones get "Did you mean…?" buttons, the rest are logged as unanswered
- Helpful / Not helpful rating under every answer with an optional short comment; each rating is saved with the question, the answer and the time
- Visitor mode ("Continue as visitor"): general questions, FAQ and the campus map without an account; visitor ratings are stored anonymously, personal features ask the visitor to sign in
- Personal answers from the signed-in student's data: course registration check (holds and prerequisites), tuition balance and state grant status, advisor appointments
- FAQ page with search; the chat bot uses the same answers
- Campus map and room finder: ask "Where is room F305?" (also in Kazakh and Russian) and get building, floor, room type and a hint; for a number without a building ("room 305") the bot asks which building, and for a near miss ("H1") it suggests the existing room; a Campus map page shows the buildings D–I and barrels A1–C2 and highlights the chosen place
- Similar-question suggestions while typing in the chat, and a "Help Desk is typing…" indicator
- Help tickets with status tracking, staff replies and a 1–5 star rating of resolved tickets
- Advisor appointment booking with reminders
- Notification bell (staff reply, status change, appointment reminder)
- Dashboard with deadlines, recent tickets and quick actions; announcement banners
- First-login guided tour (can be replayed from the user menu)

**Staff side**
- Kanban ticket board (Open / In progress / Resolved) with priority (Low / Medium / High) and a 24-hour reply SLA with an "Overdue" marker
- Ticket drawer with the conversation, status and priority controls, and reply field
- Review queue: answers rated "Not helpful" with the question, answer, comment and time, and a "Mark reviewed" button
- Analytics with a period filter (Today / Last 7 days / Last 30 days / All time): questions asked, share of unanswered questions, tickets, escalations to staff, average rating, top 5 questions and an "Unanswered & not helpful" list with a "Create FAQ entry" button; only aggregated data, no student names or IDs
- Knowledge base: FAQ and office entries with search, Add / Edit / Archive; an entry is published only when the question and the answer are filled in English, Kazakh and Russian; every change is kept as a version with author and date, with "Roll back"; the bot and the FAQ page use the published entries right away
- Staff sections open by address (for example `#analytics`); students and visitors see "Access denied" and no data
- Announcements: publish or unpublish a notice shown to students

**General**
- Interface in English, Kazakh and Russian (English by default; the choice is remembered)
- Light and dark theme (follows the system by default; the choice is remembered)
- About page with the project overview and a sprint board with a burndown chart

## User stories

Status is checked against the QA scenarios in [docs/SPRINTS.md](docs/SPRINTS.md), on demo data. **Done:** the scenarios work. **Partial:** some of them work. **Planned:** not started.

| Sprint | Story | Status | What is missing |
|---|---|---|---|
| 1 – General help | US1 FAQ Instant Answers | Done | |
| 1 – General help | US2 IT Issue Self-Help | Partial | No real password-reset link; a ticket does not list the steps already tried |
| 1 – General help | US3 Help Ticket Creation | Partial | The chat cannot report a ticket's status; it is shown only in My tickets |
| 1 – General help | US4 Escalation to Human Staff | Partial | The live chat is simulated: staff do not receive the conversation, and working hours are not checked |
| 2 – Personal answers | US5 Course Registration Guidance | Partial | No seat availability; a named course (e.g. CS201) is not checked separately |
| 2 – Personal answers | US6 Financial Aid & Billing Q&A | Partial | "Financial aid" questions are not recognised; no award amount, disbursement date or payment methods |
| 2 – Personal answers | US7 Advisor Appointment Scheduling | Partial | A slot taken by another student is not detected; there is no advisor calendar |
| 2 – Personal answers | US8 Multi-Language Support | Done | |
| 3 – Schedules, contacts and documents | US9 Class & Exam Schedule Lookup | Partial | The bot only points to the Student Portal: no class list with time, room and teacher, and no exam schedule |
| 3 – Schedules, contacts and documents | US10 Office & Contact Directory | Partial | Offices are described, but only the Student Service Center has hours and contacts; no room per office and no "closed now" warning |
| 3 – Schedules, contacts and documents | US11 Deadline & Event Reminders | Partial | Deadlines are listed on Home and appointments trigger reminders, but there are no payment reminders 7 days ahead and reminders cannot be turned off |
| 3 – Schedules, contacts and documents | US12 Certificate & Document Requests | Partial | The bot explains that the Registrar handles documents and a general ticket can be sent; no document request, ready date or "ready" status |
| 4 – Campus, feedback and knowledge base | US13 Campus Navigation & Room Finder | Partial | The map has no nearest entrance and no services such as the library or canteen |
| 4 – Campus, feedback and knowledge base | US14 Answer Feedback & Rating | Done | |
| 4 – Campus, feedback and knowledge base | US15 Help Desk Analytics Dashboard | Done | |
| 4 – Campus, feedback and knowledge base | US16 Knowledge Base Content Management | Done | |

## Sprint backlog

The full product backlog (28 user stories in 7 two-week sprints, with estimates, priorities and QA test scenarios) is in [docs/SPRINTS.md](docs/SPRINTS.md). The table above covers sprints 1–4 (US1–US16); the prototype does not include sprints 5–7.

## Demo accounts

Password for every account: `demo123`

| Login | Role | Notes |
|---|---|---|
| `249900001` | Student | Tuition with an unpaid balance, library hold on registration |
| `249900002` | Student | Studies on a state grant, no balance, no holds |
| `249900003` | Student | Tuition paid in full, no holds |
| `249900004` | Student | Tuition with an unpaid balance, no holds |
| `staff` | Staff | Ticket board, review queue, analytics, knowledge base, announcements |

The login screen also lists these accounts; click one to fill in the login. **Continue as visitor** opens the chat without an account.

## How to run

No server, build step or installation is needed.

1. Download or clone the repository.
2. Open `index.html` in a browser (double-click it).

Notes:
- Data (tickets, appointments, chat history, notifications) is stored in the browser's `localStorage`, separately for each student ID. Use **Reset demo** in the user menu to restore the initial data.
- Because storage is per browser, tickets are not shared between different computers. To see "student writes, staff replies", use two tabs in the same browser.
- Fonts are loaded from Google Fonts; without internet the page falls back to system fonts.

## Tests

Open `tests/nlu-test.html` in a browser. It runs the real chat engine on 60 questions in English, Russian and Kazakh (slang, transliteration, typos) and on every built-in question, and shows a table: question → expected topic → where the bot routed it → what the bot answered → result. It does not change the demo data.

## Project structure

```
index.html   Page structure: login, header, all views, tour overlay
style.css    Styles, light and dark theme tokens, responsive layout
i18n.js      Interface strings (EN / KK / RU), bot replies and the initial FAQ content
nlu.js       Question understanding: normalisation, topic synonyms, typo tolerance, knowledge base scoring
app.js       Demo accounts and data, state, chat engine and answer routing
ui.js        Views, dashboard, staff board, analytics, notifications, tour, login, theme
docs/SPRINTS.md   Sprint backlog: all user stories with QA scenarios
tests/nlu-test.html   Test set for question understanding
```

## Tech

Plain HTML, CSS and JavaScript. No frameworks, no backend.

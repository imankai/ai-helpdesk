# AI University Help Desk

A prototype chat assistant for university students. It answers common questions, uses each student's own (fictional) data, creates help tickets and hands the conversation over to staff.

This is a student course project for **INF451**. It is **not an official SDU service**, and **all data in it is fictional** (students, IDs, balances, tickets, advisors).

Developed by a student team as part of INF451.

**Live demo:** https://ai-university-helpdesk.netlify.app/

## Features

**Student side**
- Chat assistant that answers in the language of the question (English, Kazakh, Russian), with a source for every answer and Helpful / Not helpful feedback
- Personal answers from the signed-in student's data: course registration check (holds and prerequisites), tuition balance and state grant status, advisor appointments
- FAQ page with search; the chat bot uses the same answers
- Similar-question suggestions while typing in the chat, and a "Help Desk is typing…" indicator
- Help tickets with status tracking, staff replies and a 1–5 star rating of resolved tickets
- Advisor appointment booking with reminders
- Notification bell (staff reply, status change, appointment reminder)
- Dashboard with deadlines, recent tickets and quick actions; announcement banners
- First-login guided tour (can be replayed from the user menu)

**Staff side**
- Kanban ticket board (Open / In progress / Resolved) with priority (Low / Medium / High) and a 24-hour reply SLA with an "Overdue" marker
- Ticket drawer with the conversation, status and priority controls, and reply field
- Analytics: tickets by status and office, overdue count, share of Helpful answers, top 5 questions, average rating and latest reviews
- Announcements: publish or unpublish a notice shown to students

**General**
- Interface in English, Kazakh and Russian (English by default; the choice is remembered)
- Light and dark theme (follows the system by default; the choice is remembered)
- About page with the project overview and a sprint board with a burndown chart

## User stories

| Sprint | Story |
|---|---|
| 1 – General help | US1 FAQ Instant Answers |
| 1 – General help | US2 IT Issue Self-Help |
| 1 – General help | US3 Help Ticket Creation |
| 1 – General help | US4 Escalation to Human Staff |
| 2 – Personal answers | US5 Course Registration Guidance |
| 2 – Personal answers | US6 Financial Aid & Billing Q&A |
| 2 – Personal answers | US7 Advisor Appointment Scheduling |
| 2 – Personal answers | US8 Multi-Language Support |

## Sprint backlog

The full product backlog (28 user stories in 7 two-week sprints, with estimates, priorities and QA test scenarios) is in [docs/SPRINTS.md](docs/SPRINTS.md). The prototype implements the stories of sprints 1 and 2 (US1–US8).

## Demo accounts

Password for every account: `demo123`

| Login | Role | Notes |
|---|---|---|
| `249900001` | Student | Tuition with an unpaid balance, library hold on registration |
| `249900002` | Student | Studies on a state grant, no balance, no holds |
| `249900003` | Student | Tuition paid in full, no holds |
| `249900004` | Student | Tuition with an unpaid balance, no holds |
| `staff` | Staff | Ticket board, analytics, announcements |

The login screen also lists these accounts; click one to fill in the login.

## How to run

No server, build step or installation is needed.

1. Download or clone the repository.
2. Open `index.html` in a browser (double-click it).

Notes:
- Data (tickets, appointments, chat history, notifications) is stored in the browser's `localStorage`, separately for each student ID. Use **Reset demo** in the user menu to restore the initial data.
- Because storage is per browser, tickets are not shared between different computers. To see "student writes, staff replies", use two tabs in the same browser.
- Fonts are loaded from Google Fonts; without internet the page falls back to system fonts.

## Project structure

```
index.html   Page structure: login, header, all views, tour overlay
style.css    Styles, light and dark theme tokens, responsive layout
i18n.js      Interface strings (EN / KK / RU), bot replies and FAQ content
app.js       Demo accounts and data, state, chat engine and intent matching
ui.js        Views, dashboard, staff board, analytics, notifications, tour, login, theme
docs/SPRINTS.md   Sprint backlog: all user stories with QA scenarios
```

## Tech

Plain HTML, CSS and JavaScript. No frameworks, no backend.

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
- Campus map and room finder: ask "Where is room F305?" (also in Kazakh and Russian) and get building, floor, room type, nearest entrance and a hint; for a number without a building ("room 305") the bot asks which building, and for a near miss ("H1") it suggests the existing room; a Campus map page shows the buildings D–I and barrels A1–C2 and highlights the chosen place
- Similar-question suggestions while typing in the chat, and a "Help Desk is typing…" indicator
- Help tickets with status tracking, staff replies and a 1–5 star rating of resolved tickets
- Advisor appointment booking with reminders
- Notification bell (staff reply, status change, appointment reminder, tuition reminder 7 days before the deadline, absence warnings, housing request status); reminders can be turned off in the user menu or by asking in the chat
- Ticket status in the chat ("where is my ticket"): number, office and status of the student's own latest tickets
- Grades and transcript in the chat ("What is my GPA?", "мои оценки", "менің бағаларым", "оценка по INF451"): a card with course, grade and credits, the GPA and the total credits earned, for all courses or for one; a final grade that is not posted yet comes with the official posting deadline (28.12.2026)
- Attendance in the chat ("How many classes have I missed?", "пропуски", "сабақ босаттым", "сколько я пропустил по INF451"): absences, limit and absences left for every current course or for one
- Absence warnings in the notification bell: when 2 or fewer absences are left before the limit (with the course and the limit), and a separate warning when the limit is exceeded
- Library: search the catalog by title, author or course ("Is 'Clean Code' available?", "книги по INF451", "kitap bar ma") for available copies and the shelf, or "not available" with the nearest return date; "My books" lists the user's loans with due dates and marks overdue ones, and explains that an overdue book blocks registration (library hold); visitors can search the catalog, "My books" needs a sign-in
- Dormitory requests: "The light in my room does not work", "в общаге не работает свет", "жатақханада кран сынды" → the bot suggests a type (repair, room change, other), fills in the student's dormitory and room, asks to confirm and gives a request number (H-…); "What is the status of my repair request?" shows the status (Submitted → In progress → Done) and the last update; a student who does not live in a dormitory is told why and gets the Housing Office contacts; "wifi в общаге" still answers about Wi-Fi
- Office directory: room on the campus map, hours, phone and email for every office, with "Closed now, opens at…" outside working hours
- Campus events ("What events are on campus this week?", "события на этой неделе", "осы аптадағы іс-шаралар", "что будет в пятницу", "When is the hackathon?"): event cards with date, time and place from the campus map, a **Register** button (registration inside the site with a confirmation; a visitor's registration lasts until the page is closed) and **Show on map**; demo dates are counted from today, so there are always events this week and later, and past events are never shown as upcoming
- Student clubs ("Is there a programming club?", "есть ли клуб программирования", "бағдарламалау үйірмесі бар ма"): description, meeting day, time and place, contact person with a name@university.demo email; a club that does not exist gets "not found" and the list of clubs
- Teacher contacts and office hours ("When are office hours for INF451?", "консультация по INF451", "почта Демовой", "оқытушының поштасы"): search by teacher name or course code; a signed-in student's "my INF451 teacher" is found from the student's own schedule, all teachers of a course are shown, and a teacher who does not teach the course is never returned; email, office on the campus map (with **Show on map**) and office hours, no phone numbers; an unknown teacher gets "Teacher not found" and the Dean's Office contacts
- Dashboard with deadlines, recent tickets and quick actions; announcement banners
- First-login guided tour (can be replayed from the user menu)

**Staff side**
- Kanban ticket board (Open / In progress / Resolved) with priority (Low / Medium / High) and a 24-hour reply SLA with an "Overdue" marker
- Test assistant: a chat with the bot for checking answers (including the library catalog and the staff member's own library books); ratings go to the Review queue marked Staff, questions are not counted in Analytics
- Ticket drawer with the conversation, status and priority controls, and reply field
- Review queue: answers rated "Not helpful" with the question, answer, comment and time, and a "Mark reviewed" button
- Analytics with a period filter (Today / Last 7 days / Last 30 days / All time): questions asked, share of unanswered questions, tickets, escalations to staff, average rating, top 5 questions and an "Unanswered & not helpful" list with a "Create FAQ entry" button; only aggregated data, no student names or IDs
- Knowledge base: FAQ, office, event, club and teacher entries with search, Add / Edit / Archive; events, clubs and teachers have their own fields (date and time, place from the campus map, contact person, courses, office, office hours), and a place outside the map, an email not of the form name@university.demo or a phone number blocks publishing; an entry is published only when the question and the answer are filled in English, Kazakh and Russian; every change is kept as a version with author and date, with "Roll back"; the bot and the FAQ page use the published entries right away
- Staff sections open by address (for example `#analytics`); students and visitors see "Access denied" and no data
- Housing requests: every dormitory request with number, student, dormitory, room, type, description and last update; changing the status notifies the student
- Announcements: publish or unpublish a notice shown to students
- Attendance (demo): pick a student and a course and press "Mark absence" to act as the teacher; the student gets the absence warning right away; a table shows every student's absences and limits

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
| 1 – General help | US3 Help Ticket Creation | Done | |
| 1 – General help | US4 Escalation to Human Staff | Partial | The live chat is simulated: staff do not receive the conversation, and working hours are not checked |
| 2 – Personal answers | US5 Course Registration Guidance | Partial | No seat availability; a named course (e.g. CS201) is not checked separately |
| 2 – Personal answers | US6 Financial Aid & Billing Q&A | Partial | Shows the scholarship status, but no award amount, disbursement date or payment methods |
| 2 – Personal answers | US7 Advisor Appointment Scheduling | Partial | A slot taken by another student is not detected; there is no advisor calendar |
| 2 – Personal answers | US8 Multi-Language Support | Done | |
| 3 – Schedules, contacts and documents | US9 Class & Exam Schedule Lookup | Partial | The bot only points to the Student Portal: no class list with time, room and teacher, and no exam schedule |
| 3 – Schedules, contacts and documents | US10 Office & Contact Directory | Done | |
| 3 – Schedules, contacts and documents | US11 Deadline & Event Reminders | Done | |
| 3 – Schedules, contacts and documents | US12 Certificate & Document Requests | Partial | The bot explains that the Registrar handles documents and a general ticket can be sent; no document request, ready date or "ready" status |
| 4 – Campus, feedback and knowledge base | US13 Campus Navigation & Room Finder | Done | |
| 4 – Campus, feedback and knowledge base | US14 Answer Feedback & Rating | Done | |
| 4 – Campus, feedback and knowledge base | US15 Help Desk Analytics Dashboard | Done | |
| 4 – Campus, feedback and knowledge base | US16 Knowledge Base Content Management | Done | |
| 5 – More student self-service | US17 Grades & Transcript Lookup | Done | |
| 5 – More student self-service | US18 Attendance Tracking & Absence Warnings | Done | |
| 5 – More student self-service | US19 Library Services | Done | |
| 5 – More student self-service | US20 Dormitory & Housing Requests | Done | |
| 6 – Campus life and accessibility | US21 Campus Events & Club Announcements | Done | |
| 6 – Campus life and accessibility | US22 Teacher Contact & Office Hours | Done | |
| 6 – Campus life and accessibility | US23 Conversation History | Planned | |
| 6 – Campus life and accessibility | US24 Accessibility & Voice Input | Planned | |

## Sprint backlog

The full product backlog (28 user stories in 7 two-week sprints, with estimates, priorities and QA test scenarios) is in [docs/SPRINTS.md](docs/SPRINTS.md). The table above covers sprints 1–6 (US1–US24); sprint 7 is not in the prototype yet.

## Demo accounts

Password for every account: `demo123`

| Login | Role | Notes |
|---|---|---|
| `249900001` | Student | Tuition with an unpaid balance, library hold on registration (2 library books, one overdue); GPA 3.12, 128 credits; Dormitory 1, room 312 |
| `249900002` | Student | Studies on a state grant, no balance, no holds; GPA 3.67, 134 credits; 4 of 6 absences in INF451 (absence warning); does not live in a dormitory |
| `249900003` | Student | Tuition paid in full, no holds; GPA 2.85, 121 credits; Dormitory 2, room 105 (repair request in progress) |
| `249900004` | Student | Tuition with an unpaid balance, no holds; GPA 3.40, 126 credits; Dormitory 2, room 418 |
| `staff` | Staff | Ticket board, review queue, analytics, knowledge base, announcements, attendance (demo), housing requests |

The login screen also lists these accounts; click one to fill in the login. **Continue as visitor** opens the chat without an account.

## How to run

No server, build step or installation is needed.

1. Download or clone the repository.
2. Open `index.html` in a browser (double-click it).

Notes:
- Data (tickets, appointments, chat history, notifications) is stored in the browser's `localStorage`, separately for each student ID. Use **Reset demo** in the user menu to restore the initial data.
- Because storage is per browser, tickets are not shared between different computers. To see "student writes, staff replies" or "staff marks an absence, the student gets a warning", use two tabs in the same browser.
- Fonts are loaded from Google Fonts; without internet the page falls back to system fonts.

## Tests

Open `tests/nlu-test.html` in a browser. It runs the real chat engine on 210 questions in English, Russian and Kazakh (slang, transliteration, typos), on every built-in question, on every word of the earlier keyword rules, on language detection and on the QA scenarios of the finished stories, and shows tables: question → expected topic → where the bot routed it → what the bot answered → result. It does not change the demo data.

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

# Sprint Backlog — AI University Help Desk

Product backlog for the INF451 course project: 28 user stories in 7 two-week sprints.

All data in the project is fictional. This is a student project, not an official SDU service.

## Priority legend

C = complexity, V = value (H = high, L = low).

| Quadrant | Decision |
|---|---|
| LC&HV | Do now |
| HC&HV | Do later |
| LC&LV | Do much later |
| HC&LV | Never do |

## Sprint overview

| Sprint | Theme | Deadline | Stories | Points |
|---|---|---|---|---|
| 1 | General help | 25.09.2026 | US1, US2, US3, US4 | 14 |
| 2 | Personal answers with student data | 09.10.2026 | US5, US6, US7, US8 | 23 |
| 3 | Schedules, contacts and documents | 23.10.2026 | US9, US10, US11, US12 | 18 |
| 4 | Campus, feedback and knowledge base | 06.11.2026 | US13, US14, US15, US16 | 20 |
| 5 | More student self-service | 20.11.2026 | US17, US18, US19, US20 | 20 |
| 6 | Campus life and accessibility | 04.12.2026 | US21, US22, US23, US24 | 16 |
| 7 | Campus services and privacy | 18.12.2026 | US25, US26, US27, US28 | 16 |

## All stories

| # | Story | Estimate /10 | Quadrant | Sprint |
|---|---|---|---|---|
| US1 | [FAQ Instant Answers](#us1) | 3 | LC&HV | 1 |
| US2 | [IT Issue Self-Help](#us2) | 4 | LC&HV | 1 |
| US3 | [Help Ticket Creation](#us3) | 3 | LC&HV | 1 |
| US4 | [Escalation to Human Staff](#us4) | 4 | LC&HV | 1 |
| US5 | [Course Registration Guidance](#us5) | 7 | HC&HV | 2 |
| US6 | [Financial Aid & Billing Q&A](#us6) | 6 | HC&HV | 2 |
| US7 | [Advisor Appointment Scheduling](#us7) | 5 | LC&HV | 2 |
| US8 | [Multi-Language Support (EN/KK/RU)](#us8) | 5 | LC&HV | 2 |
| US9 | [Class & Exam Schedule Lookup](#us9) | 4 | LC&HV | 3 |
| US10 | [Office & Contact Directory](#us10) | 3 | LC&HV | 3 |
| US11 | [Deadline & Event Reminders](#us11) | 5 | LC&HV | 3 |
| US12 | [Certificate & Document Requests](#us12) | 6 | HC&HV | 3 |
| US13 | [Campus Navigation & Room Finder](#us13) | 4 | LC&HV | 4 |
| US14 | [Answer Feedback & Rating](#us14) | 3 | LC&HV | 4 |
| US15 | [Help Desk Analytics Dashboard](#us15) | 7 | HC&HV | 4 |
| US16 | [Knowledge Base Content Management](#us16) | 6 | HC&HV | 4 |
| US17 | [Grades & Transcript Lookup](#us17) | 5 | LC&HV | 5 |
| US18 | [Attendance Tracking & Absence Warnings](#us18) | 4 | LC&HV | 5 |
| US19 | [Library Services](#us19) | 5 | LC&HV | 5 |
| US20 | [Dormitory & Housing Requests](#us20) | 6 | HC&HV | 5 |
| US21 | [Campus Events & Club Announcements](#us21) | 4 | LC&HV | 6 |
| US22 | [Teacher Contact & Office Hours](#us22) | 4 | LC&HV | 6 |
| US23 | [Conversation History](#us23) | 3 | LC&HV | 6 |
| US24 | [Accessibility & Voice Input](#us24) | 5 | LC&HV | 6 |
| US25 | [Lost & Found](#us25) | 4 | LC&HV | 7 |
| US26 | [Canned Replies for Live Chat](#us26) | 3 | LC&HV | 7 |
| US27 | [Study Room Booking](#us27) | 5 | LC&HV | 7 |
| US28 | [Personal Data Privacy Controls](#us28) | 4 | LC&HV | 7 |

## Sprint 1 — General help

Deadline: **25.09.2026** · 14 points

<a id="us1"></a>
### US1 FAQ Instant Answers

> As a student, staff member, or visitor I want to ask the help desk assistant common questions (deadlines, policies, office hours, procedures) in plain language, so that I get an instant answer without searching the website or waiting for an email reply

| | |
|---|---|
| Estimate | 3/10 |
| Quadrant | LC&HV |
| User role | Student, Staff, Visitor |
| Pre-requirements | FAQ Knowledge Base populated and structured; NLP intent-recognition service available |
| Sprint / deadline | 1 / 25.09.2026 |

**QA test**

*Scenario 1: Successful FAQ answer*

- **Given** The user opens the help desk assistant chat
- **When** The user asks “What is the deadline to drop a course this semester?”
- **Then** The assistant returns the correct drop-deadline date sourced from the FAQ Knowledge Base
- **And** The response is delivered within 5 seconds

*Scenario 2: No matching FAQ found*

- **Given** The user opens the help desk assistant chat
- **When** The user asks a question with no matching entry in the FAQ Knowledge Base
- **Then** The assistant tells the user it could not find an answer
- **And** The assistant offers to create a help ticket or connect the user with staff

<a id="us2"></a>
### US2 IT Issue Self-Help

> As a student or staff member I want the assistant to walk me through common IT fixes (password reset, Wi-Fi connection, portal login), so that I can resolve simple issues myself without filing a help ticket

| | |
|---|---|
| Estimate | 4/10 |
| Quadrant | LC&HV |
| User role | Student, Staff |
| Pre-requirements | IT troubleshooting knowledge base populated; links to official IT self-service tools available |
| Sprint / deadline | 1 / 25.09.2026 |

**QA test**

*Scenario 1: Successful password-reset guidance*

- **Given** The user reports they cannot log into the student portal
- **When** The user asks “I forgot my password, what do I do?”
- **Then** The assistant provides the official self-service password-reset link and steps
- **And** The assistant never asks the user to type their password in chat

*Scenario 2: Unresolved issue after self-help*

- **Given** The user has followed the suggested Wi-Fi troubleshooting steps
- **When** The user reports the issue is still not fixed
- **Then** The assistant offers to create a help ticket for further support
- **And** The ticket includes the troubleshooting steps already attempted

<a id="us3"></a>
### US3 Help Ticket Creation

> As a student or staff member I want to submit a help request through the assistant when it cannot answer my question, so that my issue reaches the right university office and I can track its progress

| | |
|---|---|
| Estimate | 3/10 |
| Quadrant | LC&HV |
| User role | Student, Staff |
| Pre-requirements | User authentication available; Help Desk Ticketing System accessible via API |
| Sprint / deadline | 1 / 25.09.2026 |

**QA test**

*Scenario 1: Successful ticket creation*

- **Given** The user is logged into the help desk assistant
- **When** The user describes an issue the assistant cannot resolve
- **Then** The assistant creates a new ticket and returns a valid ticket number
- **And** The ticket is visible in the Help Desk Ticketing System under the user's account

*Scenario 2: Checking ticket status*

- **Given** The user has previously submitted ticket #10432
- **When** The user asks “What's the status of my ticket 10432?”
- **Then** The assistant returns the current status and last update for that ticket
- **And** The assistant does not display ticket details belonging to another user

<a id="us4"></a>
### US4 Escalation to Human Staff

> As a student or staff member I want the assistant to connect me with a live staff member when it cannot resolve my issue, so that I'm not stuck with an unhelpful bot

| | |
|---|---|
| Estimate | 4/10 |
| Quadrant | LC&HV |
| User role | Student, Staff |
| Pre-requirements | Story 3 done; live-chat/queue system available; staff working-hours schedule accessible |
| Sprint / deadline | 1 / 25.09.2026 |

**QA test**

*Scenario 1: Escalation during working hours*

- **Given** The assistant has failed to resolve the user's issue after two attempts
- **When** It is within published Help Desk staff working hours
- **Then** The assistant offers to connect the user to a live staff member
- **And** The staff member receives the full prior conversation context

*Scenario 2: Escalation outside working hours*

- **Given** The assistant has failed to resolve the user's issue
- **When** It is outside published Help Desk staff working hours
- **Then** The assistant informs the user that live staff are unavailable
- **And** The assistant creates a help ticket instead of offering live escalation

## Sprint 2 — Personal answers with student data

Deadline: **09.10.2026** · 23 points

<a id="us5"></a>
### US5 Course Registration Guidance

> As a student I want step-by-step help checking whether I can register for a course (prerequisites, holds, deadlines), so that I complete registration correctly and on time

| | |
|---|---|
| Estimate | 7/10 |
| Quadrant | HC&HV |
| User role | Student |
| Pre-requirements | Story 1 done; read access to Student Portal API (transcript, holds, prerequisites, seat availability) |
| Sprint / deadline | 2 / 09.10.2026 |

**QA test**

*Scenario 1: Eligible to register*

- **Given** The student has no holds and has completed all prerequisites for CS201
- **When** The student asks “Can I register for CS201 next semester?”
- **Then** The assistant confirms the student is eligible to register
- **And** The assistant states the current seat availability for the course

*Scenario 2: Blocked by a hold*

- **Given** The student has an active financial hold on their account
- **When** The student asks to register for a course
- **Then** The assistant informs the student they cannot register due to the hold
- **And** The assistant directs the student to the office that can resolve the hold

<a id="us6"></a>
### US6 Financial Aid & Billing Q&A

> As a student I want to ask about my financial aid status, tuition balance, and payment deadlines, so that I stay informed without visiting the finance office in person

| | |
|---|---|
| Estimate | 6/10 |
| Quadrant | HC&HV |
| User role | Student |
| Pre-requirements | Story 1 done; read access to Financial Aid and Billing systems |
| Sprint / deadline | 2 / 09.10.2026 |

**QA test**

*Scenario 1: Checking financial aid status*

- **Given** The student has an active financial aid award for the current semester
- **When** The student asks “What is my financial aid status?”
- **Then** The assistant returns the current award amount and disbursement date
- **And** The information matches the Financial Aid system record

*Scenario 2: Checking outstanding balance*

- **Given** The student has an outstanding tuition balance
- **When** The student asks “How much do I still owe and when is it due?”
- **Then** The assistant returns the correct balance and next payment deadline
- **And** The assistant lists the accepted payment methods

<a id="us7"></a>
### US7 Advisor Appointment Scheduling

> As a student I want to book an appointment with my academic advisor through the assistant, so that I don't have to call or email the advising office separately

| | |
|---|---|
| Estimate | 5/10 |
| Quadrant | LC&HV |
| User role | Student |
| Pre-requirements | Story 3 done; Advisor Calendar/Scheduling system accessible via API |
| Sprint / deadline | 2 / 09.10.2026 |

**QA test**

*Scenario 1: Successful booking*

- **Given** The student's advisor has an open slot on Thursday at 2 PM
- **When** The student asks to book that slot
- **Then** The assistant confirms the booking and it appears on the advisor's calendar
- **And** The student receives a confirmation message with the appointment details

*Scenario 2: Slot already taken*

- **Given** Two students attempt to book the same advisor slot at nearly the same time
- **When** The second student's booking request is processed
- **Then** The assistant informs the second student the slot is no longer available
- **And** The assistant offers the next open slot instead

<a id="us8"></a>
### US8 Multi-Language Support (EN/KK/RU)

> As a student, staff member, or visitor I want to interact with the assistant in English, Kazakh, or Russian, so that language is not a barrier to getting help

| | |
|---|---|
| Estimate | 5/10 |
| Quadrant | LC&HV |
| User role | Student, Staff, Visitor |
| Pre-requirements | Story 1 done; multilingual NLP model integrated (EN/KK/RU); FAQ and system content localized |
| Sprint / deadline | 2 / 09.10.2026 |

**QA test**

*Scenario 1: Query in Kazakh*

- **Given** The user opens the assistant chat and writes in Kazakh
- **When** The user asks “Мен қалай онлайн тіркеле аламын?” (How do I register online?)
- **Then** The assistant responds in Kazakh with the correct registration guidance
- **And** The response is generated in under 2 seconds

*Scenario 2: Language switch mid-conversation*

- **Given** An ongoing conversation in English
- **When** The user sends a follow-up question in Russian
- **Then** The assistant automatically detects the switch and responds in Russian
- **And** The assistant maintains the conversation context across the language change

## Sprint 3 — Schedules, contacts and documents

Deadline: **23.10.2026** · 18 points

<a id="us9"></a>
### US9 Class & Exam Schedule Lookup

> As a student I want to ask the assistant for my class or exam schedule (time, room, teacher), so that I don't have to search the portal every day

| | |
|---|---|
| Estimate | 4/10 |
| Quadrant | LC&HV |
| User role | Student |
| Pre-requirements | Story 1 done; read access to the university Schedule system (classes and exams) |
| Sprint / deadline | 3 / 23.10.2026 |

**QA test**

*Scenario 1: Checking tomorrow's classes*

- **Given** The student is logged into the help desk assistant
- **When** The student asks “What classes do I have tomorrow?”
- **Then** The assistant returns the list of classes with time, room, and teacher
- **And** The schedule matches the official Schedule system for that student

*Scenario 2: Exam schedule not yet published*

- **Given** The exam schedule for the current semester has not been published yet
- **When** The student asks “When is my final exam in INF451?”
- **Then** The assistant informs the student that the exam schedule is not published yet
- **And** The assistant tells the student where and approximately when it will be published

<a id="us10"></a>
### US10 Office & Contact Directory

> As a student, staff member, or visitor I want to ask which office handles my issue and get its location, working hours, and contacts, so that I go to the right place the first time

| | |
|---|---|
| Estimate | 3/10 |
| Quadrant | LC&HV |
| User role | Student, Staff, Visitor |
| Pre-requirements | Story 1 done; office directory (names, locations, hours, contacts) collected and stored in the Knowledge Base |
| Sprint / deadline | 3 / 23.10.2026 |

**QA test**

*Scenario 1: Finding the right office*

- **Given** The user opens the help desk assistant chat
- **When** The user asks “Who can help with a lost student ID?”
- **Then** The assistant names the responsible office
- **And** The assistant shows its building and room, working hours, phone, and email

*Scenario 2: Office is closed now*

- **Given** The responsible office is currently closed (outside its working hours)
- **When** The user asks how to contact that office
- **Then** The assistant returns the office contacts and warns that the office is closed now, showing when it opens
- **And** The assistant offers to create a help ticket instead

<a id="us11"></a>
### US11 Deadline & Event Reminders

> As a student I want the assistant to remind me about upcoming academic and payment deadlines (registration, add/drop, tuition, exam sign-up), so that I never miss an important date

| | |
|---|---|
| Estimate | 5/10 |
| Quadrant | LC&HV |
| User role | Student |
| Pre-requirements | Story 1 and Story 6 done; read access to the Academic Calendar and Billing deadlines; notification service (email/push) available |
| Sprint / deadline | 3 / 23.10.2026 |

**QA test**

*Scenario 1: Receiving a payment reminder*

- **Given** The student has subscribed to tuition payment reminders
- **When** The tuition payment deadline is 7 days away
- **Then** The assistant sends the student a reminder with the deadline date and amount due
- **And** The reminder contains a link to the payment page

*Scenario 2: Turning reminders off*

- **Given** The student is subscribed to deadline reminders
- **When** The student writes “Stop sending me reminders”
- **Then** The assistant confirms that reminders are turned off
- **And** The student receives no further reminders

<a id="us12"></a>
### US12 Certificate & Document Requests

> As a student I want to request official documents (enrollment certificate, transcript copy, student status letter) through the assistant, so that I don't have to visit the Registrar's office in person

| | |
|---|---|
| Estimate | 6/10 |
| Quadrant | HC&HV |
| User role | Student |
| Pre-requirements | Story 3 done; user authentication available; Registrar document-request system accessible via API |
| Sprint / deadline | 3 / 23.10.2026 |

**QA test**

*Scenario 1: Requesting an enrollment certificate*

- **Given** The student is logged into the help desk assistant
- **When** The student asks “I need an enrollment certificate for the military office”
- **Then** The assistant submits the request to the Registrar and returns a request number
- **And** The assistant tells the student the expected ready date

*Scenario 2: Document is ready*

- **Given** The student has a document request with status “ready for pickup”
- **When** The student asks “Is my certificate ready?”
- **Then** The assistant confirms the document is ready
- **And** The assistant shows the Registrar office room and working hours for pickup

## Sprint 4 — Campus, feedback and knowledge base

Deadline: **06.11.2026** · 20 points

<a id="us13"></a>
### US13 Campus Navigation & Room Finder

> As a student, staff member, or visitor I want to ask the assistant where a building, room, or service is located and how to get there, so that I find it quickly without getting lost on campus

| | |
|---|---|
| Estimate | 4/10 |
| Quadrant | LC&HV |
| User role | Student, Staff, Visitor |
| Pre-requirements | Story 10 done; campus map data (buildings, floors, rooms, entrances) collected and stored in the Knowledge Base |
| Sprint / deadline | 4 / 06.11.2026 |

**QA test**

*Scenario 1: Finding a room*

- **Given** The user opens the help desk assistant chat
- **When** The user asks “Where is room F305?”
- **Then** The assistant returns the building, floor, and nearest entrance for room F305
- **And** The assistant shows a link to the campus map with the room marked

*Scenario 2: Unknown location*

- **Given** The user opens the help desk assistant chat
- **When** The user asks for a room number that does not exist in the campus map
- **Then** The assistant tells the user the room was not found
- **And** The assistant suggests checking the room number or contacting the information desk

<a id="us14"></a>
### US14 Answer Feedback & Rating

> As a student, staff member, or visitor I want to rate the assistant's answer and leave a short comment, so that wrong or unclear answers are noticed and improved

| | |
|---|---|
| Estimate | 3/10 |
| Quadrant | LC&HV |
| User role | Student, Staff, Visitor |
| Pre-requirements | Story 1 done; feedback storage database available |
| Sprint / deadline | 4 / 06.11.2026 |

**QA test**

*Scenario 1: Rating an answer as not helpful*

- **Given** The assistant has answered the user's question
- **When** The user clicks “not helpful” and writes “the date is wrong”
- **Then** The assistant thanks the user and saves the rating with the comment
- **And** The answer is flagged in the staff review list

*Scenario 2: Rating as a visitor*

- **Given** A visitor uses the assistant without logging in
- **When** The visitor rates an answer as helpful
- **Then** The rating is saved without any personal data
- **And** The visitor can continue asking questions without delay

<a id="us15"></a>
### US15 Help Desk Analytics Dashboard

> As a help desk staff member I want to see a dashboard of the most frequent questions, unanswered queries, escalations, and ratings, so that I can find gaps in the knowledge base and improve the service

| | |
|---|---|
| Estimate | 7/10 |
| Quadrant | HC&HV |
| User role | Staff (Help Desk) |
| Pre-requirements | Stories 3, 4 and 14 done; conversation logs and feedback data stored; staff role-based access available |
| Sprint / deadline | 4 / 06.11.2026 |

**QA test**

*Scenario 1: Viewing weekly statistics*

- **Given** A Help Desk staff member is logged in
- **When** The staff member opens the dashboard and selects “last 7 days”
- **Then** The dashboard shows the top questions, unanswered share, tickets, escalations, and average rating
- **And** All totals match the raw logs for that period

*Scenario 2: Access denied for students*

- **Given** A student is logged into the system
- **When** The student tries to open the dashboard URL
- **Then** Access is denied with a clear message
- **And** No analytics data is shown to the student

<a id="us16"></a>
### US16 Knowledge Base Content Management

> As a help desk staff member I want to add, edit, and archive FAQ and office entries in all three languages without a developer, so that the assistant always gives up-to-date answers

| | |
|---|---|
| Estimate | 6/10 |
| Quadrant | HC&HV |
| User role | Staff (Help Desk) |
| Pre-requirements | Stories 1, 8 and 10 done; Knowledge Base write API available; staff role-based access available |
| Sprint / deadline | 4 / 06.11.2026 |

**QA test**

*Scenario 1: Updating an FAQ answer*

- **Given** A staff member with editor rights is logged in
- **When** The staff member changes the add/drop deadline in the FAQ entry in all three languages and publishes it
- **Then** The assistant returns the new deadline to users within 5 minutes
- **And** The change is saved in the version history with the author and date

*Scenario 2: Missing translation*

- **Given** A staff member edits an entry and fills in only the English version
- **When** The staff member tries to publish the entry
- **Then** The system blocks publishing and shows which language versions are missing
- **And** The previously published version stays active

## Sprint 5 — More student self-service

Deadline: **20.11.2026** · 20 points

<a id="us17"></a>
### US17 Grades & Transcript Lookup

> As a student I want to ask the assistant for my current grades, GPA, and credits earned, so that I can track my academic progress without opening the portal

| | |
|---|---|
| Estimate | 5/10 |
| Quadrant | LC&HV |
| User role | Student |
| Pre-requirements | Story 1 done; user authentication available; read access to the Student Portal API (grades, GPA, credits) |
| Sprint / deadline | 5 / 20.11.2026 |

**QA test**

*Scenario 1: Checking GPA and credits*

- **Given** The student is logged into the help desk assistant
- **When** The student asks “What is my GPA and how many credits do I have?”
- **Then** The assistant returns the current GPA and total credits earned
- **And** The values match the Student Portal record for that student

*Scenario 2: Grade not posted yet*

- **Given** The teacher has not posted the final grade for INF451 yet
- **When** The student asks “What is my grade in INF451?”
- **Then** The assistant informs the student that the grade is not posted yet
- **And** The assistant tells the student the official grade posting deadline

<a id="us18"></a>
### US18 Attendance Tracking & Absence Warnings

> As a student I want to ask the assistant how many classes I have missed in each course and get a warning when I am close to the absence limit, so that I don't fail a course because of attendance

| | |
|---|---|
| Estimate | 4/10 |
| Quadrant | LC&HV |
| User role | Student |
| Pre-requirements | Stories 9 and 11 done; read access to attendance records; absence limit rules available |
| Sprint / deadline | 5 / 20.11.2026 |

**QA test**

*Scenario 1: Checking absences*

- **Given** The student is logged into the help desk assistant
- **When** The student asks “How many classes have I missed in INF451?”
- **Then** The assistant returns the number of absences and the absence limit for INF451
- **And** The numbers match the official attendance records

*Scenario 2: Close to the absence limit*

- **Given** The absence limit in INF451 is 6 classes and the student has missed 4
- **When** The teacher marks one more absence
- **Then** The assistant sends the student a warning that only 1 absence is left before the limit
- **And** The warning names the course and the absence limit

<a id="us19"></a>
### US19 Library Services

> As a student or staff member I want to check book availability, my current loans, and due dates through the assistant, so that I don't miss returns or visit the library for nothing

| | |
|---|---|
| Estimate | 5/10 |
| Quadrant | LC&HV |
| User role | Student, Staff |
| Pre-requirements | Story 1 done; user authentication available; read access to the Library system API (catalog, loans) |
| Sprint / deadline | 5 / 20.11.2026 |

**QA test**

*Scenario 1: Searching for a book*

- **Given** The user opens the help desk assistant chat
- **When** The user asks “Is ‘Clean Code’ available in the library?”
- **Then** The assistant shows how many copies are available and the shelf location
- **And** The data matches the Library system catalog

*Scenario 2: Checking due dates*

- **Given** The user is logged in and has two borrowed books
- **When** The user asks “When do I need to return my books?”
- **Then** The assistant lists both books with their due dates
- **And** Overdue books are clearly marked as overdue

<a id="us20"></a>
### US20 Dormitory & Housing Requests

> As a student living on campus I want to submit a dormitory repair or housing request and track it through the assistant, so that problems in my room are fixed quickly

| | |
|---|---|
| Estimate | 6/10 |
| Quadrant | HC&HV |
| User role | Student |
| Pre-requirements | Stories 3 and 10 done; user authentication available; Housing office request system accessible via API |
| Sprint / deadline | 5 / 20.11.2026 |

**QA test**

*Scenario 1: Submitting a repair request*

- **Given** The student lives in a dormitory and is logged in
- **When** The student writes “The light in my room does not work”
- **Then** The assistant creates a repair request with the student's dormitory and room number
- **And** The assistant returns a request number

*Scenario 2: Checking request status*

- **Given** The student has a repair request with status “in progress”
- **When** The student asks “What is the status of my repair request?”
- **Then** The assistant returns the current status and last update
- **And** The status matches the Housing office system

## Sprint 6 — Campus life and accessibility

Deadline: **04.12.2026** · 16 points

<a id="us21"></a>
### US21 Campus Events & Club Announcements

> As a student, staff member, or visitor I want to ask the assistant about upcoming campus events and student clubs, so that I don't miss activities that interest me

| | |
|---|---|
| Estimate | 4/10 |
| Quadrant | LC&HV |
| User role | Student, Staff, Visitor |
| Pre-requirements | Stories 8 and 13 done; events and clubs list stored in the Knowledge Base |
| Sprint / deadline | 6 / 04.12.2026 |

**QA test**

*Scenario 1: Upcoming events*

- **Given** The user opens the help desk assistant chat
- **When** The user asks “What events are on campus this week?”
- **Then** The assistant lists this week's events with date, time, and place
- **And** Each event has a registration link and a campus map link

*Scenario 2: Finding a club*

- **Given** The user opens the help desk assistant chat
- **When** The user asks “Is there a programming club?”
- **Then** The assistant describes the club and its meeting place
- **And** The assistant shows the club's contact person

<a id="us22"></a>
### US22 Teacher Contact & Office Hours

> As a student I want to ask the assistant for a teacher's email, office hours, and room, so that I can contact them or come to consultation at the right time

| | |
|---|---|
| Estimate | 4/10 |
| Quadrant | LC&HV |
| User role | Student |
| Pre-requirements | Stories 9 and 10 done; teacher directory (names, courses, emails, office hours, rooms) stored in the Knowledge Base |
| Sprint / deadline | 6 / 04.12.2026 |

**QA test**

*Scenario 1: Office hours by course*

- **Given** The student is logged into the help desk assistant
- **When** The student asks “When are office hours for my INF451 teacher?”
- **Then** The assistant finds the teacher from the student's schedule
- **And** The assistant shows the teacher's email, room, and office hours

*Scenario 2: Unknown teacher*

- **Given** The user opens the help desk assistant chat
- **When** The user asks about a teacher name that is not in the directory
- **Then** The assistant tells the user the teacher was not found
- **And** The assistant suggests contacting the faculty dean's office

<a id="us23"></a>
### US23 Conversation History

> As a student or staff member I want to see my previous conversations with the assistant, so that I can find an earlier answer without asking again

| | |
|---|---|
| Estimate | 3/10 |
| Quadrant | LC&HV |
| User role | Student, Staff |
| Pre-requirements | User authentication available; conversation logs stored per authenticated user |
| Sprint / deadline | 6 / 04.12.2026 |

**QA test**

*Scenario 1: Opening a past conversation*

- **Given** The user is logged in and asked about the add/drop deadline last week
- **When** The user opens the history and searches “add/drop”
- **Then** The assistant shows the conversation from last week
- **And** The full conversation opens with all messages

*Scenario 2: Visitor without login*

- **Given** A visitor uses the assistant without logging in
- **When** The visitor tries to open the history
- **Then** The assistant explains that history is available only after login
- **And** No previous conversations are shown

<a id="us24"></a>
### US24 Accessibility & Voice Input

> As a user with visual or motor impairments I want to ask questions by voice and use the chat with a screen reader and larger text, so that I can get help as easily as everyone else

| | |
|---|---|
| Estimate | 5/10 |
| Quadrant | LC&HV |
| User role | Student, Staff, Visitor |
| Pre-requirements | Stories 1 and 8 done; speech-to-text service supporting EN/KK/RU available |
| Sprint / deadline | 6 / 04.12.2026 |

**QA test**

*Scenario 1: Asking by voice*

- **Given** The user opens the chat and presses the microphone button
- **When** The user says “Where is the library?” in Russian
- **Then** The assistant shows the recognized text and sends it
- **And** The assistant answers in Russian with the library location

*Scenario 2: Large text mode*

- **Given** The user turns on large text and high-contrast mode
- **When** The user asks a question
- **Then** The answer is shown in the larger text size and high contrast
- **And** All buttons remain visible and usable

## Sprint 7 — Campus services and privacy

Deadline: **18.12.2026** · 16 points

<a id="us25"></a>
### US25 Lost & Found

> As a student, staff member, or visitor I want to report a lost or found item through the assistant and check if my item was found, so that lost things return to their owners faster

| | |
|---|---|
| Estimate | 4/10 |
| Quadrant | LC&HV |
| User role | Student, Staff, Visitor |
| Pre-requirements | Stories 3 and 10 done; found-items list available to Help Desk staff |
| Sprint / deadline | 7 / 18.12.2026 |

**QA test**

*Scenario 1: Reporting a lost item*

- **Given** The user opens the help desk assistant chat
- **When** The user writes “I lost a black backpack in the canteen yesterday”
- **Then** The assistant creates a lost-item request with item, place, and date
- **And** The assistant returns a request number

*Scenario 2: Item was found*

- **Given** Staff added a black backpack found in the canteen to the found-items list
- **When** The user checks the status of their lost-item request
- **Then** The assistant tells the user a matching item was found
- **And** The assistant shows the office, room, and hours to collect it

<a id="us26"></a>
### US26 Canned Replies for Live Chat

> As a help desk staff member I want to insert ready-made reply templates in all three languages during a live chat, so that I answer typical questions faster and consistently

| | |
|---|---|
| Estimate | 3/10 |
| Quadrant | LC&HV |
| User role | Staff (Help Desk) |
| Pre-requirements | Stories 4 and 16 done; staff role-based access available |
| Sprint / deadline | 7 / 18.12.2026 |

**QA test**

*Scenario 1: Inserting a template*

- **Given** A staff member is in a live chat with a Russian-speaking student
- **When** The staff member searches “password” and selects the password-reset template
- **Then** The template is inserted in Russian into the message field
- **And** The staff member can edit it before sending

*Scenario 2: Creating a template*

- **Given** A staff member opens the template editor
- **When** The staff member fills in the template in all three languages and saves it
- **Then** The template appears in the template list
- **And** The template is available in live chats immediately

<a id="us27"></a>
### US27 Study Room Booking

> As a student I want to book a study room or library space through the assistant, so that I have a quiet place for group work without going there to check

| | |
|---|---|
| Estimate | 5/10 |
| Quadrant | LC&HV |
| User role | Student |
| Pre-requirements | Stories 13 and 19 done; user authentication available; room booking system accessible via API |
| Sprint / deadline | 7 / 18.12.2026 |

**QA test**

*Scenario 1: Booking a room*

- **Given** The student is logged in and room L-204 is free tomorrow 14:00–16:00
- **When** The student asks to book a room for 4 people tomorrow at 14:00
- **Then** The assistant offers room L-204 and books it after confirmation
- **And** The student receives a confirmation with room, time, and map link

*Scenario 2: Room already taken*

- **Given** Two students try to book the same room for the same time
- **When** The second booking request is processed
- **Then** The assistant informs the second student the room is no longer free
- **And** The assistant offers another free room or time

<a id="us28"></a>
### US28 Personal Data Privacy Controls

> As a student or staff member I want to view and delete my stored conversations and personal data, so that I control my privacy in line with data protection law

| | |
|---|---|
| Estimate | 4/10 |
| Quadrant | LC&HV |
| User role | Student, Staff |
| Pre-requirements | Story 23 done; user authentication available; data retention policy approved |
| Sprint / deadline | 7 / 18.12.2026 |

**QA test**

*Scenario 1: Deleting history*

- **Given** The user is logged in and has saved conversations
- **When** The user opens “My data”, chooses “Delete history” and confirms
- **Then** All the user's conversations are deleted
- **And** The history panel is empty

*Scenario 2: Cancelling deletion*

- **Given** The user is logged in and has saved conversations
- **When** The user chooses “Delete history” and then presses Cancel
- **Then** No conversations are deleted
- **And** The history stays unchanged

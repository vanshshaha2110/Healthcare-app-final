# Healthcare Chatbot — Phase 2: Real Backend (No Auth Yet)

## Folder structure
```
healthcare-backend/
├── backend-spring/     → Java/Spring Boot API (port 8080)
├── backend-python/     → FastAPI + Gemini service (port 8001)
└── database/schema.sql → PostgreSQL tables (Spring can also auto-create these)
```

No Firebase anywhere in this phase. Every request is treated as one fixed
demo user (`user_id = 1`). We'll add real auth in Phase 3.

---

## Step 1 — Set up PostgreSQL

Easiest option for a beginner: create a **free** database at
https://neon.tech or https://supabase.com (2 minutes, no install needed).
Copy the connection details they give you.

Or install Postgres locally and run:
```bash
createdb healthcare_db
psql healthcare_db < database/schema.sql
```

Then open `backend-spring/src/main/resources/application.properties` and
update these three lines with your real values:
```
spring.datasource.url=jdbc:postgresql://<host>:5432/<dbname>
spring.datasource.username=<user>
spring.datasource.password=<password>
```
(If you skip running `schema.sql` manually, that's fine — Spring Boot will
auto-create the tables from the Java entity classes on first run.)

## Step 2 — Get a Gemini API key

1. Go to https://aistudio.google.com/app/apikey → create a free key.
2. In `backend-python/`, copy `.env.example` → `.env` and paste your key in.

## Step 3 — Run the Python AI service

```bash
cd backend-python
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```
Open http://localhost:8001/docs — FastAPI gives you a free interactive UI.
Test `/explain-term` and `/symptom-checker` right there before touching Java.

If you'll test document upload with PDFs, also install poppler:
- Mac: `brew install poppler`
- Ubuntu: `sudo apt install poppler-utils`
- Windows: download poppler binaries and add to PATH
(Not needed for image uploads — only PDFs.)

## Step 4 — Run the Spring Boot backend

You need Java 17+ and Maven installed.
```bash
cd backend-spring
mvn spring-boot:run
```
(No `mvnw` wrapper included here — if you don't have Maven installed,
download it from https://maven.apache.org/download.cgi, or open the
`backend-spring` folder in IntelliJ/VS Code, which can run it for you
without a separate Maven install.)

Runs on http://localhost:8080. Make sure Postgres (Step 1) and the Python
service (Step 3) are both running first.

## Step 5 — Connect it to your React frontend

Go back to your `healthcare-ui` (Phase 1) project and, one component at a
time, replace the mock function calls in `mockData.js` with real ones. For
example, in `SymptomChecker.jsx`, instead of:
```js
const res = await fakeCheckSymptoms(symptoms);
```
do:
```js
const res = await fetch("http://localhost:8080/api/symptom-checker", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ symptoms }),
}).then(r => r.json());
```
Start with symptom checker (simplest), then explain-term/chat, then
reminders/doctors (plain CRUD, no AI), and save document upload for last
since it's the most complex (file handling).

---

## Endpoints available now

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/documents/upload` | Upload + analyze prescription/report (multipart: `file`, `documentType`) |
| GET | `/api/documents` | List uploaded documents |
| POST | `/api/symptom-checker` | `{ "symptoms": "..." }` → possible conditions + urgency |
| POST | `/api/explain-term` | `{ "term": "..." }` → plain-English explanation |
| POST | `/api/chat` | `{ "message": "..." }` → chatbot reply (history saved in DB) |
| GET | `/api/chat/history` | Full chat history |
| POST | `/api/reminders` | Create a reminder |
| GET | `/api/reminders` | List active reminders |
| PUT | `/api/reminders/{id}/deactivate` | Stop a reminder |
| GET | `/api/doctors/recommend?specialty=X&city=Y` | Search doctors |

## What's next (Phase 3)
- Add Firebase Auth to React (real login/signup)
- Add back `FirebaseAuthFilter` + `SecurityConfig` in Spring Boot to verify
  tokens and replace the hardcoded `user_id = 1` with the real logged-in user
- Switch file uploads to Firebase Storage instead of passing raw bytes through

# recip_backend

## Project Overview

Backend API for a driving school management platform (RECIP 360 ATC). Handles courses, students, instructors, tests, assessments, attendance, scheduling, and user management.

## Tech Stack

- **Runtime**: Node.js v18+ (ES Modules: `"type": "module"`)
- **Framework**: Express 4.21
- **ORM**: Sequelize 6.37 with mysql2 (MySQL)
- **Validation**: Joi 17
- **Auth**: JWT + bcryptjs
- **File Uploads**: Multer (in-memory) + Cloudinary
- **Email**: Nodemailer
- **Migrations**: Sequelize CLI
- **Linting**: ESLint 9

## Architecture

```
Routes (route/) → Controllers (controller/) → Repositories (database/repositories/) → Models (database/models/) → Sequelize → MySQL
                                                     ↑
                                            Joi Schemas (database/imput_validation/)
```

Migration files live in `migrations/` (`.cjs` — CommonJS for CLI compat) and seeders in `seeders/`.

**Key paths:**
- `index.js` — Application entry point, starts server + syncs DB
- `src/app.js` — Express app setup, middleware, route mounting
- `src/controller/` — Route handlers with business logic
- `src/database/models/index.js` — Central model initializer (imports all model loaders + exports models object)
- `src/database/models/` — One file per DB table, model definitions
- `src/database/associations.js` — All model relationships (exported `setupAssociations(models)`)
- `src/database/repositories/` — Data access layer (Sequelize queries)
- `src/database/repositories/instructor.js` — Shared helper for instructor-based filtering (used by course, courseGroup, assessment, test, attendance repositories)
- `src/database/repositories/testReport.js` — Read-only exam reports (question sheets, correct answers, per-attempt responses, student results)
- `src/database/imput_validation/` — Joi schemas (note: typo in directory name "imput")

## Database

MySQL with `underscored: true` naming (snake_case columns/timestamps). Sequelize sync runs at startup (`force: false, alter: false`). Schema versioning via CLI migrations.



## SKILLS

Always use the skills in .opencode\skills\recip-backend

### Models (37 models across tables)

**User domain:** User, UserGroup, UserPermission, UserDocType, Student, Instructor, UserSuggestion, Group, GroupPermission

**Course domain:** Course, CourseType, CourseLevel, CourseStudent, CourseStudentTest, CourseStudentTestQuestion, CourseStudentTestAnswer, CourseGroup, CourseGroupSignature

**Assessment domain:** CourseStudentAssessment, CourseStudentAssessmentDay, CourseStudentAssessmentLessonDetail, AssessmentSignature

**Subject domain:** Subject, SubjectDays, SubjectLesson, SubjectLessonDays

**Test domain:** Test, QuestionType, TestQuestionType, Question, Answer

**Other:** Schedule, Attendance, AttendanceStatus, AttendanceSignature, Module, Permission, EmailHistory

**Disconnected (defined but no associations):** Participant, Evaluation, Rating

## Days vs. Sessions (cursos programados)

A scheduled course works in one of two modes, discriminated by `course.uses_sessions`. Existing
rows are never reinterpreted: every course with `uses_sessions = 0` behaves exactly as before.

| | `uses_sessions = 0` (legacy, default) | `uses_sessions = 1` |
|---|---|---|
| Ordinal in `subject_days.day`, `attendance.day`, `course_group_signature.day_number` | day number | **session number** |
| Program ceiling | `course.days` | `course.sessions` |
| Ordinal ↔ calendar date | 1 session per day | **N sessions may share a date** |
| `POST /api/attendance` validation | `day` required, `day <= course.days` | `session_number` required, `session_number <= course.sessions` |

Rules to respect when touching this domain:

- **There are no `session_number` columns in the DB.** The ordinal lives in the pre-existing
  `day` / `day_number` columns. `session_number` is an input/output alias that the backend maps
  onto them, so the API can speak "sesiones" without duplicating the value.
- `course.sessions` is backfilled from `course.days` and defaulted to `days` on create/update, so
  it is never `NULL`. The **flag** is the discriminator, not the `NULL` — never add NULL fallbacks.
- Attendance uniqueness is `(course_student_id, date, day)`, not `(course_student_id, date)`,
  which is what allows several sessions on one calendar date.
- `schedule` has **no** unique constraint, so several schedules on the same date were always
  accepted server-side; any 1-per-day assumption lives in the frontend, not here.
- Single source of truth for the program ceiling: `getCourseProgramSizeByCourseStudent()` in
  `src/database/repositories/course.js` → `{ uses_sessions, days, sessions, total }`. Do not read
  `course.days` directly for a ceiling check.
- Migrations `20260927000000-add-sessions-to-course.cjs` and
  `20260927000001-relax-attendance-unique-date.cjs` add real columns, and startup `sync` uses
  `alter: false`, so **the migrations must be run before deploying** this code.

See the "Días vs. Sesiones" section of `CONTRACTS.md` for the full endpoint matrix.

## API Routes

| Prefix | Purpose |
|--------|---------|
| `/auth` | Login (public) |
| `/api/users` | User/student/instructor CRUD |
| `/api/users/student/search` | Fast student search by name/email |
| `/api/courses` | Course + enrollment + schedule CRUD (includes `instructor_id` filter on `coursesStudents`). `DELETE /schedule/:id` borra un schedule **y en cascada** su `attendance` + `attendance_signature` (match `course_student_id` + `date` + `subject_days.day`); `DELETE /schedule/course-student/:course_student_id` borra todos los schedules del alumno con la misma cascada (solo los pares `(date, day)` que tenían schedule). Ambos en una transacción. |
| `/api/course_groups` | Course groups CRUD + students list + remove students + signature upload + list signatures per group + `GET /report/attendance` (attendance/signature report grouped by group with students/user, course, schedules/instructors). Supports `instructor_id` filter. |
| `/api/subjects` | Subject + lessons + days CRUD |
| `/api/assessment` | Student assessments + signatures |
| `/api/test` | Tests, questions, answers, Excel/CSV import |
| `/api/test/reports` | Reportes de examen **solo lectura**: listar exámenes, hoja de preguntas con la correcta marcada, solo correctas, detalle/respuestas/preguntas sorteadas por intento de alumno, y resultado global por alumno (paginado, `pageSize=-1` = todos). Repositorio dedicado: `src/database/repositories/testReport.js` |
| `/api/attendance` | Attendance + statuses CRUD + signature upload + delete signature. Supports `instructor_id` filter. |
| `/api/instructor` | Instructor dashboard: schedules, assessments, tests filtered by instructor_id |
| `/api/suggestions` | User suggestions CRUD |
| `/api/module` | List modules (public) |
| `/api/group` | List groups (public) |
| `/api/permission` | List permissions (public) |
| `/api/rating` | List ratings (public) |
| `/api/config` | Run seeds/triggers (public) |
| `/api/mail` | Send email (public) |
| `/api/email_history` | Email history CRUD (list, create, delete) |
| `/status` | Health check (public) |

## Endpoint Contracts

`CONTRACTS.md` (repo root) is the **single source of truth** for the exact request/response shape of every endpoint. It must be kept in sync with the code.

- **Every endpoint** is documented there: method, path, auth, query/params/body, response shape with exact JSON keys, and error formats.
- **Response JSON keys are exact and contractual.** The key for an included model is the Sequelize association alias. If an association has no `as:`, the key is the default snake_case plural alias (e.g. `course_student_assessment_days`), which is **not** what the frontend expects.
- **Always define an explicit `as:`** on associations whose results are exposed via includes, and document that alias in `CONTRACTS.md` (lesson learned: `CourseStudentAssessment.hasMany(CourseStudentAssessmentDay)` broke printing/email because the implicit alias `course_student_assessment_days` did not match the contracted `CourseStudentAssessmentDays`).
- Any change to a route, controller, repository include, or model alias that affects a request/response **must** update `CONTRACTS.md` in the same change.

## Middleware Stack

1. Morgan logging
2. URL-encoded + JSON body parsers
3. CORS (configurable origins)
4. DB health check (blocks requests if DB disconnected)
5. Per-route: `authenticateJWT`, `convertTypes`, Multer uploads

## Commands

- `npm run migrate` — Run pending migrations
- `npm run migrate:undo` — Undo last migration
- `npm run seed` — Run all seeders
- `npm run seed:undo` — Undo last seeder
- `npm test` — No test suite configured
- `npm run migrate:generate` — Generate new migration file
- `npm run lint` — Run ESLint

Lint with `npx eslint .`

> ⚠️ **Migration Policy**: Only the project owner should run migrations. Agents may create migration files, but must NOT execute `npm run migrate` or `npm run migrate:undo`. The owner will review and run all migrations manually.

## Coding Conventions

- All source is ES Modules (`import`/`export`). Migration/seeders use CommonJS (`.cjs`).
- DB columns use snake_case (auto-converted by Sequelize `underscored: true`).
- Models define table schema + indexes. Relationships go in `associations.js`, not in model files.
- Repositories abstract all DB queries. Controllers call repositories, never models directly.
- Input validation uses Joi schemas in `src/database/imput_validation/`.
- Error responses follow: `res.status(code).json({ message: '...', error: ... })`.
- File uploads: Multer middleware parses multipart (in-memory), controller sends to Cloudinary. No local disk storage.

## Self-Update Requirement

When you make changes that affect the project structure (new routes, models, dependencies, or architectural changes), you **must** update this `AGENTS.md` file to reflect those changes. This file is the single source of truth for all future agent sessions.

Additionally, any change that alters an endpoint's request/response (routes, controllers, repository includes, association aliases) **must** update `CONTRACTS.md`; a stale contract is a defect.

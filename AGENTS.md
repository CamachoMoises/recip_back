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
- `src/database/imput_validation/` — Joi schemas (note: typo in directory name "imput")

## Database

MySQL with `underscored: true` naming (snake_case columns/timestamps). Sequelize sync runs at startup (`force: false, alter: false`). Schema versioning via CLI migrations.



## SKILLS

Always use the skills in .opencode\skills\recip-backend

### Models (34 models across tables)

**User domain:** User, UserGroup, UserPermission, UserDocType, Student, Instructor, UserSuggestion, Group, GroupPermission

**Course domain:** Course, CourseType, CourseLevel, CourseStudent, CourseStudentTest, CourseStudentTestQuestion, CourseStudentTestAnswer, CourseGroup

**Assessment domain:** CourseStudentAssessment, CourseStudentAssessmentDay, CourseStudentAssessmentLessonDetail

**Subject domain:** Subject, SubjectDays, SubjectLesson, SubjectLessonDays

**Test domain:** Test, QuestionType, TestQuestionType, Question, Answer

**Other:** Schedule, Attendance, AttendanceStatus, Module, Permission

**Disconnected (defined but no associations):** Participant, Evaluation, Rating

## API Routes

| Prefix | Purpose |
|--------|---------|
| `/auth` | Login (public) |
| `/api/users` | User/student/instructor CRUD |
| `/api/users/student/search` | Fast student search by name/email |
| `/api/courses` | Course + enrollment + schedule CRUD |
| `/api/course-groups` | Course groups CRUD + students list + remove students + signature upload |
| `/api/subjects` | Subject + lessons + days CRUD |
| `/api/assessment` | Student assessments + signatures |
| `/api/test` | Tests, questions, answers, Excel/CSV import |
| `/api/attendance` | Attendance + statuses CRUD + signature upload |
| `/api/suggestions` | User suggestions CRUD |
| `/api/module` | List modules (public) |
| `/api/group` | List groups (public) |
| `/api/permission` | List permissions (public) |
| `/api/rating` | List ratings (public) |
| `/api/config` | Run seeds/triggers (public) |
| `/api/mail` | Send email (public) |
| `/status` | Health check (public) |

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

---
name: recip-backend
description: Driving school management API — project context, tech stack, architecture, and conventions for recip_backend
---

# recip_backend

Backend API for RECIP 360 ATC driving school management platform (courses, students, instructors, tests, assessments, attendance, scheduling, users).

## Quick Reference

- **Stack**: Node.js (ESM), Express 4.21, Sequelize 6.37 + MySQL, Joi 17, JWT + bcryptjs, Multer + Cloudinary
- **Pattern**: Routes → Controllers → Repositories → Models (Sequelize ORM)
- **DB naming**: `underscored: true` (snake_case columns/timestamps)
- **Module system**: ES Modules for src, CommonJS (`.cjs`) for migrations/seeders
- **Sync**: `sequelize.sync({ force: false, alter: false })` at startup

## Project Layout

```
config/database.cjs       # Sequelize CLI config (CommonJS)
migrations/               # .cjs files
seeders/                  # .cjs files
src/
  app.js                  # Express setup, middleware, routes
  controller/             # Route handlers
  database/
    associations.js       # All model relationships
    connection.js         # Sequelize instance
    models/index.js       # Central model initializer
    models/               # One file per DB table
    repositories/         # Data access layer
    imput_validation/     # Joi schemas (typo in dir name)
  middleware/
    convertTypes.js       # String→boolean/number coercion
    dbHealth.js           # Blocks requests if DB disconnected
  route/                  # Express routers
  services/
    logger.js             # File + console logger
    mailService.js        # Nodemailer wrapper
index.js                  # Entry point
```

## All 33 Models

| Domain | Models |
|--------|--------|
| User | User, UserGroup, UserPermission, UserDocType, Student, Instructor, UserSuggestion, Group, GroupPermission |
| Course | Course, CourseType, CourseLevel, CourseStudent, CourseStudentTest, CourseStudentTestQuestion, CourseStudentTestAnswer |
| Assessment | CourseStudentAssessment, CourseStudentAssessmentDay, CourseStudentAssessmentLessonDetail |
| Subject | Subject, SubjectDays, SubjectLesson, SubjectLessonDays |
| Test | Test, QuestionType, TestQuestionType, Question, Answer |
| Other | Schedule, Attendance, AttendanceStatus, Module, Permission |
| Disconnected | Participant, Evaluation, Rating |

## Routes

| Prefix | Auth | Purpose |
|--------|------|---------|
| `/auth` | No | Login |
| `/api/users` | Yes | User/student/instructor CRUD |
| `/api/courses` | Yes | Course + enrollment + schedule CRUD |
| `/api/subjects` | Yes | Subject + lessons + days CRUD |
| `/api/assessment` | Yes | Assessments + signatures |
| `/api/test` | Mostly Yes | Tests, questions, answers, Excel/CSV import |
| `/api/attendance` | Yes | Attendance + statuses |
| `/api/suggestions` | Yes | User suggestions |
| `/api/module`,`/api/group`,`/api/permission`,`/api/rating` | No | List lookups |
| `/api/config` | No | Run seeds/triggers |
| `/api/mail` | No | Send email |
| `/status` | No | Health check |

## Commands

```
npm run migrate         # Run pending migrations
npm run migrate:undo    # Undo last migration
npm run seed            # Run seeders
npm run seed:undo       # Undo last seeder
npx eslint .            # Lint
```

## Conventions

- ES Modules for src; CommonJS (`.cjs`) for migrations/seeders
- Models define schema + indexes only. All relationships in `associations.js`.
- Repositories abstract all DB queries. Controllers never call models directly.
- Joi schemas validate input in controllers. Error: `{ message, error }`.
- File uploads: Multer (in-memory) → Cloudinary.

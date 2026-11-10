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

### Models (38 models across tables)

**User domain:** User, UserGroup, UserPermission, UserDocType, Student, Instructor, UserSuggestion, Group, GroupPermission

**Course domain:** Course, CourseType, CourseLevel, CourseStudent, CourseStudentTest, CourseStudentTestQuestion, CourseStudentTestAnswer, CourseGroup, CourseGroupSignature, CourseTest (puente examen ↔ curso)

**Assessment domain:** CourseStudentAssessment, CourseStudentAssessmentDay, CourseStudentAssessmentLessonDetail, AssessmentSignature

**Subject domain:** Subject, SubjectDays, SubjectLesson, SubjectLessonDays

**Test domain:** Test, QuestionType, TestQuestionType, Question, Answer, CourseTest (puente curso↔examen)

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
- `schedule` has **no** date-based unique constraint, so several schedules on the same date were
  always accepted server-side; any 1-per-day assumption lives in the frontend, not here. It does
  have `uq_schedule_course_student_subject_days` UNIQUE `(course_student_id, subject_days_id)`:
  one schedule per program activity (subject + ordinal) per student.
- Single source of truth for the program ceiling: `getCourseProgramSizeByCourseStudent()` in
  `src/database/repositories/course.js` → `{ uses_sessions, days, sessions, total }`. Do not read
  `course.days` directly for a ceiling check.
- Migrations `20260927000000-add-sessions-to-course.cjs`,
  `20260927000001-relax-attendance-unique-date.cjs` and
  `20261031000000-add-unique-schedule-course-student-subject-days.cjs` add real columns/indexes,
  and startup `sync` uses `alter: false`, so **the migrations must be run before deploying** this
  code.

### Anti-duplicate scheduling rules

- `POST /api/courses/schedule` validates that `subject_days_id` belongs to the student's course,
  matches `subject_id`, is **active** (`subject_days.status = 1`), is not already scheduled for
  that student, and that the student has no schedule for the same subject on an inactive
  `subject_days` (orphan). Violations return `400`/`409` JSON `{ message }`.
- **La misma actividad SÍ puede agendarse en varios días/sesiones del programa**: el único
  duplicado es el mismo `subject_days_id` (índice único
  `uq_schedule_course_student_subject_days`). Si añades validaciones, no bloquees por
  `subject_id` a secas.
- **Alias de asociación (trampa que costó un bug)**: `Schedule.belongsTo(SubjectDays)` no declara
  `as`, así que Sequelize expone el día como **`subject_day`** (singular), no como
  `SubjectDays`. Escribir `schedule.SubjectDays.status`/`?.day` daba siempre `undefined`: el
  validador marcaba como "día inactivo" cualquier horario previo y bloqueaba agendar la misma
  actividad en un segundo día; además `buildSessionPairs` devolvía `null` y el borrado de
  horarios nunca limpiaba asistencias. Afecta a `course.js` (`assertScheduleIsValid`,
  `buildSessionPairs`) e `instructor.js` (días por grupo).
- `POST /api/subjects/subjects_days` (and `subjects_lesson_days`) refuses to **deactivate** a
  `subject_days` that still has schedules (`409` JSON). Deactivating a day used by a schedule left
  an orphan schedule invisible in the UI and allowed the same activity to be scheduled twice.
- Repository guards: `createSchedule` in `src/database/repositories/course.js` and
  `updateSubjectDay` in `src/database/repositories/subject.js`.

See the "Días vs. Sesiones" section of `CONTRACTS.md` for the full endpoint matrix.

## Soft delete de curso (`course.status`)

Eliminar un curso es un soft delete **reversible** sobre el flag que ya existía:
**eliminado ⇔ `course.status = false` (`0`)**. No hay `paranoid`, ni borrado físico, ni cascada.
`deleted_at` / `deleted_by` son **solo auditoría** de la eliminación vigente: ninguna query
depende de ellos y se limpian al reactivar.

**Regla de oro:** `course.status` decide si puedes **crear cosas nuevas** en el curso, **no** si
puedes **ver o cerrar** lo que ya existe. Por eso el historial nunca se filtra por el curso.

- Helper único: `assertCourseIsActive(course_id)` en `src/database/repositories/course.js`
  (`error.status = 404` si no existe, `409` si está eliminado). Los controllers lo mapean a
  `res.status(error.status).json({ message })`.
- **Endpoints de ciclo de vida:**
  - `DELETE /api/courses/:id` → `softDeleteCourse(id, req.user.id)`: `status = false`,
    `deleted_at = now`, `deleted_by = req.user.id` (INTEGER sin FK). Idempotente. `404` JSON si
    no existe.
  - `POST /api/courses/:id/restore` → `restoreCourse(id)`: `status = true` y limpia
    `deleted_at`/`deleted_by`. Idempotente. `404` JSON si no existe.
  - `PUT /api/courses` con `status: false|true` delega en la misma semántica de auditoría
    (`editCourse` recibe `deleted_by`); omitir `status` no toca la auditoría.
- **Bloquean (409):** matrícula (`POST /api/courses/courseStudent/:course_id`), `POST
  /api/courses/schedule`, programa (`POST/PUT /api/subjects`, `/lesson`, `subjects_days`,
  `subjects_lesson_days` vía `ChangeStatusDayFunc`), definición de examen (`POST /api/test`),
  inicio de intento (`POST /api/test/courseStudentTest`), evaluación (`POST
  /api/assessment/createCourseStudentAssessment`) y grupos (`POST /api/course_groups`).
- **No se filtran ni bloquean:** `GET /coursesStudents`, `GET /course/:id`, reportes, dashboards de
  instructor (`course_student.status`), `POST/PUT /attendance`, `PUT /schedule`, firmas y `DELETE`
  de hijos (sirven para cerrar el ciclo).
- `POST /api/courses` ignora `status` y siempre crea activo. `cloneCourse` no hereda el soft delete
  (`status: overrides.status ?? true`) y no copia la auditoría.
- `PUT /api/courses` es parcial-safe: omitir `uses_sessions`/`sessions` conserva el modo y el techo
  actuales (no colapsa el programa); `status: false|true` elimina/reactiva.
- No mezclar los tres `status`: `course.status` (curso), `course_student.status` (matrícula) y
  `subject_days.status` (actividad).

**Migración obligatoria antes de desplegar:** `migrations/20261101000000-add-soft-delete-to-course.cjs`
agrega `deleted_at`/`deleted_by`, el índice `idx_course_status` y normaliza `status NULL → 1`.
El modelo ya declara esas columnas y `sync` corre con `alter: false`, así que **sin `npm run migrate`
los SELECT sobre `course` fallan**. Es idempotente.

Fase 3 (`include_inactive` en `GET /api/courses`) implementada: el listado **oculta los cursos
eliminados por defecto** y el front debe pedir `GET /api/courses?include_inactive=true` en la
pantalla de configuración para verlos y reactivarlos. Sin ese flag un curso eliminado quedaría
inalcanzable en la UI. `GET /api/courses/course/:id` y `GET /api/courses/coursesStudents` siguen
sin filtrar (historial y ficha del curso).

**Fase 4 (front):** instrucciones exactas en `FRONT_SOFT_DELETE_CURSO.md` (tipos, thunks
`deleteCourse`/`restoreCourse`, `include_inactive` solo en configuración, quitar el switch de
`status` del modal y manejar `error.response.data.message`).

## Orden de cursos (`course.row_order`)

El orden de presentación de cursos es manual, igual que `subject.order`, pero **global** (la lista
de cursos no cuelga de otro registro).

- Columna `course.row_order` (INT NOT NULL, 1..N). Se llama `row_order` y no `order` para no
  depender de comillas en SQL crudo (`ORDER` es palabra reservada en MySQL).
- `GET /api/courses` ordena **`row_order ASC, id ASC`** (el `id` es el desempate determinista).
- `POST /api/courses` y `POST /clone/:course_id` agregan al final (`MAX(row_order) + 1`) e
  **ignoran** `row_order` del body (el controller lo descarta antes de Joi).
- `PUT /api/courses` **no** reordena: `row_order` se descarta antes de Joi.
- `PUT /api/courses/order` con `{ ids: [..] }` reasigna `1..N` en una transacción. Duplicados o no
  numéricos → `400` JSON; id inexistente → `404` JSON; los ids faltantes se agregan al final.
  Devuelve el listado completo (con eliminados) ya ordenado.
- `DELETE /:id` y `POST /:id/restore` **no** tocan `row_order`: al reactivar, el curso vuelve a su
  posición original. Los cursos eliminados participan del orden.
- Helper `reorderCourses(ids)` en `src/database/repositories/course.js`.
- El índice `idx_course_row_order` se crea **solo en la migración**, no en el modelo: `sync`
  (`alter: false`) procesa los `indexes` declarados y un `CREATE INDEX` sobre una columna
  inexistente rompería el arranque si falta migrar.

**Migración obligatoria antes de desplegar:** `migrations/20261201000000-add-row-order-to-course.cjs`
(agrega la columna NOT NULL con backfill `id ASC` 1..N + índice). Sin ella, cualquier SELECT sobre
`course` falla con `Unknown column 'course.row_order'`.

Instrucciones de front: `FRONT_ORDEN_CURSOS.md`.

## Horas totales del curso (`course.hours`)

`course.hours` es un valor **derivado**: nunca se toma del body (`POST /` y `PUT /` descartan
`hours`). Lo calcula `calculateCourseTotalHours(course_id)` en `src/controller/course.js` y lo
persiste con `updateCourseHours`.

- **`course_type_id = 2` ("Entrenamiento")**: `8 × tamaño del programa`, donde el tamaño es
  `uses_sessions ? (sessions ?? days) : days`.
  - No multiplicar por cada `subject_days`: un mismo día/sesión puede tener varias fases
    (Briefing, Vuelo, Debriefing, ...) y contarlas inflaba el total (curso 29: 25 actividades × 8
    = 200 h para un programa de 3 días; el valor correcto es 24 h).
- **Excepción "Experiencia Reciente" (nivel 4)**: cursos tipo 2 con `course_level_id = 4` son
  experiencias cortas (PIC/PI, 1 día) cuya carga real la definen las fases, no una jornada
  completa. Usan `Σ(subject.hours × días activos)` (curso 23: Briefing 1h + Vuelo 1h +
  Debriefing 1h = **3 h**, no 8 × 1). Cursos 23 y 24 son los únicos con ese nivel.
- **Resto de tipos**: `Σ(subject.hours × días activos)` de cada sección.
- Se recalcula al **crear/editar/clonar** curso y al **crear/editar/desactivar** `subject_days`
  (`ChangeStatusDayFunc`) o editar `subject.hours` (`UpdateSubject`). Los llamados se hacen con
  `await` para que la respuesta ya lleve las horas nuevas.
- En `PUT /api/courses` los alias legacy `type`/`level`, los objetos `course_type.id`/
  `course_level.id` y los `course_type_id`/`course_level_id` son aceptados; solo se asigna si el
  valor existe. Claves desconocidas se descartan (`stripUnknown`) para permitir que el front reenvíe
  el curso completo solo para recalcular `hours`.

**Migraciones de datos (manuales):** `migrations/20261103000000-recalculate-training-course-hours.cjs`
recalcula los cursos tipo 2 existentes con la regla de `8 × tamaño` (idempotente, solo toca
`course_type_id = 2`). `migrations/20261204000000-recalculate-experience-recent-course-hours.cjs`
recalcula los "Experiencia Reciente" (`course_type_id = 2` + `course_level_id = 4`) con la suma de
secciones. Correr `npm run migrate` para corregir filas ya guardadas con las fórmulas viejas.

## Exámenes compartidos (`course_test`)

**Fases 1, 2, 3 y 4 implementadas** (esquema + lecturas por vínculo + autoría normalizada +
ciclo de vida de vínculos). Un `test` puede estar vinculado a N cursos de teoría
(`course_type_id = 1`) mediante la tabla puente `course_test (course_id, test_id)`.

- `test.course_id` sigue siendo el **curso dueño** (autoría). No se hace nullable ni se elimina.
- `course_test` tiene `id` propio, `created_at`/`updated_at` y UNIQUE `(course_id, test_id)`.
- Alias de asociaciones (definidos explícitamente):
  - `Course.tests` (`belongsToMany`, through `CourseTest`): exámenes **vinculados** al curso.
  - `Course.owned_tests` (`hasMany` por `test.course_id`): exámenes **creados** por el curso.
  - `Test.courses` (`belongsToMany`): cursos vinculados al examen.
  - `Test.course`: curso dueño.
- `GET /api/courses/courseStudent/:id` conserva la clave `course.tests`, pero ahora resuelve por
  vínculo (backfill: cada test vinculado a su curso actual) y excluye los atributos del puente con
  `through: { attributes: [] }`.
- `GET /api/test/tests/:course_id` (`getAllTestCourse`) filtra por `course_test` e incluye
  `course` (dueño), `courses` (vinculados: `id, name, code, color`) e `is_shared`.
- `GET /api/test/test/:test_id` (`getTestById`) incluye `course`, `courses` e `is_shared`.
- `GET /api/test/reports/tests` (`getTestSummaries`) filtra por `course_test` cuando recibe
  `course_id` y agrega `courses` / `is_shared` al resumen (ya devolvía `course`).
- `question` / `answer` / `test_question_type` guardan siempre `course_id` del **dueño** del
  examen. `createQuestionTest`, `createAnswerQuestionTest` y `createTestQuestionType` resuelven el
  test y fuerzan ese valor; el `course_id` del body (o de la fila del import) se ignora.
- `GET /api/test/questions/by-test/:test_id` (`getQuestionTest`) ya **no** filtra por `course_id`:
  las preguntas pertenecen al test. El parámetro se acepta y se ignora.
- Las importaciones CSV/Excel ya no requieren `course_id` (ni en el body ni en la fila); el curso
  se resuelve con el examen.

**Ciclo de vida de vínculos (Fase 4):**

- `POST /api/test/tests/:course_id/link` con `{ test_ids: number[] }` o `{ test_id: number }`
  vincula exámenes existentes. Idempotente (`skipped`), transaccional (todo o nada) y devuelve
  `{ course_id, linked, skipped, tests }`. Error `409` si el curso está eliminado o no es de teoría,
  si el examen pertenece a un curso que no es de teoría, o si el examen está activo y el curso ya
  tiene otro examen activo (`conflicts`).
- `DELETE /api/test/tests/:course_id/link/:test_id` desvincula **sin borrar** el examen, sus
  preguntas, respuestas ni intentos. Devuelve `{ course_id, test_id, removed, tests }`.
- `GET /api/test/test/:test_id/courses` lista los cursos vinculados:
  `{ test_id, owner_course_id, courses: [{ ..., is_owner }] }`.
- `POST /api/test/test` acepta `course_ids` (opcional) para crear y compartir en una sola
  transacción. El dueño siempre se vincula. El dueño y los `course_ids` deben estar activos y ser
  `course_type_id = 1` (`409`).
- `PUT /api/test/test` con `status: true` valida conflictos **solo** en el paso inactivo → activo;
  si ya estaba activo no bloquea la edición de datos heredados. Editar exige al menos un curso
  vinculado activo (`409` si todos están eliminados).
- `POST /api/test/courseStudentTest/:course_student_id` usa `getActiveTestByCourse` (vínculo, no
  `test.course_id`). Si el curso no tiene examen activo → `404 { message }`. Si hay varios activos
  por datos viejos usa el de menor id y deja un `console.warn`.
- `POST /api/test/courseStudentTest/:course_student_test_id/reactivate` **reabre un intento ya
  presentado y evaluado** (`finished = true → false`, `score`/`approve` a `null`) para que el
  alumno siga respondiendo el mismo examen. Solo administradores (`user.is_superuser`, middleware
  `src/middleware/requireSuperuser.js`; sin rol → `403 { message }`). Idempotente. Conserva
  preguntas, respuestas y el puntaje histórico de `course_student`; al re-cerrar el intento se
  recalculan los puntajes. Repo: `reactivateCourseStudentTest`. El frontend lo retoma por id
  (`GET /api/test/courseStudentTest/:id`), **no** por `POST /courseStudentTest/:course_student_id`,
  para no recrear el intento fuera de la ventana de 2 h.
- Repositorio: helpers `getTestIdsByCourse`, `isTestLinkedToCourse`, `countCoursesByTest`,
  `countActiveCoursesByTest`, `getActiveTestsByCourse`, `getActiveTestByCourse`,
  `getCoursesByTest`, `linkTestToCourse`, `linkTestsToCourse`, `unlinkTestFromCourse`,
  `assertAnyLinkedCourseActive`, `getTestActivationConflicts`, `reactivateCourseStudentTest` en
  `src/database/repositories/test.js`.

**Migración obligatoria antes de desplegar:** `migrations/20261202000000-create-course-test.cjs`
crea la tabla y hace backfill (`test.course_id → course_test`). Es idempotente. El `sync` de
arranque (`alter: false`) puede crear la tabla si falta, pero **no** ejecuta el backfill.

**Consolidación de duplicados (Fase 7, migración pendiente de ejecución):**
`migrations/20261203000000-consolidate-duplicate-tests.cjs` consolida el único grupo real detectado
por `npm run analyze:duplicates`: vincula el canónico **test 8** a los cursos 13 y 14 y deja los
tests 10 y 11 con `status = 0`. Solo actúa si los tres exámenes pertenecen a cursos de teoría y
conservan la misma huella de contenido (preguntas + respuestas + blueprint); si alguien editó uno,
se omite con un warning. **No borra** preguntas, respuestas, vínculos ni intentos. Es idempotente y
debe correrse después de `20261202000000-create-course-test.cjs`. Tras ejecutarla,
`npm run analyze:duplicates` debe reportar 0 grupos activos.

## Clonación de exámenes (variantes)

Compartir (`course_test`) mantiene **un** examen para N cursos; clonar crea una **variante
independiente**. El clon sirve cuando a partir de un examen base surgen versiones con más/menos
preguntas, otro `duration` o `min_score`.

- `POST /api/test/clone/:test_id` con `{ course_id }` (+ overrides opcionales `code`, `duration`,
  `min_score`). `course_id` es el curso **destino** (dueño del clon): debe existir, estar activo y
  ser `course_type_id = 1`; debe ser **distinto** del curso dueño del origen.
- Copia profunda en una transacción: `test` (`duration`, `min_score`), blueprint
  (`test_question_type`), **todas** las `question` (tipos 1..5, incluidas inactivas) y **todas** las
  `answer` (incluida `is_correct`). Los IDs son nuevos y el `course_id` de blueprint/preguntas/
  respuestas se normaliza al destino.
- El clon **siempre nace inactivo** (`status: false`) y solo se vincula al curso destino. No copia
  intentos (`course_student_test*`) ni los vínculos del origen, así que editarlo o borrar preguntas
  no afecta al origen.
- `code` autogenerado: `${code_origen}-COPIA` con sufijos `-2`, `-3`, … (`test.code` no tiene
  UNIQUE; la unicidad se garantiza en la aplicación). `code` explícito repetido → `409`.
- El curso dueño del origen **puede estar eliminado** (rescate de contenido), pero debe ser de
  teoría (`409` si no). Contenido inconsistente del origen (pregunta sin blueprint o respuesta sin
  pregunta del test) → `409`.
- No valida conflicto de examen activo al crear (nace inactivo): al activarlo aplica el `409` de
  `PUT /api/test/test`.
- Repositorio: `cloneTest` + `buildUniqueTestCode` en `src/database/repositories/test.js`.
  Controller `CloneTest` (`src/controller/test.js`), Joi `cloneTestSchema`
  (`src/database/imput_validation/test.js`), ruta en `src/route/test.js`.
- **Sin migración en v1.** El linaje (`test.parent_test_id`) queda para v2.
- Plan completo: `PLAN_CLONACION_EXAMENES.md`.

## Evaluaciones: solo filas activas en las lecturas de programa

Las tres lecturas de evaluación de `src/database/repositories/assessment.js` filtran
`status: true` en **los tres niveles** del árbol (`subject_days`, `subject_lesson`,
`subject_lesson_days`), además del filtro `subject.status`/`is_schedulable` que ya existía:

- `getSubjectsByAssessment` (`GET /api/assessment/fetchSubjectAssessment`) y
  `getSubjectBySubjectId` (respuesta de `PUT /changeCourseStudentAssessmentLessonDay`): filtran
  por `day` **y** `status: true`. Un tema con el switch apagado en ese día
  (`subject_lesson_days.status = 0`) no aparece, y un subject sin ningún tema activo en ese día
  desaparece de la respuesta (join interno).
- `getSubjectBySubjectByCSA` (`GET /api/assessment/fetchAssessmentData` → PDF): **no** filtra por
  `day` (el PDF cubre todas las sesiones del programa), pero sí por `status` en los tres niveles.

Lección aprendida (bug curso 33): los includes filtraban solo por `day`, así que la vista de
evaluación mostraba temas desactivados "en todos los días". El frontend no debe filtrar por status:
muestra lo que la API devuelve. En Sequelize 6, un include con `where` y sin `required` explícito
es INNER JOIN (`model.js`: `include.required = !!include.where`), por eso las secciones sin temas
activos se eliminan solas de la respuesta. No quites esos `status: true`.

## API Routes

| Prefix | Purpose |
|--------|---------|
| `/auth` | Login (public) |
| `/api/users` | User/student/instructor CRUD |
| `/api/users/student/search` | Fast student search by name/email |
| `/api/courses` | Course + enrollment + schedule CRUD (includes `instructor_id` filter on `coursesStudents`). Lifecycle: `DELETE /:id` (soft delete) + `POST /:id/restore` (reactivar), ver sección "Soft delete de curso". Orden manual: `PUT /order` (`{ ids }` → 1..N) + `row_order` en `GET /`, ver sección "Orden de cursos". `DELETE /schedule/:id` borra un schedule **y en cascada** su `attendance` + `attendance_signature` (match `course_student_id` + `date` + `subject_days.day`); `DELETE /schedule/course-student/:course_student_id` borra todos los schedules del alumno con la misma cascada (solo los pares `(date, day)` que tenían schedule). Ambos en una transacción. |
| `/api/course_groups` | Course groups CRUD + students list + remove students + signature upload + list signatures per group + `GET /report/attendance` (attendance/signature report grouped by group with students/user, course, schedules/instructors). Supports `instructor_id` filter. |
| `/api/subjects` | Subject + lessons + days CRUD |
| `/api/assessment` | Student assessments + signatures |
| `/api/test` | Tests, questions, answers, Excel/CSV import. Exámenes compartidos: `POST /tests/:course_id/link` + `DELETE /tests/:course_id/link/:test_id` + `GET /test/:test_id/courses`, ver sección "Exámenes compartidos (`course_test`)". Clonación de variantes: `POST /clone/:test_id` (`{ course_id, code?, duration?, min_score? }`), ver sección "Clonación de exámenes (variantes)". |
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
- `npm run analyze:duplicates` — Analiza exámenes duplicados (solo lectura; `--json`, `--sql`, `--out`)
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

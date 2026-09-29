# Frontend Changes

## New fields in `course_student_assessment_day`

Added flight data fields to the assessment day records:

| Field | Type | Meaning |
|-------|------|---------|
| `takeoff_day` | number | Despegues diurnos |
| `takeoff_night` | number | Despegues nocturnos |
| `landing_day` | number | Aterrizajes diurnos |
| `landing_night` | number | Aterrizajes nocturnos |
| `landing_precision` | number | Aterrizajes de precisión |
| `landing_non_precision` | number | Aterrizajes de no precisión |
| `landing_gps` | number | Aterrizajes GPS |
| `landing_circuit` | number | Aterrizajes de circuito |
| `landing_visual` | number | Aterrizajes visuales |
| `training_time` | number (horas decimales, ej. `1.5` = 1h30m) | Tiempo de entrenamiento |
| `check_time` | number (horas decimales, ej. `1.5` = 1h30m) | Tiempo de chequeo |
| `ifr_time` | number (horas decimales, ej. `1.5` = 1h30m) | Tiempo IFR |
| `vfr_time` | number (horas decimales, ej. `1.5` = 1h30m) | Tiempo VFR |
| `type` | string | Select con 5 valores: `entrenamiento`, `reentrenamiento`, `chequeo`, `re-chequeo`, `experiencia_reciente` |

All fields are optional.

The 5 landing-type counters are independent from `landing_day` / `landing_night`: they do not sum into them and no total is computed server-side.

## Endpoints

### `PUT /api/assessment/updateCourseStudentAssessmentDay`
Send the fields (snake_case) in the request payload (form-data). Counts (`takeoff_*`, `landing_*`) as numbers; times (`training_time`, `check_time`, `ifr_time`, `vfr_time`) as decimal numbers in hours (e.g. `1.5` = 1h30m); `type` as one of the 5 allowed string values.

### `GET /api/assessment/courseStudentAssessmentDay`
Get, create **or update** the assessment day (upsert on `(course_student_assessment_id, day)`).

**Change**: when the day **already exists**, the endpoint now applies the optional query params as a **partial update**. Previously they were silently discarded. Sending no optional params keeps the previous read-only behavior.

Notes:
- Only the documented optional fields are read; any other query param is ignored.
- An empty value (`?landing_gps=`) is stored as `null` (clears the column). `0` is stored.
- The `PUT` remains the recommended way to save changes, since it always updates.

### `GET /api/assessment/fetchSubjectAssessment`
### `GET /api/assessment/fetchAssessmentData`
The assessment day rows returned now include these fields automatically.

## Score averages in `fetchAssessmentData`

`GET /api/assessment/fetchAssessmentData?CSA_id=<id>` now returns:

- `CSA.CourseStudentAssessmentDays[].score_average` — average score per day.
- `CSA.course_score_average` — average score of the whole assessment (all days).

The effective value per record is the last one present: `score_3` → `score_2` → `score`. Rounded to 1 decimal; `null` when there are no scored records.

## Backend files changed

- `migrations/20260802000000-add-flight-data-to-course-student-assessment-day.cjs` (new — **not executed yet**; the owner must run `npm run migrate`)
- `migrations/20260929000000-add-landing-types-to-course-student-assessment-day.cjs` (new — **not executed yet**; adds `landing_precision`, `landing_non_precision`, `landing_gps`, `landing_circuit`, `landing_visual` as nullable `INTEGER`; the owner must run `npm run migrate`)
- `migrations/20260809000000-change-training-check-time-to-decimal.cjs` (new — **not executed yet**; changes `training_time`/`check_time` from `TIME` to `FLOAT`, converting existing `"HH:MM:SS"` values to decimal hours; the owner must run `npm run migrate`)
- `src/database/models/assessment.js`
- `src/database/repositories/assessment.js` (create/update assessment day)
- `src/controller/assessment.js` (`CourseStudentAssessmentDay`, `UpdateCourseStudentAssessmentDay`, shared `pickAssessmentDayFields` helper)
- `routes.md`, `CONTRACTS.md`

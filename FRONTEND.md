# Frontend Changes

## New fields in `course_student_assessment_day`

Added flight data fields to the assessment day records:

| Field | Type | Meaning |
|-------|------|---------|
| `takeoff_day` | number | Despegues diurnos |
| `takeoff_night` | number | Despegues nocturnos |
| `landing_day` | number | Aterrizajes diurnos |
| `landing_night` | number | Aterrizajes nocturnos |
| `training_time` | number (horas decimales, ej. `1.5` = 1h30m) | Tiempo de entrenamiento |
| `check_time` | number (horas decimales, ej. `1.5` = 1h30m) | Tiempo de chequeo |
| `type` | string | Select con 5 valores: `entrenamiento`, `reentrenamiento`, `chequeo`, `re-chequeo`, `experiencia_reciente` |

All fields are optional.

## Endpoints

### `PUT /api/assessment/updateCourseStudentAssessmentDay`
Send the 7 fields (snake_case) in the request payload (form-data). Counts (`takeoff_*`, `landing_*`) as numbers; times (`training_time`, `check_time`) as decimal numbers in hours (e.g. `1.5` = 1h30m); `type` as one of the 5 allowed string values.

### `GET /api/assessment/courseStudentAssessmentDay`
When creating a new assessment day (no existing day for the CSA), the 7 optional query params are accepted and stored on creation.

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
- `migrations/20260809000000-change-training-check-time-to-decimal.cjs` (new — **not executed yet**; changes `training_time`/`check_time` from `TIME` to `FLOAT`, converting existing `"HH:MM:SS"` values to decimal hours; the owner must run `npm run migrate`)
- `src/database/models/assessment.js`
- `src/database/repositories/assessment.js` (create/update assessment day)
- `src/controller/assessment.js`
- `routes.md`

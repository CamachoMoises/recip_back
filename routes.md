# API Routes Documentation

Base path and auth info at the bottom.

---

## Authentication

### `POST /auth`
Login.

**Request** (form-data):
```
email: string
password: string
```

**Response** `200`:
```json
{
  "email": "user@email.com",
  "user": { "id": 1, "name": "...", "email": "...", ... },
  "token": "eyJhbG..."
}
```

**Errors**: `401` Invalid User / Invalid Password

---

## Users

### `GET /api/users`
List all users.

**Response** `200`: Array of user objects.

### `GET /api/users/user/:user_id`
Get user by ID.

**Response** `200`: User object.

### `GET /api/users/userEmailValidate/:email`
Check if email exists.

**Response** `200`:
```json
{ "exist": true }
```

### `GET /api/users/userDocType`
List document types.

**Response** `200`: Array of `{ id, name, symbol }`.

### `GET /api/users/student`
List students.

**Query params**: `status` (boolean string: `"true"` / `"false"`)

**Response** `200`: Array of users with student role.

### `GET /api/users/instructor`
List instructors.

**Query params**: `status` (boolean string)

**Response** `200`: Array of users with instructor role.

### `GET /api/users/student/search`
Search students by name or email.

**Query params**: `search` (string)

**Response** `200`: Array of student user objects.

### `POST /api/users/student`
Create student user.

**Request** (form-data): Same fields as create user + student-specific fields.

**Response** `201`: Created user with student role.

### `POST /api/users/instructor`
Create instructor user.

**Request** (form-data): Same fields as create user + instructor-specific fields.

**Response** `201`: Created user with instructor role.

### `GET /api/users/me`
Get currently logged user (from JWT).

**Response** `200`: User object with student/instructor included.

### `POST /api/users`
Create user.

**Request** (form-data):
```
name: string
last_name: string
email: string
password: string
doc_number: string
user_doc_type_id: number
phone: string (optional)
country_name: string (optional)
flag: string (optional)
is_active: boolean (optional)
is_staff: boolean (optional)
is_superuser: boolean (optional)
```

**Response** `201`: Created user object.

### `PUT /api/users`
Update user.

**Request** (form-data) — same fields as create + `id` or `uuid`.

**Response** `201`: Updated user object.

### `PUT /api/users/disable-role`
Remove a role from user.

**Request** (form-data):
```
user_id: number
role: "student" | "instructor"
```

**Response** `200`: Updated user object.

**Errors**: `400` Invalid role

---

## Courses

### `GET /api/courses`
List courses with filters.

**Query params**: `name`, `description`, `course_type_id`, `course_level_id`

**Response** `200`: Array of course objects with course type and level included.

### `GET /api/courses/coursesStudents`
List course-student enrollments (paginated).

**Query params**:
- `pageSize` (number, default 10)
- `currentPage` (number, default 1)
- `status` (boolean string: `"true"` / `"false"`)
- `course_type_id` (number)
- `course_group_id` (number)
- `student_id` (number, optional) — filter by specific student ID

**Response** `200`:
```json
{
  "data": [ ... ],
  "totalItems": 50,
  "currentPage": 1,
  "pageSize": 10,
  "totalPages": 5
}
```

### `GET /api/courses/courseTypes`
List course types.

**Response** `200`: Array of `{ id, name }`.

### `GET /api/courses/courseLevel`
List course levels.

**Response** `200`: Array of `{ id, name }`.

### `GET /api/courses/course/:id`
Get course by ID.

**Response** `200`: Course object with type and level included.

### `GET /api/courses/courseStudent/:id`
Get course-student by ID.

**Response** `200`: Course student object with student, course, assessments, tests included.

### `GET /api/courses/schedule/:id`
Get schedule by course-student ID.

**Response** `200`: Array of schedule objects.

### `POST /api/courses`
Create course.

**Request** (form-data):
```
name: string
description: string
code: string
plane_model: string
days: number
type: number (course_type_id)
level: number (course_level_id)
status: boolean
```

**Response** `201`: Created course object.

### `POST /api/courses/courseStudent/:course_id`
Create course-student enrollment.

**Response** `200`: Created course-student object with auto-generated code.

### `POST /api/courses/schedule`
Create schedule entry.

**Request** (form-data):
```
instructor_id: number
course_id: number
student_id: number
subject_id: number
subject_days_id: number
course_student_id: number
date: string (YYYY-MM-DD)
hour: string (HH:mm)
classTime: number
```

**Response** `200`: Created schedule object.

### `PUT /api/courses`
Update course.

**Request** (form-data): Same fields as create + `id`.

**Response** `200`: Updated course object.

### `PUT /api/courses/courseStudent/:course_id`
Update course-student.

**Request** (form-data):
```
course_student_id: number
date: string (YYYY-MM-DD)
student_id: number
typeTrip: number
license: number
regulation: number
```

**Response** `200`: Updated course-student object.

### `PUT /api/courses/courseStudent/:course_student_id/status`
Update course-student status.

**Request** (form-data):
```
status: boolean
```

**Response** `200`: Updated course-student object.

### `PUT /api/courses/status`
Update instructor status.

**Request** (form-data):
```
user_id: number
status: boolean
```

**Response** `200`: Updated instructor object.

### `PUT /api/courses/schedule`
Update schedule entry.

**Request** (form-data):
```
id: number
instructor_id: number
date: string (YYYY-MM-DD)
hour: string (HH:mm)
classTime: number
```

**Response** `200`: Updated schedule object.

### `PUT /api/courses/courseStudentMaxAttempts`
Update max attempts for course-student.

**Request** (form-data):
```
course_student_id: number
max_attempts: number
```

**Response** `200`: Updated course-student object.

---

## Course Groups

### `GET /api/course_groups`
List all course groups.

**Response** `200`: Array of course group objects.

### `GET /api/course_groups/:id`
Get course group by ID.

**Response** `200`: Course group object.

### `GET /api/course_groups/:id/students`
List students in a course group.

**Response** `200`: Array of course-student objects in the group.

### `POST /api/course_groups`
Create course group.

**Request** (form-data):
```
name: string
course_id: number
status: boolean
```

**Response** `201`: Created course group object.

### `PUT /api/course_groups`
Update course group.

**Request** (form-data):
```
id: number
name: string (optional)
course_id: number (optional)
status: boolean (optional)
```

**Response** `200`: Updated course group object.

### `DELETE /api/course_groups/:id`
Delete course group.

**Response** `204`: No content.

**Errors**: `404` Course group not found

### `DELETE /api/course_groups/:id/students`
Remove students from course group.

**Request** (form-data):
```
student_ids: number[] (array of course_student_id)
```

**Response** `200`: Updated course group object.

### `POST /api/course_groups/signature`
Save course group signature (base64 → Cloudinary).

**Request** (form-data):
```
course_group_id: number
signature: string (base64 data-url)
```

**Response** `200`:
```json
{
  "success": true,
  "message": "Firma guardada correctamente.",
  "data": {
    "signatureUrl": "https://...",
    "courseGroup": { ... }
  }
}
```

---

## Subjects

### `GET /api/subjects`
List all subjects.

**Response** `200`: Array of subject objects.

### `GET /api/subjects/course/:id`
List subjects by course.

**Query params**: `status` (boolean string), `is_schedulable` (boolean string)

**Response** `200`: Array of subject objects with days and lessons.

### `GET /api/subjects/lesson/course/:id`
List subject lessons by course.

**Response** `200`: Array of subject lesson objects.

### `GET /api/subjects/subject/:id`
Get subject by ID.

**Response** `200`: Subject object with days, lessons, and lesson days included.

### `POST /api/subjects`
Create subject.

**Request** (form-data):
```
name: string
hours: number
course_id: number
order: number
status: boolean
is_schedulable: boolean
```

**Response** `201`: Created subject object.

### `POST /api/subjects/lesson`
Create subject lesson.

**Request** (form-data):
```
course_id: number
subject_id: number
name: string
order: number
status: boolean
```

**Response** `201`: Updated subject with lessons included.

### `POST /api/subjects/subjects_days`
Toggle or create subject day.

**Request** (form-data):
```
subject_id: number
course_id: number
day: number
status: boolean
```

**Response** `201`: `"OK"`

### `POST /api/subjects/subjects_lesson_days`
Toggle or create subject lesson day.

**Request** (form-data):
```
subject_id: number
subject_lesson_id: number
subject_lesson_days_id: number
course_id: number
day: number
status_lesson: boolean
```

**Response** `201`: `"OK"`

### `PUT /api/subjects`
Update subject.

**Request** (form-data):
```
id: number
name: string
hours: number
course_id: number
order: number
status: boolean
is_schedulable: boolean
```

**Response** `201`: Updated subject object.

### `PUT /api/subjects/lesson`
Update subject lesson.

**Request** (form-data):
```
id: number
subject_id: number
name: string
order: number
status: boolean
```

**Response** `201`: Updated subject with lessons included.

---

## Assessment

### `GET /api/assessment/courseStudentAssessment/:id`
Get assessment by ID.

**Response** `200`: Course student assessment object with course, student, course-student, and assessment days included.

### `GET /api/assessment/fetchSubjectAssessment`
List subjects for assessment.

**Query params**: `day`, `course_id`, `course_student_assessment_day_id`

**Response** `200`: Array of subjects with lesson details.

### `GET /api/assessment/fetchAssessmentData`
Get assessment with subject data.

**Query params**: `CSA_id`

**Response** `200`:
```json
{
  "CSA": { ... },
  "CASD": [ ... ]
}
```

### `GET /api/assessment/courseStudentAssessmentDay`
Get or create assessment day.

**Query params**: `CSA_id`, `day`, `course_id`, `student_id`, `course_student_id`

**Response** `200`: Assessment day object.

### `POST /api/assessment/createCourseStudentAssessment`
Create assessment.

**Request** (form-data):
```
course_id: number
student_id: number
course_student_id: number
```
Date is auto-set to current date.

**Response** `201`: Created assessment object.

### `POST /api/assessment/courseStudentAssessmentApprove`
Approve/reject assessment.

**Request** (form-data):
```
course_student_assessment_id: number
approve: boolean
```

**Response** `200`: Updated assessment.

### `PUT /api/assessment/updateCourseStudentAssessmentDay`
Update assessment day.

**Request** (form-data):
```
id: number
airport: text (optional)
airstrip: text (optional)
elevation: number (optional)
meteorology: text (optional)
temperature: number (optional)
qnh: text (optional)
wind: text (optional)
weight: number (optional)
flaps: text (optional)
power: text (optional)
seat: text (optional)
takeoff: number (optional)
landing: number (optional)
comments: text (optional)
```

**Response** `200`: Updated assessment day object.

### `PUT /api/assessment/changeCourseStudentAssessmentLessonDay`
Create or update lesson day detail (upsert).

**Request** (form-data): If `id` is provided → update scores. Otherwise → create new.
```
id: number (optional)
course_id: number
student_id: number
course_student_id: number
course_student_assessment_id: number
course_student_assessment_day_id: number
subject_id: number
subject_lesson_id: number
subject_days_id: number
subject_lesson_days_id: number
item: text
score: number
score_2: number (optional)
score_3: number (optional)
day: number
```

**Response** `200`: Updated subject with lesson details.

### `POST /api/assessment/saveSignatures`
Save assessment signatures (base64 → Cloudinary).

**Request** (form-data):
```
CSAD_id: number
signature1: string (base64 data-url) (optional)
signature2: string (base64 data-url) (optional)
signature3: string (base64 data-url) (optional)
```

**Response** `200`:
```json
{
  "success": true,
  "message": "Firmas procesadas correctamente.",
  "data": {
    "studentSignatureUrl": "https://...",
    ...
  }
}
```

---

## Tests

### `GET /api/test`
List all tests.

**Response** `200`: Array of test objects.

### `GET /api/test/tests/:course_id`
List tests by course.

**Response** `200`: Array of test objects.

### `GET /api/test/test/:test_id`
Get test by ID.

**Response** `200`: Test object with question types.

### `GET /api/test/questions/by-test/:test_id`
List questions by test with filters.

**Query params**: `question_type_id`, `test_question_type_id`, `course_id`, `status`

**Response** `200`: Array of question objects with answers.

### `GET /api/test/questionTypes`
List question types.

**Response** `200`: Array of `{ id, name }`.

### `GET /api/test/answers/:id`
List answers by question ID.

**Response** `200`: Array of answer objects.

### `GET /api/test/student/:student_id`
List all tests taken by student.

**Query params**: `course_student_id` (optional)

**Response** `200`: Array of course-student-test objects.

### `GET /api/test/courseStudentTest/:id`
Get course-student-test by ID.

**Response** `200`: Course-student-test object with questions and answers.

### `POST /api/test/test`
Create test.

**Request** (form-data):
```
course_id: number
duration: number (minutes)
min_score: number
```

**Response** `201`: Created test object.

### `POST /api/test/questionTest`
Create question.

**Request** (form-data):
```
course_id: number
test_id: number
question_type_id: number
test_question_type_id: number
header: string
```

**Response** `201`: Created question object.

### `POST /api/test/answerQuestionTest`
Create answer.

**Request** (form-data):
```
course_id: number
test_id: number
question_type_id: number
question_id: number
value: string
```

**Response** `201`: Created answer object.

### `POST /api/test/courseStudentTest/:course_student_id`
Start or resume a test for a course-student.

**Request** (form-data):
```
date: string (YYYY-MM-DD)
```

**Response** `200`: Course-student-test object with questions.

### `POST /api/test/courseStudentTestAnswer`
Save a single answer during test.

**Request** (form-data):
```
courseStudentTestAnswer: {
  course_student_test_id: number,
  course_student_test_question_id: number,
  course_student_id: number,
  question_id: number,
  student_id: number,
  resp: any (depends on question type),
  test_id: number,
  course_id: number
}
```

**Response** `200`: Created/updated answer object.

### `POST /api/test/courseStudentTestEnd`
End test and calculate score.

**Request** (form-data):
```
course_student_test_id: number
```

**Response** `200`:
```json
{
  "answers": [ ... ],
  "score": 85.5
}
```

### `POST /api/test/import-excel/:test_id`
Import questions from Excel file.

**Request**: `multipart/form-data` with `excel_file` field (`.xlsx`).

**Response** `201`:
```json
{
  "message": "Excel import completed",
  "questionsImported": 10,
  "answersImported": 40
}
```

### `POST /api/test/import-csv`
Import questions from CSV file.

**Request**: `multipart/form-data` with `csv_file` field (`.csv`).

**Response** `201`:
```json
{
  "message": "CSV import completed",
  "questionsImported": 10,
  "answersImported": 40
}
```

### `PUT /api/test`
Update test.

**Request** (form-data):
```
id: number
duration: number (optional)
min_score: number (optional)
status: boolean (optional)
```

**Response** `201`: Updated test object.

### `PUT /api/test/questionTest`
Update question.

**Request** (form-data):
```
id: number
header: string (optional)
status: boolean (optional)
```

**Response** `201`: Updated question object.

### `PUT /api/test/answerQuestionTest/:question_id`
Update answer.

**Request** (form-data):
```
id: number
value: string (optional)
is_correct: boolean (optional)
status: boolean (optional)
```

**Response** `201`: Updated question with answers.

### `PUT /api/test/questionTypes`
Update question type.

**Request** (form-data):
```
id: number
value: string
```

**Response** `201`: Updated question type.

### `PUT /api/test/testQuestionTypes`
Create or update test question type.

**Request** (form-data): If `id` > 0 → update, else → create.
```
id: number
course_id: number
test_id: number
question_type_id: number
amount: number
value: number
status: boolean
```

**Response** `201`: Updated test object.

### `PUT /api/test/updateCourseStudentTestScore`
Manually update test score.

**Request** (form-data):
```
course_student_test_id: number
course_student_test_answer_id: number
score: number
```

**Response** `200`: Updated course-student-test object.

---

## Suggestions

### `GET /api/suggestions`
List all suggestions.

**Response** `200`: Array of suggestion objects with user data.

### `GET /api/suggestions/:id`
Get suggestion by ID.

**Response** `200`: Suggestion object.

**Errors**: `404` Suggestion not found

### `GET /api/suggestions/user/:user_id`
List suggestions by user.

**Response** `200`: Array of suggestion objects.

### `POST /api/suggestions`
Create suggestion.

**Request** (form-data):
```
user_id: number
title: string (max 500)
description: string
```

**Response** `201`: Created suggestion object.

### `PUT /api/suggestions`
Update suggestion.

**Request** (form-data):
```
id: number
user_id: number (optional)
title: string (optional, max 500)
description: string (optional)
```

**Response** `200`: Updated suggestion object.

**Errors**: `404` Suggestion not found

### `DELETE /api/suggestions/:id`
Delete suggestion.

**Response** `204`: No content.

**Errors**: `404` Suggestion not found

---

## Attendance

### `GET /api/attendance`
List attendance records (paginated).

**Query params**:
- `pageSize` (number, default 10)
- `currentPage` (number, default 1)
- `course_student_id` (number, optional)
- `attendance_status_id` (number, optional)
- `date_from` (string YYYY-MM-DD, optional)
- `date_to` (string YYYY-MM-DD, optional)

**Response** `200`:
```json
{
  "data": [ ... ],
  "totalItems": 50,
  "currentPage": 1,
  "pageSize": 10,
  "totalPages": 5
}
```

### `GET /api/attendance/:id`
Get attendance by ID.

**Response** `200`: Attendance object with CourseStudent and AttendanceStatus included.

**Errors**: `404` Attendance not found

### `GET /api/attendance/by-course-student`
Get attendance by course-student ID.

**Query params**: `course_student_id` (required)

**Response** `200`: Array of attendance objects.

### `GET /api/attendance/by-date-range`
Get attendance by date range.

**Query params**: `start_date` (required), `end_date` (required)

**Response** `200`: Array of attendance objects.

### `POST /api/attendance`
Create attendance.

**Request** (form-data):
```
course_student_id: number
date: string (YYYY-MM-DD)
attendance_status_id: number
comments: string (optional)
```

**Response** `201`: Created attendance object.

### `PUT /api/attendance`
Update attendance.

**Request** (form-data):
```
id: number
course_student_id: number (optional)
date: string (optional)
attendance_status_id: number (optional)
comments: string (optional)
```

**Response** `200`: Updated attendance object.

**Errors**: `404` Attendance not found

### `DELETE /api/attendance/:id`
Delete attendance.

**Response** `204`: No content.

**Errors**: `404` Attendance not found

### `GET /api/attendance/statuses`
List all attendance statuses.

**Response** `200`: Array of `{ id, name, description }`.

### `GET /api/attendance/statuses/:id`
Get attendance status by ID (returns all statuses, same as `/statuses`).

**Response** `200`: Array of attendance status objects.

### `POST /api/attendance/statuses`
Create attendance status.

**Request** (form-data):
```
name: string (max 100)
description: string (optional)
```

**Response** `201`: Created status object.

### `PUT /api/attendance/statuses/:id`
Update attendance status.

**Request** (form-data):
```
name: string (optional, max 100)
description: string (optional)
```

**Response** `200`: Updated status object.

**Errors**: `404` Attendance Status not found

### `DELETE /api/attendance/statuses/:id`
Delete attendance status.

**Response** `204`: No content.

**Errors**: `404` Attendance Status not found

### `POST /api/attendance/signature`
Save attendance signature (base64 → Cloudinary).

**Request** (form-data):
```
attendance_id: number
signature: string (base64 data-url)
```

**Response** `200`:
```json
{
  "success": true,
  "message": "Firma guardada correctamente.",
  "data": {
    "signatureUrl": "https://...",
    "attendance": { ... }
  }
}
```

**Errors**: `400` No signature provided / attendance_id required

---

## Module

### `GET /api/module`
List all modules.

**Response** `200`: Array of module objects.

---

## Group

### `GET /api/group`
List all groups.

**Response** `200`: Array of group objects with permissions.

---

## Permission

### `GET /api/permission`
List all permissions.

**Response** `200`: Array of permission objects.

---

## Rating

### `GET /api/rating`
List all ratings.

**Response** `200`: Array of rating objects.

---

## Config

### `GET /api/config`
Run setup triggers and seed initial data.

**Response** `200`:
```json
{
  "message": [ "Tipo Escuela en tierra creado con éxito", ... ]
}
```

---

## Mail

### `POST /api/mail/send`
Send email.

**Request**: `multipart/form-data` with optional file attachment.
```
to: string
subject: string
body: string
adjunto: file (optional)
```

**Response** `200`:
```json
{
  "ok": true,
  "messageId": "<...>"
}
```

---

## System

### `GET /status`
Health check.

**Response** `200`:
```json
{
  "status": "Server is running",
  "timestamp": "2026-05-30T...",
  "dbConnected": true
}
```

---

## Common Patterns

| Aspect | Convention |
|--------|------------|
| **Auth** | `Authorization: Bearer <token>` header required on most routes |
| **Form body** | All POST/PUT use `multipart/form-data` with `multer` |
| **Validation errors** | `400` with message: `Input Validation Error <details>` |
| **Not found** | `404` with entity name |
| **Delete success** | `204` No Content |
| **Server error** | `500` `Internal Server Error` |
| **Dates** | Format `YYYY-MM-DD` (DATEONLY) or ISO datetime |

## Route prefix summary

| Prefix | File |
|--------|------|
| `/auth` | `src/route/authentication.js` |
| `/api/users` | `src/route/user.js` |
| `/api/assessment` | `src/route/assessment.js` |
| `/api/courses` | `src/route/course.js` |
| `/api/course_groups` | `src/route/courseGroup.js` |
| `/api/subjects` | `src/route/subject.js` |
| `/api/module` | `src/route/module.js` |
| `/api/group` | `src/route/group.js` |
| `/api/permission` | `src/route/permission.js` |
| `/api/config` | `src/route/config.js` |
| `/api/test` | `src/route/test.js` |
| `/api/mail` | `src/route/mail.js` |
| `/api/suggestions` | `src/route/suggestion.js` |
| `/api/attendance` | `src/route/attendance.js` |
| `/api/rating` | `src/route/rating.js` |

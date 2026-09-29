-- =============================================================================
-- consulta_examen.sql
-- Consultas de preguntas, respuestas y respuesta correcta de un examen (test)
-- Base de datos: recip360atc_db  (MySQL 8)
-- Uso:  mysql -u <user> -p recip360atc_db < consulta_examen.sql
--
-- IMPORTANTE: estas consultas son la referencia SQL de los endpoints
--   GET /api/test/reports/*
-- (implementados con Sequelize en src/database/repositories/testReport.js).
-- Este archivo devuelve filas PLANAS; la API devuelve el mismo dato ANIDADO por
-- pregunta. La forma exacta de la respuesta está en CONTRACTS.md, que es la
-- fuente de verdad. Si cambias algo aquí, revisa que CONTRACTS.md siga
-- describiendo la respuesta real.
-- =============================================================================
--
-- MODELO DE DATOS
--   course
--     └── test                     examen (code, duration, min_score, status)
--          └── test_question_type  "plantilla" por tipo de pregunta
--                                   (amount = cuántas se sortean, value = puntos c/u)
--               └── question      pregunta (header, question_type_id)
--                    └── answer    opción/respuesta
--                                 (value = texto, is_correct = 1 => CORRECTA)
--
--   course_student_test                intento de un alumno (score, approve, finished)
--     └── course_student_test_question  preguntas sorteadas para ese intento
--          └── course_student_test_answer  respuesta del alumno (resp = JSON en TEXT)
--
-- NOTAS IMPORTANTES
--   * La respuesta correcta se marca con `answer.is_correct = 1`.
--     Puede haber VARIAS respuestas correctas por pregunta (tipos 2, 4 y 5).
--   * `question_type_id`: 1 Selección Simple · 2 Selección Multiple ·
--     3 Verdadero o Falso · 4 Completación · 5 Desarrollo.
--   * Los puntos por pregunta vienen de `test_question_type.value`
--     (NO de `question_type.value` ni de `question.value`).
--   * `course_student_test_answer.resp` es TEXT con un JSON:
--       - tipo 1 y 3: "289"                (un solo id de answer)
--       - tipo 2:      [{"id":338,"check":true}, ...]
--       - tipo 4 y 5:  ["10000", "-40 (min)"]  (texto libre)
--   * El nombre del alumno NO está en `student`: se obtiene vía
--       student.user_id -> user.id  (user.name, user.last_name).
--   * Filtros opcionales: deja la variable en NULL para no filtrar.
--       (@student_id IS NULL OR cst.student_id = @student_id)
--
-- =============================================================================


-- =============================================================================
-- 0) VARIABLES DE ENTRADA
--    Descomenta y ajusta para filtrar por un examen concreto.
-- =============================================================================

SET @test_id    = 1;   -- id de `test` (examen)
SET @test_code  = 'E-0001';
SET @student_id = NULL; -- id de `student` (NULL = todos los alumnos)
SET @attempt_id = NULL; -- id de `course_student_test` (intento concreto)

-- GROUP_CONCAT trunca en 1024 bytes por defecto; ampliar para listas largas.
SET SESSION group_concat_max_len = 1000000;


-- =============================================================================
-- 1) LISTAR EXÁMENES  ->  para obtener el @test_id
-- =============================================================================

SELECT
    t.id                AS test_id,
    t.code              AS test_code,
    c.id                AS course_id,
    c.name              AS course_name,
    t.duration          AS duracion_min,
    t.min_score         AS puntaje_minimo,
    t.status            AS test_activo,
    COUNT(DISTINCT q.id) AS total_preguntas,
    COUNT(DISTINCT cst.id) AS total_intentos
FROM test t
JOIN course c        ON c.id  = t.course_id
LEFT JOIN question q  ON q.test_id = t.id AND q.status = 1
LEFT JOIN course_student_test cst ON cst.test_id = t.id
GROUP BY t.id, t.code, c.id, c.name, t.duration, t.min_score, t.status
ORDER BY t.id;


-- =============================================================================
-- 2) EXAMEN: TODAS LAS PREGUNTAS, RESPUESTAS Y MARCA DE LA CORRECTA
--    (banco completo, sin alumnos)  ->  una fila por respuesta/opción
-- =============================================================================

SELECT
    qt.question_type_id                     AS tipo_id,
    qty.name                                AS tipo_pregunta,
    qt.id                                   AS plantilla_id,
    qt.amount                               AS preguntas_a_sortear,
    qt.value                                AS puntos_por_pregunta,
    q.id                                    AS pregunta_id,
    q.header                                AS pregunta,
    a.id                                    AS respuesta_id,
    a.value                                 AS respuesta,
    CASE WHEN a.is_correct = 1 THEN 'SI' ELSE 'NO' END AS es_correcta,
    a.status                                AS respuesta_activa
FROM test t
JOIN test_question_type qt ON qt.test_id  = t.id
JOIN question_type qty     ON qty.id      = qt.question_type_id
JOIN question  q           ON q.test_id   = t.id
                          AND q.test_question_type_id = qt.id
                          AND q.status = 1
JOIN answer    a           ON a.question_id = q.id
WHERE t.id = @test_id
ORDER BY qt.question_type_id, qt.id, q.id, a.is_correct DESC, a.id;


-- =============================================================================
-- 3) EXAMEN: UNA FILA POR PREGUNTA, CON TODAS LAS RESPUESTAS Y LA CORRECTA
--    (misma info que la #2 pero compacta y legible)
-- =============================================================================

SELECT
    qty.name  AS tipo,
    qt.value  AS puntos,
    q.id      AS pregunta_id,
    q.header  AS pregunta,
    GROUP_CONCAT(
        CONCAT(a.id, ') ', a.value, CASE WHEN a.is_correct = 1 THEN '  <== CORRECTA' ELSE '' END)
        ORDER BY a.is_correct DESC, a.id
        SEPARATOR ' | '
    ) AS respuestas
FROM test t
JOIN test_question_type qt ON qt.test_id  = t.id
JOIN question_type qty     ON qty.id      = qt.question_type_id
JOIN question  q           ON q.test_id   = t.id
                          AND q.test_question_type_id = qt.id
                          AND q.status = 1
JOIN answer    a           ON a.question_id = q.id
WHERE t.id = @test_id
GROUP BY qty.name, qt.value, q.id, q.header, qt.question_type_id
ORDER BY qt.question_type_id, q.id;


-- =============================================================================
-- 4) EXAMEN: SOLO LAS RESPUESTAS CORRECTAS (para publicaciones / material)
-- =============================================================================

SELECT
    qty.name                          AS tipo,
    q.id                              AS pregunta_id,
    q.header                          AS pregunta,
    GROUP_CONCAT(a.value ORDER BY a.id SEPARATOR ' | ') AS respuesta_correcta,
    qt.value                          AS puntos
FROM test t
JOIN test_question_type qt ON qt.test_id  = t.id
JOIN question_type qty     ON qty.id      = qt.question_type_id
JOIN question  q           ON q.test_id   = t.id
                          AND q.test_question_type_id = qt.id
                          AND q.status = 1
JOIN answer    a           ON a.question_id = q.id
                          AND a.is_correct = 1
WHERE t.id = @test_id
GROUP BY qty.name, q.id, q.header, qt.value, qt.question_type_id
ORDER BY qt.question_type_id, q.id;


-- =============================================================================
-- 5) EXAMEN CON LAS RESPUESTAS DE UN ALUMNO (intento) Y LA CORRECTA
--    Combina: pregunta + respuesta del alumno + respuesta correcta + puntaje
--    Filtra por @test_id y opcionalmente por @student_id / @attempt_id
-- =============================================================================

SELECT
    cst.id                AS intento_id,
    cst.code              AS codigo_intento,
    stu.id                AS alumno_id,
    usr.name              AS alumno_nombre,
    usr.last_name         AS alumno_apellido,
    cst.attempts          AS numero_intento,
    cst.date              AS fecha,
    qty.name              AS tipo,
    cstq.id               AS pregunta_sorteada_id,
    q.id                  AS pregunta_id,
    q.header              AS pregunta,
    qt.value              AS puntos_posibles,
    csta.resp             AS respuesta_alumno_raw,
    csta.score            AS puntos_obtenidos,
    (
        SELECT GROUP_CONCAT(a.value ORDER BY a.id SEPARATOR ' | ')
        FROM answer a
        WHERE a.question_id = q.id AND a.is_correct = 1
    ) AS respuesta_correcta
FROM course_student_test cst
JOIN student stu            ON stu.id = cst.student_id
JOIN user usr               ON usr.id = stu.user_id
JOIN course_student_test_question cstq ON cstq.course_student_test_id = cst.id
JOIN question  q            ON q.id    = cstq.question_id
JOIN test      t            ON t.id    = cstq.test_id
JOIN test_question_type qt  ON qt.id   = q.test_question_type_id
JOIN question_type qty      ON qty.id  = q.question_type_id
LEFT JOIN course_student_test_answer csta
       ON csta.course_student_test_question_id = cstq.id
WHERE t.id = @test_id
  AND (@student_id IS NULL OR cst.student_id = @student_id)
  AND (@attempt_id IS NULL OR cst.id         = @attempt_id)
ORDER BY cst.id, qt.question_type_id, q.id;


-- =============================================================================
-- 6) EXAMEN: RESPUESTAS DEL ALUMNO EN TEXTO PLANO (deserializa `resp`)
--    Normaliza los 3 formatos de `resp` a un solo texto legible y marca
--    si la respuesta fue correcta.
--    Para tipo 1 y 3 `resp` = id de `answer`; para tipo 2 es un JSON
--    [{id, check}] y para tipo 4/5 un JSON de textos libres.
-- =============================================================================

SELECT
    cst.code              AS codigo_intento,
    usr.name              AS alumno_nombre,
    usr.last_name         AS alumno_apellido,
    qty.name              AS tipo,
    q.id                  AS pregunta_id,
    q.header              AS pregunta,
    CASE q.question_type_id
        WHEN 1 THEN COALESCE(
            (SELECT a.value FROM answer a
             WHERE a.question_id = q.id AND a.id = CAST(csta.resp AS UNSIGNED)),
            CONCAT('Opcion ', csta.resp))
        WHEN 2 THEN (SELECT GROUP_CONCAT(a.value ORDER BY a.id SEPARATOR ' | ')
                     FROM JSON_TABLE(csta.resp, '$[*]' COLUMNS (
                             opt_id INT     PATH '$.id',
                             opt_chk TINYINT PATH '$.check')) jt
                     JOIN answer a ON a.question_id = q.id AND a.id = jt.opt_id
                     WHERE jt.opt_chk = 1)
        WHEN 3 THEN COALESCE(
            (SELECT a.value FROM answer a
             WHERE a.question_id = q.id AND a.id = CAST(csta.resp AS UNSIGNED)),
            csta.resp)
        ELSE csta.resp
    END                   AS respuesta_alumno,
    (
        SELECT GROUP_CONCAT(a.value ORDER BY a.id SEPARATOR ' | ')
        FROM answer a WHERE a.question_id = q.id AND a.is_correct = 1
    )                   AS respuesta_correcta,
    CASE
        WHEN q.question_type_id IN (1, 3) THEN
            CASE WHEN CAST(csta.resp AS UNSIGNED) IN (
                     SELECT a2.id FROM answer a2
                     WHERE a2.question_id = q.id AND a2.is_correct = 1)
                 THEN 'CORRECTA' ELSE 'INCORRECTA' END
        WHEN q.question_type_id = 2 THEN
            CASE WHEN csta.score >= qt.value THEN 'CORRECTA' ELSE 'PARCIAL/INCORRECTA' END
        ELSE NULL
    END                   AS resultado,
    qt.value              AS puntos_posibles,
    csta.score            AS puntos_obtenidos
FROM course_student_test cst
JOIN student stu            ON stu.id = cst.student_id
JOIN user usr               ON usr.id = stu.user_id
JOIN course_student_test_question cstq ON cstq.course_student_test_id = cst.id
JOIN course_student_test_answer csta  ON csta.course_student_test_question_id = cstq.id
JOIN question  q            ON q.id    = cstq.question_id
JOIN test      t            ON t.id    = cstq.test_id
JOIN test_question_type qt  ON qt.id   = q.test_question_type_id
JOIN question_type qty      ON qty.id  = q.question_type_id
WHERE t.id = @test_id
  AND (@student_id IS NULL OR cst.student_id = @student_id)
  AND (@attempt_id IS NULL OR cst.id         = @attempt_id)
ORDER BY cst.id, qty.id, q.id;


-- =============================================================================
-- 7) EXAMEN: PREGUNTAS DE LA BASE PERO SOLO LAS QUE LE TOCARON AL ALUMNO
--    (reproduce el sorteo real: solo course_student_test_question)
-- =============================================================================

SELECT
    cst.code            AS codigo_intento,
    usr.name            AS alumno_nombre,
    usr.last_name       AS alumno_apellido,
    qty.name            AS tipo,
    qt.value            AS puntos,
    q.header            AS pregunta,
    GROUP_CONCAT(
        CONCAT(a.id, ') ', a.value, CASE WHEN a.is_correct = 1 THEN '  <== CORRECTA' ELSE '' END)
        ORDER BY a.is_correct DESC, a.id
        SEPARATOR ' | '
    )                  AS opciones
FROM course_student_test cst
JOIN student stu            ON stu.id = cst.student_id
JOIN user usr               ON usr.id = stu.user_id
JOIN course_student_test_question cstq ON cstq.course_student_test_id = cst.id
JOIN question  q            ON q.id    = cstq.question_id
JOIN test      t            ON t.id    = cstq.test_id
JOIN test_question_type qt  ON qt.id   = q.test_question_type_id
JOIN question_type qty      ON qty.id  = q.question_type_id
JOIN answer    a            ON a.question_id = q.id
WHERE t.id = @test_id
  AND (@student_id IS NULL OR cst.student_id = @student_id)
  AND (@attempt_id IS NULL OR cst.id         = @attempt_id)
GROUP BY cst.id, cst.code, usr.name, usr.last_name, qty.name, qty.id, qt.value, q.id, q.header
ORDER BY cst.id, qty.id, q.id;


-- =============================================================================
-- 8) EXAMEN: RESULTADO GLOBAL POR ALUMNO (aprobado / reprobado)
-- =============================================================================

SELECT
    cst.id            AS intento_id,
    cst.code          AS codigo_intento,
    stu.id            AS alumno_id,
    usr.name          AS alumno_nombre,
    usr.last_name     AS alumno_apellido,
    cst.attempts      AS intento_nro,
    cst.date          AS fecha,
    cst.finished      AS finalizado,
    ROUND(IFNULL(SUM(csta.score), 0), 2) AS puntaje_obtenido,
    ROUND(SUM(qt.value), 2)              AS puntaje_total,
    t.min_score       AS puntaje_minimo,
    cst.approve       AS aprobado
FROM course_student_test cst
JOIN student stu   ON stu.id = cst.student_id
JOIN user usr      ON usr.id = stu.user_id
JOIN test     t   ON t.id   = cst.test_id
LEFT JOIN course_student_test_question cstq ON cstq.course_student_test_id = cst.id
LEFT JOIN course_student_test_answer  csta ON csta.course_student_test_question_id = cstq.id
LEFT JOIN question q            ON q.id  = cstq.question_id
LEFT JOIN test_question_type qt ON qt.id = q.test_question_type_id
WHERE t.id = @test_id
  AND (@student_id IS NULL OR cst.student_id = @student_id)
GROUP BY cst.id, cst.code, stu.id, usr.name, usr.last_name, cst.attempts, cst.date,
         cst.finished, t.min_score, cst.approve
ORDER BY puntaje_obtenido DESC, alumno_apellido, alumno_nombre;


-- =============================================================================
-- 9) EXAMEN POR CÓDIGO (alternativa a @test_id)
--    Reemplaza el filtro `t.id = @test_id` por:
--        WHERE t.code = @test_code
-- =============================================================================

-- SELECT
--     t.id AS test_id, t.code AS test_code, c.name AS curso,
--     qty.name AS tipo, q.header AS pregunta,
--     GROUP_CONCAT(CONCAT(a.value, CASE WHEN a.is_correct = 1 THEN ' <== CORRECTA' ELSE '' END)
--                   ORDER BY a.is_correct DESC, a.id SEPARATOR ' | ') AS respuestas
-- FROM test t
-- JOIN course c ON c.id = t.course_id
-- JOIN test_question_type qt ON qt.test_id = t.id
-- JOIN question_type qty     ON qty.id = qt.question_type_id
-- JOIN question  q           ON q.test_id = t.id AND q.test_question_type_id = qt.id
-- JOIN answer    a           ON a.question_id = q.id
-- WHERE t.code = @test_code
-- GROUP BY t.id, t.code, c.name, qty.name, qty.id, q.id, q.header
-- ORDER BY qty.id, q.id;

'use strict';

/**
 * Tabla puente `course_test` (examenes compartidos entre cursos).
 *
 * `test.course_id` se mantiene como el curso DUENO (autoria) y nunca se hace
 * nullable. La visibilidad de un examen para otros cursos se resuelve con esta
 * tabla: un `test` puede estar vinculado a N cursos de teoria
 * (`course_type_id = 1`).
 *
 * Backfill: cada examen existente se vincula a su curso dueno, de modo que el
 * comportamiento actual no cambia al desplegar la Fase 1. El `INSERT` usa
 * `ON DUPLICATE KEY UPDATE` para poder re-ejecutarse sin duplicar vinculos.
 *
 * NO se ejecuta automaticamente: correr `npm run migrate` manualmente ANTES de
 * desplegar codigo que lea por vinculo. Sin esta tabla, cualquier include de
 * `Course.tests` / `test.courses` falla.
 */
const tableExists = async (queryInterface, table) => {
	const [rows] = await queryInterface.sequelize.query(
		`SELECT COUNT(*) AS total
		 FROM information_schema.TABLES
		 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
		{ replacements: [table] },
	);
	return Number(rows[0].total) > 0;
};

module.exports = {
	async up(queryInterface, Sequelize) {
		if (!(await tableExists(queryInterface, 'course_test'))) {
			await queryInterface.createTable('course_test', {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true,
					allowNull: false,
				},
				course_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'course',
						key: 'id',
					},
					onUpdate: 'CASCADE',
					onDelete: 'CASCADE',
				},
				test_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'test',
						key: 'id',
					},
					onUpdate: 'CASCADE',
					onDelete: 'CASCADE',
				},
				created_at: {
					type: Sequelize.DATE,
					allowNull: false,
					defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
				},
				updated_at: {
					type: Sequelize.DATE,
					allowNull: false,
					defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
				},
			});

			await queryInterface.addIndex(
				'course_test',
				['course_id', 'test_id'],
				{
					name: 'uq_course_test_course_id_test_id',
					unique: true,
					using: 'BTREE',
				},
			);

			await queryInterface.addIndex('course_test', ['course_id'], {
				name: 'fk_course_test_course_idx',
				using: 'BTREE',
			});

			await queryInterface.addIndex('course_test', ['test_id'], {
				name: 'fk_course_test_test_idx',
				using: 'BTREE',
			});
		}

		// Backfill idempotente: vincula cada examen con su curso dueno actual.
		await queryInterface.sequelize.query(
			`INSERT INTO course_test (course_id, test_id, created_at, updated_at)
			 SELECT t.course_id, t.id, NOW(), NOW()
			 FROM test t
			 INNER JOIN course c ON c.id = t.course_id
			 ON DUPLICATE KEY UPDATE test_id = VALUES(test_id)`,
		);
	},

	async down(queryInterface) {
		if (await tableExists(queryInterface, 'course_test')) {
			await queryInterface.dropTable('course_test');
		}
	},
};

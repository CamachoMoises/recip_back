'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('attendance', 'day', {
			type: Sequelize.INTEGER,
			allowNull: true,
		});

		await queryInterface.sequelize.query(`
			UPDATE attendance a
			JOIN (
				SELECT id, ROW_NUMBER() OVER (
					PARTITION BY course_student_id
					ORDER BY date ASC, id ASC
				) AS rn
				FROM attendance
			) x ON a.id = x.id
			SET a.day = x.rn
		`);

		await queryInterface.changeColumn('attendance', 'day', {
			type: Sequelize.INTEGER,
			allowNull: false,
		});

		await queryInterface.addIndex('attendance', ['course_student_id', 'day'], {
			name: 'uq_attendance_course_student_day',
			unique: true,
		});
	},

	async down(queryInterface) {
		await queryInterface.removeIndex(
			'attendance',
			'uq_attendance_course_student_day'
		);
		await queryInterface.removeColumn('attendance', 'day');
	},
};

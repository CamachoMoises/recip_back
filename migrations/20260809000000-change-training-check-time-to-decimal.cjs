'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn(
			'course_student_assessment_day',
			'training_time_f',
			{
				type: Sequelize.FLOAT,
				allowNull: true,
			},
		);
		await queryInterface.addColumn(
			'course_student_assessment_day',
			'check_time_f',
			{
				type: Sequelize.FLOAT,
				allowNull: true,
			},
		);

		await queryInterface.sequelize.query(`
			UPDATE course_student_assessment_day
			SET training_time_f = ROUND(TIME_TO_SEC(training_time) / 3600, 2),
				check_time_f = ROUND(TIME_TO_SEC(check_time) / 3600, 2)
			WHERE training_time IS NOT NULL OR check_time IS NOT NULL;
		`);

		await queryInterface.removeColumn(
			'course_student_assessment_day',
			'training_time',
		);
		await queryInterface.removeColumn(
			'course_student_assessment_day',
			'check_time',
		);

		await queryInterface.addColumn(
			'course_student_assessment_day',
			'training_time',
			{
				type: Sequelize.FLOAT,
				allowNull: true,
				after: 'landing_night',
			},
		);
		await queryInterface.addColumn(
			'course_student_assessment_day',
			'check_time',
			{
				type: Sequelize.FLOAT,
				allowNull: true,
				after: 'training_time',
			},
		);

		await queryInterface.sequelize.query(`
			UPDATE course_student_assessment_day
			SET training_time = training_time_f,
				check_time = check_time_f;
		`);

		await queryInterface.removeColumn(
			'course_student_assessment_day',
			'training_time_f',
		);
		await queryInterface.removeColumn(
			'course_student_assessment_day',
			'check_time_f',
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.addColumn(
			'course_student_assessment_day',
			'training_time_f',
			{
				type: Sequelize.TIME,
				allowNull: true,
			},
		);
		await queryInterface.addColumn(
			'course_student_assessment_day',
			'check_time_f',
			{
				type: Sequelize.TIME,
				allowNull: true,
			},
		);

		await queryInterface.sequelize.query(`
			UPDATE course_student_assessment_day
			SET training_time_f = SEC_TO_TIME(ROUND(training_time * 3600)),
				check_time_f = SEC_TO_TIME(ROUND(check_time * 3600))
			WHERE training_time IS NOT NULL OR check_time IS NOT NULL;
		`);

		await queryInterface.removeColumn(
			'course_student_assessment_day',
			'training_time',
		);
		await queryInterface.removeColumn(
			'course_student_assessment_day',
			'check_time',
		);

		await queryInterface.addColumn(
			'course_student_assessment_day',
			'training_time',
			{
				type: Sequelize.TIME,
				allowNull: true,
				after: 'landing_night',
			},
		);
		await queryInterface.addColumn(
			'course_student_assessment_day',
			'check_time',
			{
				type: Sequelize.TIME,
				allowNull: true,
				after: 'training_time',
			},
		);

		await queryInterface.sequelize.query(`
			UPDATE course_student_assessment_day
			SET training_time = training_time_f,
				check_time = check_time_f;
		`);

		await queryInterface.removeColumn(
			'course_student_assessment_day',
			'training_time_f',
		);
		await queryInterface.removeColumn(
			'course_student_assessment_day',
			'check_time_f',
		);
	},
};

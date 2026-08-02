'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn(
			'course_student_assessment_day',
			'takeoff_day',
			{
				type: Sequelize.INTEGER,
				allowNull: true,
			},
		);

		await queryInterface.addColumn(
			'course_student_assessment_day',
			'takeoff_night',
			{
				type: Sequelize.INTEGER,
				allowNull: true,
			},
		);

		await queryInterface.addColumn(
			'course_student_assessment_day',
			'landing_day',
			{
				type: Sequelize.INTEGER,
				allowNull: true,
			},
		);

		await queryInterface.addColumn(
			'course_student_assessment_day',
			'landing_night',
			{
				type: Sequelize.INTEGER,
				allowNull: true,
			},
		);

		await queryInterface.addColumn(
			'course_student_assessment_day',
			'training_time',
			{
				type: Sequelize.TIME,
				allowNull: true,
			},
		);

		await queryInterface.addColumn(
			'course_student_assessment_day',
			'check_time',
			{
				type: Sequelize.TIME,
				allowNull: true,
			},
		);

		await queryInterface.addColumn(
			'course_student_assessment_day',
			'type',
			{
				type: Sequelize.STRING(50),
				allowNull: true,
			},
		);
	},

	async down(queryInterface) {
		await queryInterface.removeColumn(
			'course_student_assessment_day',
			'type',
		);
		await queryInterface.removeColumn(
			'course_student_assessment_day',
			'takeoff_day',
		);
		await queryInterface.removeColumn(
			'course_student_assessment_day',
			'takeoff_night',
		);
		await queryInterface.removeColumn(
			'course_student_assessment_day',
			'landing_day',
		);
		await queryInterface.removeColumn(
			'course_student_assessment_day',
			'landing_night',
		);
		await queryInterface.removeColumn(
			'course_student_assessment_day',
			'training_time',
		);
		await queryInterface.removeColumn(
			'course_student_assessment_day',
			'check_time',
		);
	},
};

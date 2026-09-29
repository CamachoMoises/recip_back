'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn(
			'course_student_assessment_day',
			'landing_precision',
			{
				type: Sequelize.INTEGER,
				allowNull: true,
			},
		);

		await queryInterface.addColumn(
			'course_student_assessment_day',
			'landing_non_precision',
			{
				type: Sequelize.INTEGER,
				allowNull: true,
			},
		);

		await queryInterface.addColumn(
			'course_student_assessment_day',
			'landing_gps',
			{
				type: Sequelize.INTEGER,
				allowNull: true,
			},
		);

		await queryInterface.addColumn(
			'course_student_assessment_day',
			'landing_circuit',
			{
				type: Sequelize.INTEGER,
				allowNull: true,
			},
		);

		await queryInterface.addColumn(
			'course_student_assessment_day',
			'landing_visual',
			{
				type: Sequelize.INTEGER,
				allowNull: true,
			},
		);
	},

	async down(queryInterface) {
		await queryInterface.removeColumn(
			'course_student_assessment_day',
			'landing_visual',
		);
		await queryInterface.removeColumn(
			'course_student_assessment_day',
			'landing_circuit',
		);
		await queryInterface.removeColumn(
			'course_student_assessment_day',
			'landing_gps',
		);
		await queryInterface.removeColumn(
			'course_student_assessment_day',
			'landing_non_precision',
		);
		await queryInterface.removeColumn(
			'course_student_assessment_day',
			'landing_precision',
		);
	},
};

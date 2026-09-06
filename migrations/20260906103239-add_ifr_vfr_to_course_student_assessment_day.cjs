'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn(
			'course_student_assessment_day',
			'ifr_time',
			{
				type: Sequelize.FLOAT,
				allowNull: true,
			},
		);

		await queryInterface.addColumn(
			'course_student_assessment_day',
			'vfr_time',
			{
				type: Sequelize.FLOAT,
				allowNull: true,
			},
		);
	},

	async down(queryInterface) {
		await queryInterface.removeColumn(
			'course_student_assessment_day',
			'ifr_time',
		);

		await queryInterface.removeColumn(
			'course_student_assessment_day',
			'vfr_time',
		);
	},
};
'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('course_student', 'instructor_code', {
			type: Sequelize.TEXT,
			allowNull: true,
			defaultValue: null,
		});
	},
	async down(queryInterface) {
		await queryInterface.removeColumn('course_student', 'instructor_code');
	},
};

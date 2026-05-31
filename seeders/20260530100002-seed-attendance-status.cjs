'use strict';

module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert('attendance_status', [
			{
				name: 'Present',
				description: 'Student was present',
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				name: 'Absent',
				description: 'Student was absent',
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				name: 'Late',
				description: 'Student arrived late',
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				name: 'Excused',
				description: 'Student was absent with justification',
				created_at: new Date(),
				updated_at: new Date(),
			},
		]);
	},

	async down(queryInterface) {
		await queryInterface.bulkDelete('attendance_status', null, {});
	},
};

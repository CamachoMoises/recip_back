'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('user', 'rank', {
			type: Sequelize.TEXT,
			allowNull: true,
			defaultValue: null,
		});
	},
	async down(queryInterface) {
		await queryInterface.removeColumn('user', 'rank');
	},
};

'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('email_history', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'user',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			nombre_archivo: {
				type: Sequelize.STRING(500),
				allowNull: false,
			},
			fecha: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			tipo: {
				type: Sequelize.STRING(100),
				allowNull: false,
				defaultValue: 'correo',
			},
			descripcion: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			modulo: {
				type: Sequelize.TEXT,
				allowNull: true,
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
	},

	async down(queryInterface) {
		await queryInterface.dropTable('email_history');
	},
};

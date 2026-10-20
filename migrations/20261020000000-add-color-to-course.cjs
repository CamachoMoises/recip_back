'use strict';

/**
 * Agrega la columna `color` a `course` para almacenar un string (hex, nombre,
 * etc.) que el frontend usa para pintar el curso.
 *
 * - `allowNull: true` sin default: los cursos existentes quedan en NULL y el
 *   valor solo lo asigna el cliente via POST/PUT /api/courses.
 *
 * NO se ejecuta automaticamente: correr `npm run migrate` manualmente.
 */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('course', 'color', {
			type: Sequelize.STRING(50),
			allowNull: true,
			defaultValue: null,
		});
	},

	async down(queryInterface) {
		await queryInterface.removeColumn('course', 'color');
	},
};

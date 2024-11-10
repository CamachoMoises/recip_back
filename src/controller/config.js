import { sequelize } from '../database/initDB.js';

export const createTriggers = async (req, res) => {
	const message = [];
	// Crear un trigger para una tabla llamada `Users`
	const insert1 = `INSERT INTO recip_db.course_type (name, created_at, updated_at) VALUES ('Teorico-tierra', '2024-10-27 13:15:06', '2024-10-27 13:15:06');`;
	const insert2 = `INSERT INTO recip_db.course_type (name, created_at, updated_at) VALUES ('Practico-tierra', '2024-10-27 13:15:06', '2024-10-27 13:15:06');`;
	try {
		await sequelize.query(insert1);
		message.push('Tipo Terico creado con éxito');
	} catch (error) {
		message.push(error.parent.code);
	}
	try {
		await sequelize.query(insert2);
		message.push('Tipo practico creado con éxito');
	} catch (error) {
		message.push(error.parent.code);
	}

	const insert3 = `INSERT INTO recip_db.course (name, description, hours, days, status, created_at, updated_at, course_type_id) VALUES ('King Air B200 Curso de Entrenamiento Inicial', 'Verificación de Competencia/Calificación del Piloto Registro de Entrenamiento de Escuela en Tierra', '20', '2',  '1', '2024-10-27 13:15:06', '2024-10-27 13:15:06', '1');`;
	try {
		await sequelize.query(insert3);
		message.push('Curso King Air B200 en Tierra creado con éxito');
	} catch (error) {
		message.push(error.parent.code);
	}
	const trg = ` CREATE TRIGGER update_student_instructor BEFORE UPDATE ON user FOR EACH ROW BEGIN UPDATE student SET status = NEW.is_active WHERE (user_id = NEW.id); END;`;
	try {
		await sequelize.query(trg);
		message.push('user trigger creado');
	} catch (error) {
		message.push(error.parent.code);
	}

	res.status(200).json({ message: message });
};

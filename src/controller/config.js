import { sequelize } from '../database/initDB.js';
import { generateRandomNumber } from './utilities.js';

export const createTriggers = async (req, res) => {
	const message = [];
	// Crear un trigger para una tabla llamada `Users`
	const insert1 = `INSERT INTO recip_db.course_type (name, created_at, updated_at) VALUES ('Escuela en Tierra', '2024-10-27 13:15:06', '2024-10-27 13:15:06');`;
	const insert2 = `INSERT INTO recip_db.course_type (name, created_at, updated_at) VALUES ('Vuelo en FSTD', '2024-10-27 13:15:06', '2024-10-27 13:15:06');`;
	const insert3 = `INSERT INTO recip_db.course_level (name, created_at, updated_at) VALUES ('Inicial', '2024-10-27 13:15:06', '2024-10-27 13:15:06');`;
	const insert4 = `INSERT INTO recip_db.course_level (name, created_at, updated_at) VALUES ('Recurente', '2024-10-27 13:15:06', '2024-10-27 13:15:06');`;
	const insert5 = `INSERT INTO recip_db.course (name, description, hours, days, status, created_at, updated_at, course_type_id, course_level_id) VALUES ('King Air B200 Curso de Entrenamiento Inicial', 'Verificación de Competencia/Calificación del Piloto Registro de Entrenamiento de Escuela en Tierra', '20', '2',  '1', '2024-10-27 13:15:06', '2024-10-27 13:15:06', '1', '1');`;
	const insert6 = `INSERT INTO recip_db.user_doc_type (name, symbol, created_at, updated_at) VALUES ('Venezolano', 'V', '2024-11-17 19:20:12', '2024-11-17 19:20:12')`;
	const insert7 = `INSERT INTO recip_db.user_doc_type (name, symbol, created_at, updated_at) VALUES ('Extranjero', 'E', '2024-11-17 19:20:12', '2024-11-17 19:20:12')`;
	const insert8 = `INSERT INTO recip_db.user_doc_type (name, symbol, created_at, updated_at) VALUES ('Juridico', 'J', '2024-11-17 19:20:12', '2024-11-17 19:20:12')`;
	const insert9 = `INSERT INTO user (id,uuid,name,doc_number,user_doc_type_id,phone,last_name,password,email,is_superuser,is_staff,is_active,created_at,updated_at) VALUES (DEFAULT,'8fd4f24a-${generateRandomNumber(
		4
	)}-417c-bb16-acf49af3ad35','Moises','22035534','1','4263926273','Camacho','123456789','Moisescamacho26@gmail.com' ,0,0,1,'2024-11-17 19:20:12','2024-11-17 19:20:12')`;
	const insert10 = `INSERT INTO user (id,uuid,name,doc_number,user_doc_type_id,phone,last_name,password,email,is_superuser,is_staff,is_active,created_at,updated_at) VALUES (DEFAULT,'8fd4f24a-${generateRandomNumber(
		4
	)}-417c-bb16-acf49af3ad35','Pedro','23123213','1','4120894700','Perez','123456789','test@test.com' ,0,0,1,'2024-11-17 19:20:12','2024-11-17 19:20:12')`;

	try {
		await sequelize.query(insert1);
		message.push('Tipo Escuela en tierra creado con éxito');
	} catch (error) {
		message.push(error.parent);
	}
	try {
		await sequelize.query(insert2);
		message.push('Tipo Vuelo en FSTD creado con éxito');
	} catch (error) {
		message.push(error.parent);
	}
	try {
		await sequelize.query(insert3);
		message.push('Nivel Inicial creado con éxito');
	} catch (error) {
		message.push(error.parent);
	}
	try {
		await sequelize.query(insert4);
		message.push('Nivel Recurente creado con éxito');
	} catch (error) {
		message.push(error.parent);
	}

	try {
		await sequelize.query(insert5);
		message.push('Curso King Air B200 en Tierra creado con éxito');
	} catch (error) {
		message.push(error.parent);
	}
	try {
		await sequelize.query(insert6);
		message.push('Se creo el tipo Venezolano');
	} catch (error) {
		message.push(error.parent);
	}
	try {
		await sequelize.query(insert7);
		message.push('Se creo el tipo Extranjero');
	} catch (error) {
		message.push(error.parent);
	}
	try {
		await sequelize.query(insert8);
		message.push('Se creo el tipo Juridico');
	} catch (error) {
		message.push(error.parent);
	}
	try {
		await sequelize.query(insert9);
		message.push('Se creo el usuario Moises');
	} catch (error) {
		message.push(error.parent);
	}
	try {
		await sequelize.query(insert10);
		message.push('Se creo el usuario Pedro');
	} catch (error) {
		message.push(error.parent);
	}
	const trg = `CREATE TRIGGER update_student_instructor
		BEFORE UPDATE ON user
		FOR EACH ROW
		BEGIN
			UPDATE student SET status = NEW.is_active WHERE (user_id = NEW.id);
			UPDATE instructor SET status = NEW.is_active WHERE (user_id = NEW.id);
		END;`;

	const trg2 = `CREATE TRIGGER subject_AFTER_INSERT
		AFTER INSERT ON subject FOR EACH ROW
		BEGIN
			UPDATE recip_db.course 
			SET 
				hours = (SELECT 
						SUM(hours) as hours
					FROM
						recip_db.subject
					WHERE
						course_id = new.course_id
					GROUP BY course_id)
			WHERE
				(id = new.course_id);
		END;`;
	const trg3 = `CREATE TRIGGER subject_AFTER_UPDATE
		AFTER UPDATE ON subject FOR EACH ROW
		BEGIN
			UPDATE recip_db.course 
			SET 
				hours = (SELECT 
						SUM(hours) as hours
					FROM
						recip_db.subject
					WHERE
						course_id = new.course_id
					GROUP BY course_id)
			WHERE
				(id = new.course_id);
		END;`;
	try {
		await sequelize.query(trg);
		message.push('user trigger 1 creado');
	} catch (error) {
		message.push(error.parent);
	}

	try {
		await sequelize.query(trg2);
		message.push('user trigger 2 creado');
	} catch (error) {
		message.push(error.parent);
	}

	try {
		await sequelize.query(trg3);
		message.push('user trigger 3 creado');
	} catch (error) {
		message.push(error.parent);
	}

	res.status(200).json({ message: message });
};

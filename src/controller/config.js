import { sequelize } from '../database/initDB.js';

export const createTriggers = async (req, res) => {
	// Crear un trigger para una tabla llamada `Users`
	const trg = `
  CREATE TRIGGER update_student_instructor
  BEFORE UPDATE ON user
  FOR EACH ROW
  BEGIN
    UPDATE student SET status = NEW.is_active WHERE (user_id = NEW.id);
  END;`;
	sequelize
		.query(trg)
		.then(() => {
			res
				.status(200)
				.json({ message: 'Trigger created successfully' });
		})
		.catch((error) => {
			res.status(500).json({
				message: 'Error creating trigger',
				error: error.message,
			});
		});
};

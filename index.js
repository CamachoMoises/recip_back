import app from './src/app.js';
import { sequelize } from './src/database/initDB.js';
const PORT = 3000;

async function assertDbConnection() {
	try {
		await sequelize.authenticate();
	} catch (error) {
		console.log('sequelizee error !!!!', error);
	}
}

async function init() {
	try {
		await assertDbConnection();
		await sequelize.sync({ force: false });
		// Ruta básica para la raíz
		app.get('/', (req, res) => {
			res.send('¡Hola, mundo desde Express!!!!!');
		});

		// Iniciar el servidor
		app.listen(PORT, () => {
			console.log(
				`Servidor ejecutándose! en http://localhost:${PORT}`
			);
		});
	} catch (error) {
		console.log(error);
		// eslint-disable-next-line no-undef
		process.exit(1);
	}
}

init();

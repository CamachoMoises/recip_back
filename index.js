const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3000;

app.use(cors());
// Ruta básica para la raíz
app.get('/', (req, res) => {
	res.send('¡Hola, mundo desde Express!');
});

// Iniciar el servidor
app.listen(PORT, () => {
	console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

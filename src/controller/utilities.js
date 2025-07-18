const saltRounds = 10;
import bcrypt from 'bcrypt';
export const generateRandomNumber = (digits) => {
	if (digits <= 0) return 0;

	const min = Math.pow(10, digits - 1); // Mínimo valor (por ejemplo, 1000 para 4 dígitos)
	const max = Math.pow(10, digits) - 1; // Máximo valor (por ejemplo, 9999 para 4 dígitos)

	return Math.floor(min + Math.random() * (max - min + 1));
};

export function getRandomSubset(array, newLength) {
	if (array.length < newLength) {
		console.log(`El array debe tener más de ${newLength} elementos.`);
		throw new Error(
			`El array debe tener más de ${newLength} elementos.`
		);
	} else {
		const shuffled = [...array].sort(() => Math.random() - 0.5); // Mezclar el array
		return shuffled.slice(0, newLength); // Tomar los primeros 10 elementos
	}
}

export const cleanString = (input) => {
	return input.trim().toLowerCase().replace(/\s+/g, '');
};

export const hashPassword = async (password) => {
	return await bcrypt.hash(password, saltRounds);
};

export function redondear(monto, decimales) {
	const montoPotencia = Math.round(monto * 100) / 100;
	const nuevoValor = parseFloat(montoPotencia.toFixed(decimales));
	return nuevoValor;
}
export function stringToBoolean(str) {
	if (str === 'true') return true;
	if (str === 'false') return false;
	throw new Error('El string no es "true" ni "false"');
}

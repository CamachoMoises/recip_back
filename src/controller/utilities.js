const saltRounds = 10;
import bcrypt from 'bcryptjs';
export const generateRandomNumber = (digits) => {
	if (digits <= 0) return 0;

	const min = Math.pow(10, digits - 1); // Mínimo valor (por ejemplo, 1000 para 4 dígitos)
	const max = Math.pow(10, digits) - 1; // Máximo valor (por ejemplo, 9999 para 4 dígitos)

	return Math.floor(min + Math.random() * (max - min + 1));
};

export const getRandomSubset = (array, newLength) => {
	if (array.length < newLength) {
		console.log(`El array debe tener más de ${newLength} elementos.`);
		throw new Error(
			`El array debe tener más de ${newLength} elementos.`,
		);
	} else {
		const shuffled = [...array].sort(() => Math.random() - 0.5); // Mezclar el array
		return shuffled.slice(0, newLength); // Tomar los primeros 10 elementos
	}
};

export const cleanString = (input) => {
	if (input === null || input === undefined) return '';
	return String(input).trim().toLowerCase().replace(/\s+/g, '');
};

export const hashPassword = (password) => {
	return bcrypt.hashSync(password, saltRounds);
};

export const redondear = (monto, decimales) => {
	const factor = Math.pow(10, decimales);
	return Math.round(monto * factor) / factor;
};

export const stringToBoolean = (str) => {
	if (str === 'true') return true;
	if (str === 'false') return false;
	throw new Error('El string no es "true" ni "false"');
};

export const generateRandomNumber = (digits) => {
	if (digits <= 0) return 0;

	const min = Math.pow(10, digits - 1); // Mínimo valor (por ejemplo, 1000 para 4 dígitos)
	const max = Math.pow(10, digits) - 1; // Máximo valor (por ejemplo, 9999 para 4 dígitos)

	return Math.floor(min + Math.random() * (max - min + 1));
};

export function getRandomSubset(array, minLength, newLength) {
	if (array.length <= minLength || newLength > minLength) {
		console.log(`El array debe tener más de ${minLength} elementos.`);
		throw new Error(
			`El array debe tener más de ${minLength} elementos.`
		);
	}

	const shuffled = [...array].sort(() => Math.random() - 0.5); // Mezclar el array
	return shuffled.slice(0, newLength); // Tomar los primeros 10 elementos
}

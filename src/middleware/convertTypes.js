// middleware/convertTypes.js
export default function convertTypes(req, res, next) {
	const convertValue = (value) => {
		if (value === 'true') return true;
		if (value === 'false') return false;
		if (!isNaN(value) && value.trim() !== '') return Number(value); // Convertir a número si es posible
		return value;
	};

	const convertBodyTypes = (obj) => {
		for (const key in obj) {
			if (typeof obj[key] === 'string') {
				obj[key] = convertValue(obj[key]);
			} else if (typeof obj[key] === 'object' && obj[key] !== null) {
				convertBodyTypes(obj[key]); // Recursión para objetos anidados
			}
		}
	};

	convertBodyTypes(req.body);
	next();
}

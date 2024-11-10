import {
	getAllCourseSubjects,
	getAllSubjects,
} from '../database/repositories/subject.js';

export const ListSubjects = async (req, res) => {
	try {
		const subjects = await getAllSubjects();
		res.send(subjects);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const ListSubjectsCourse = async (req, res) => {
	const id = req.params.id;
	try {
		const subjects = await getAllCourseSubjects(id);
		res.send(subjects);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

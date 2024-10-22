import { models } from '../initDB.js';

const { Subject } = models;

const getAllSubjects = async () => Subject.findAll();

export { getAllSubjects };

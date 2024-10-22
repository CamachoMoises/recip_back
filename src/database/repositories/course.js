import { models } from '../initDB.js';

const { Course } = models;

const getAllCourses = async () => Course.findAll();

export { getAllCourses };

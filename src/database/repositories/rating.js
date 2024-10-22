import { models } from '../initDB.js';

const { Rating } = models;

const getAllRatings = async () => Rating.findAll();

export { getAllRatings };

import { models } from '../initDB.js';

const { Rating } = models;

const getAllRatings = async () => await Rating.findAll();

export { getAllRatings };

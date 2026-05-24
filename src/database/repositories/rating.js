import { models } from '../index.js';

const { Rating } = models;

const getAllRatings = async () => await Rating.findAll();

export { getAllRatings };

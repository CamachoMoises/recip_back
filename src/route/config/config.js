import express from 'express';
import multer from 'multer';

import convertTypes from '../../middleware/convertTypes.js';
import { createTriggers } from '../../controller/config.js';
const upload = multer();
const router = express.Router();

router.get('/', createTriggers);

export default router;

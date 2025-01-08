import express from 'express';
import multer from 'multer';

import convertTypes from '../middleware/convertTypes.js';
import { Login } from '../controller/authentication.js';

const upload = multer();
const router = express.Router();

router.post('/', upload.none(), convertTypes, Login);

export default router;

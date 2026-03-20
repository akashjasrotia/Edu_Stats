import express from 'express';
import { getDataById } from '../controllers/dataController.js';

const router = express.Router();

// Route to fetch data by ID
router.get('/data/:id', getDataById);

export default router;
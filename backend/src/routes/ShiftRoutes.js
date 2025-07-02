import express from 'express';
import { createShift, deleteShift } from '../controllers/ShiftController.js';
const router = express.Router();

router.post('/new', createShift)
router.delete('/:id', deleteShift);

export default router;
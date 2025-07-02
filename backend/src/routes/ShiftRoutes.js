import express from 'express';
import { createShift, deleteShift, getShifts } from '../controllers/ShiftController.js';
const router = express.Router();

router.post('/new', createShift)
router.delete('/:id', deleteShift);
router.get("/get", getShifts);

export default router;
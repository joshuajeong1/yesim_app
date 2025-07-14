import express from 'express';
import { createShift, deleteShift, getShiftByUserDay, getShifts, updateShift } from '../controllers/ShiftController.js';
const router = express.Router();

router.post('/new', createShift)
router.delete('/:id', deleteShift);
router.get("/get", getShifts);
router.get("/userday", getShiftByUserDay);
router.post('/edit', updateShift);
export default router;
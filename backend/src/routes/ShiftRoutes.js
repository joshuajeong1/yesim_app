import express from 'express';
import { createShift, deleteShift, getShiftByUserDay, getShifts, postShift, updateShift } from '../controllers/ShiftController.js';
const router = express.Router();

router.post('/new', createShift)
router.delete('/:id', deleteShift);
router.get("/get", getShifts);
router.get("/userday", getShiftByUserDay);
router.post('/edit', updateShift);
router.post('/post', postShift);
export default router;
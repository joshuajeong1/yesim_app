import express from 'express';
import { createShift, deleteShift, getShiftByUserDay, getShifts, postShift, updateShift } from '../controllers/ShiftController.js';
import { authenticateJWT } from '../middleware/authenticateToken.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
const router = express.Router();

router.post('/new', authenticateJWT, requireAdmin, createShift)
router.delete('/:id', authenticateJWT, requireAdmin, deleteShift);
router.get("/get", getShifts);
router.get("/userday", getShiftByUserDay);
router.post('/edit', authenticateJWT, requireAdmin, updateShift);
router.post('/post', authenticateJWT, requireAdmin, postShift);
export default router;
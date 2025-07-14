import express from 'express';
import { createShift, deleteShift, getShiftByUserDay, getShifts, postShift, updateShift } from '../controllers/ShiftController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
const router = express.Router();

router.post('/new', authenticateToken, requireAdmin, createShift)
router.delete('/:id', authenticateToken, requireAdmin, deleteShift);
router.get("/get", getShifts);
router.get("/userday", authenticateToken, requireAdmin, getShiftByUserDay);
router.post('/edit', authenticateToken, requireAdmin, updateShift);
router.post('/post', authenticateToken, requireAdmin, postShift);
export default router;
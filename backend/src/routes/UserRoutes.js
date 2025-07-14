import express from 'express';
import { createUser, getUsers, getUsersFull, deleteUser, updatePay } from '../controllers/UserController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
const router = express.Router();

router.post('/new', authenticateToken, requireAdmin, createUser)
router.get('/get', getUsers)
router.get('/getall', authenticateToken, requireAdmin, getUsersFull)
router.delete('/:id', authenticateToken, requireAdmin, deleteUser)
router.post('/update', authenticateToken, requireAdmin, updatePay)
export default router;
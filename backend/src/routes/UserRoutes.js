import express from 'express';
import { createUser, getUsers, getUsersFull, deleteUser, updatePay } from '../controllers/UserController.js';
import { authenticateJWT } from '../middleware/authenticateToken.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
const router = express.Router();

router.post('/new', authenticateJWT, requireAdmin, createUser)
router.get('/get', getUsers)
router.get('/getall', authenticateJWT, requireAdmin, getUsersFull)
router.delete('/:id', authenticateJWT, requireAdmin, deleteUser)
router.post('/update', authenticateJWT, requireAdmin, updatePay)
export default router;
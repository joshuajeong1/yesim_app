import express from 'express';
import { createUser, getUsers, getUsersFull, deleteUser, updatePay } from '../controllers/UserController.js';
const router = express.Router();

router.post('/new', createUser)
router.get('/get', getUsers)
router.get('/getall', getUsersFull)
router.delete('/:id', deleteUser)
router.post('/update', updatePay)
export default router;
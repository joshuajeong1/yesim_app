import express from 'express';
import { autoCreatePeriod, createPayPeriod, getPayPeriods } from '../controllers/PayPeriodController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = express.Router();
router.use(authenticateToken);
router.use(requireAdmin);

router.post("/new", createPayPeriod);
router.post("/auto", autoCreatePeriod);
router.get("/get", getPayPeriods);
    
export default router;
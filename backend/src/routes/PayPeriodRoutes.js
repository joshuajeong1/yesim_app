import express from 'express';
import { autoCreatePeriod, createPayPeriod, getPayPeriods } from '../controllers/PayPeriodController.js';
import { authenticateJWT } from '../middleware/authenticateToken.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
const router = express.Router();

router.post("/new", authenticateJWT, requireAdmin, createPayPeriod);
router.post("/auto", authenticateJWT, requireAdmin, autoCreatePeriod);
router.get("/get", getPayPeriods);
    
export default router;
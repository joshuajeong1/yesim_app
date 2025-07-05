import express from 'express';
import { autoCreatePeriod, createPayPeriod, getPayPeriods } from '../controllers/PayPeriodController.js';
const router = express.Router();

router.post("/new", createPayPeriod);
router.post("/auto", autoCreatePeriod);
router.get("/get", getPayPeriods);
    
export default router;
import express from 'express';
import { autoCreatePeriod, createPayPeriod } from '../controllers/PayPeriodController.js';
const router = express.Router();

router.post("/new", createPayPeriod);
router.post("/auto", autoCreatePeriod)
export default router;
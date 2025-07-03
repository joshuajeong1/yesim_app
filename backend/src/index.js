import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import UserRoutes from './routes/UserRoutes.js'
import ShiftRoutes from './routes/ShiftRoutes.js'
import PayPeriodRoutes from './routes/PayPeriodRoutes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use("/api/user", UserRoutes);
app.use("/api/shift", ShiftRoutes);
app.use("/api/period", PayPeriodRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
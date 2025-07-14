import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import UserRoutes from './routes/UserRoutes.js'
import ShiftRoutes from './routes/ShiftRoutes.js'
import PayPeriodRoutes from './routes/PayPeriodRoutes.js'
import authRoutes from './routes/AuthRoutes.js'
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const allowedOrigins = [
  "http://localhost:3000",
  "https://yesim-scheduling.vercel.app",
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use("/api/user", UserRoutes);
app.use("/api/shift", ShiftRoutes);
app.use("/api/period", PayPeriodRoutes);
app.use("/api/auth/", authRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
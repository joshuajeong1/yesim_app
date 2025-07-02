import { PrismaClient } from '@prisma/client';
import { addShift, removeShift, getAllShifts } from '../services/ShiftServices.js';
const prisma = new PrismaClient();


export const createShift = async (req, res) => {
    const { userId, startTime, endTime } = req.body;

    if (!userId || !startTime || !endTime ) {
        return res.status(400).json({ error: "Missing required fields" })
    }
    try {
        const newShift = await addShift(userId, startTime, endTime);
        res.status(201).json(newShift);
    }
    catch (error) {
        console.error("Error creating shift: ", error)
        res.status(500).json({ error: "Internal server error"});
    }
};

export const deleteShift = async (req, res) => {
    const shiftId = Number(req.params.id);

    try {
        const deleted = await removeShift(shiftId);
        res.status(200).json({
            message: "Shift successfully deleted",
            shift: deleted,
        });
    }
    catch (error) {
        console.error("Error deleting shift: ", error);
        res.status(500).json({ 
            error: "Internal server error",
        })
    }
}

export const getShifts = async (req, res) => {
    const { start, end } = req.query;

    if(!start || !end) {
        return res.status(400).json({ error: "Missing start or end time"});
    }

    try {
        const startDate = new Date(start);
        const endDate = new Date(end);

        const shifts = await getAllShifts(startDate, endDate);

        const data = shifts.map(shift => ({
            id: shift.id,
            username: shift.user.username,
            startTime: shift.startTime,
            endTime: shift.endTime,
        }))
        res.json(data);
    }
    catch (error) {
        console.error("Error fetching all shifts: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


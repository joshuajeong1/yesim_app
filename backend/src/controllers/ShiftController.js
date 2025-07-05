import { PrismaClient } from '@prisma/client';
import { addShift, removeShift, getAllShifts, getShiftByUserAndDay } from '../services/ShiftServices.js';
const prisma = new PrismaClient();

export const getShiftByUserDay = async (req, res) => {
    const { date, id } = req.query;
    const userId = parseInt(id, 10);
    
    if (isNaN(userId)) {
        return res.status(400).json("Error with userId input");
    }
    else if (!date) {
        return res.status(400).json("Date is missing");
    }

    let dateObj = new Date(date);
    const shift = await getShiftByUserAndDay(dateObj, userId);
    return res.json( {shift} )
}

export const createShift = async (req, res) => {
    const { userId, startTime, endTime } = req.body;

    if (!userId || !startTime || !endTime ) {
        return res.status(400).json({ error: "Missing required fields" })
    }
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start) || isNaN(end)) {
        return res.status(400).json({ error: "Invalid date format" });
    }

    if (end <= start) {
        return res.status(400).json({ error: "End time must be after start time" });
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


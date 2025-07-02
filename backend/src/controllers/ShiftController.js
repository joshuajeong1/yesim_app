import { PrismaClient } from '@prisma/client';
import { addShift, removeShift } from '../services/ShiftServices.js';
const prisma = new PrismaClient();


export const createShift = async (req, res) => {
    const { userId, startTime, endTime } = req.body;

    if (!userId || !startTime || !endTime ) {
        return res.status(400).json({ error: "Missing required fields" })
    }
    try {
        const newShift = await addShift(req.body);
        res.status(201).json(newShift);
    }
    catch (error) {
        console.error("Error creating shift: ", error)
        res.status(500).json({ error: "Server error"});
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
            error: "Server error",
        })
    }
}

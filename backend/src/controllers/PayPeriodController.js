import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { addDays, addWeeks, setHours, setMinutes, setSeconds, setMilliseconds } from "date-fns";

export const createPayPeriod = async (req, res) => {
    const { startDate, endDate } = req.body;
    try {
        const newPeriod = await prisma.payPeriod.create({
            data: {
                startDate,
                endDate,
            },
        });
        res.status(201).json(newPeriod);
    }
    catch (error) {
        console.error("Error creating pay period: ", error);
        res.status(500).json({ error: "Server error"});
    }
}

export const autoCreatePeriod = async (req, res) => {
    try {
        const latestEnd = await prisma.payPeriod.findFirst({
        orderBy: {
            endDate: 'desc',
        },
        select: {
            endDate: true
        }
        });

        if (!latestEnd) {
        return res.status(400).json({ error: "Previous pay periods do not exist." });
        }
        
        const latestUTC = new Date(latestEnd.endDate);

        const nextDayUTC = addDays(latestUTC, 1);

        const startDateUTC = setHours(setMinutes(setSeconds(setMilliseconds(nextDayUTC, 0), 0), 0), 0);
        

        const twoWeeksLater = addDays(startDateUTC, 13);
        const endDateUTC = setHours(setMinutes(setSeconds(setMilliseconds(twoWeeksLater, 0), 0), 59), 23);
        
        const newPeriod = await prisma.payPeriod.create({
            data: {
                startDate: startDateUTC,
                endDate: endDateUTC,
            }
        })
        
        res.status(201).json( {message: `Successfully created a new pay period from ${startDateUTC.toISOString()} to ${endDateUTC.toISOString()}` , period: newPeriod} )
    }
    catch (error) {
        res.status(500).json( {error: "Internal server error " + error })
    }
}
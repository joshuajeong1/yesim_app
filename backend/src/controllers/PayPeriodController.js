import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { addDays, lastDayOfMonth, setHours, setMinutes, setSeconds, setMilliseconds } from "date-fns";

export const getPayPeriods = async (req, res) => {
    try {
        const periods = await prisma.payPeriod.findMany({
            include: {
                hoursWorked: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                payRate: true
                            }
                        }
                    }
                    
                }
            },
        });
        const sortedPeriods = periods.map(period => ({...period, hoursWorked: period.hoursWorked.slice().sort((a, b) => a.userId - b.userId)}));
        res.status(201).json(sortedPeriods);
    }
    catch (error) {
        console.error("Error fetching pay periods: ", error);
        res.status(500).json({ error: "Internal server error"});
    }
}

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
        
        const latestUTC = latestEnd.endDate;

        const startDateUTC = new Date(latestUTC)
        startDateUTC.setUTCHours(7,0,0,0);
        
        let endDateUTC;
        if (startDateUTC.getUTCMonth() === 1 && startDateUTC.getUTCDate() == 16) {
            const lastDay = lastDayOfMonth(startDateUTC);
            endDateUTC = new Date(lastDay);
            endDateUTC.setUTCHours(6, 59, 0, 0);
            endDateUTC.setUTCDate(endDateUTC.getUTCDate() + 1);
        }
        else {
            let periodLength = 14;
            const thirtyOneMonths = [0, 2, 4, 6, 7, 9, 11];
            if(thirtyOneMonths.includes(startDateUTC.getUTCMonth()) && startDateUTC.getUTCDate() == 16) {
                periodLength += 1;
            }
            var fifteenDaysLater = addDays(startDateUTC, periodLength);
            endDateUTC = new Date(fifteenDaysLater);
            endDateUTC.setUTCHours(6, 59, 0, 0)
            endDateUTC.setUTCDate(endDateUTC.getUTCDate() + 1);
        }

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


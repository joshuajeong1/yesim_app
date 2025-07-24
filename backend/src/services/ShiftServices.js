import { PrismaClient } from '@prisma/client';
import { toZonedTime, fromZonedTime } from 'date-fns-tz'
import { startOfDay, endOfDay } from 'date-fns'
const prisma = new PrismaClient();

export async function getShiftByUserAndDay(date, userId) {
    let endOfDay = new Date(date.getTime() + 24 * 60 * 60 * 1000)
    return prisma.shift.findFirst({
        where: {
            userId: userId,
            startTime: {
                gte: date,
                lte: endOfDay
            },
        }
    })
}

export async function postShifts(startDate, endDate) {
    try {
        await prisma.shift.updateMany({
            where: {
                startTime: {
                    gte: startDate,
                    lte: endDate
                }
            },
            data: {
                isPosted: true,
            }
        })
    }
    catch (error) {
        console.log("Internal server error");
        throw error;
    }
}

export async function editShift(shiftId, newStart, newEnd) {
    try {
        const updatedShift = await prisma.shift.update({
            where: {
                id: shiftId,
            },
            data: {
                startTime: newStart,
                endTime: newEnd,
            },
        });
        await recalculateHoursWorked(updatedShift.userId, updatedShift.startTime, updatedShift.endTime);
        return updatedShift;
    }
    catch (error) {
        console.log("Internal server error");
        throw error;
    }
}


export async function getAllShifts(startDate, endDate) {
    return prisma.shift.findMany({
        where: {
            startTime: { gte: startDate },
            endTime: { lte: endDate },
        },
        include: {
            user: {
                select: {
                    username: true,
                    id: true,
                },
            },
        },
        orderBy: {
            startTime: 'asc',
        },
    })
}

export async function removeShift(shiftId) {
    try {
        const deletedShift = await prisma.shift.findUnique({
            where: {
                id: shiftId,
            },
        });

        if(!deletedShift) {
            console.log("Shift not found.");
            throw "Shift not found";
        }

        await prisma.shift.delete({
            where: {
                id: shiftId,
            },
        });

        await recalculateHoursWorked(deletedShift.userId, deletedShift.startTime, deletedShift.endTime);
        console.log("Shift deleted: ", deletedShift);
        return deletedShift;
    }
    catch (error) {
        console.error("Error deleting shift: ", error);
        throw error;
    }
}

export async function addShift(userId, startTime, endTime) {
    const timeZone = 'America/Phoenix';

    const arizonaStart = toZonedTime(new Date(startTime), timeZone);
    const dayStartInAZ = startOfDay(arizonaStart);
    const dayEndInAZ = endOfDay(arizonaStart);
    const dayStartUTC = fromZonedTime(dayStartInAZ, timeZone);
    const dayEndUTC = fromZonedTime(dayEndInAZ, timeZone);
    const existingShift = await prisma.shift.findFirst({
        where: {
            userId,
            startTime: {
                gte: dayStartUTC,
                lte: dayEndUTC,
            },
        },
    });

    if (existingShift) {
        return existingShift;
    }

    const shift = await prisma.shift.create({
        data: {
            userId,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
        },
    });
    recalculateHoursWorked(userId, shift.startTime, shift.endTime);
    
    return shift;
}

async function recalculateHoursWorked(userId, startTime, endTime) {
    const payPeriods = await prisma.payPeriod.findMany({
        where: {
            startDate: { lte: endTime },
            endDate: { gte: startTime },
        },
    });

    for (const period of payPeriods) {
        const totalHours = await calcTotalHours(userId, period);
        await prisma.hoursWorked.upsert({
            where: {
                userId_payPeriodId: {
                    userId,
                    payPeriodId: period.id
                },
            },
            update: { totalHours },
            create: {
                userId,
                payPeriodId: period.id,
                totalHours,
            },
        });
    }
}
async function calcTotalHours(userId, period) {
    const shifts = await prisma.shift.findMany({
        where: {
            userId,
            startTime: { gte: period.startDate },
            endTime: { lte: period.endDate },
        },
    });
    let totalHours = 0;
    for ( const shift of shifts) {
        totalHours += (shift.endTime - shift.startTime) / (1000 * 60 * 60);
    }
    return totalHours;
}
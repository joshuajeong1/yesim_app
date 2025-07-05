'use client';
import { useState, useEffect, useMemo } from "react"
import { format, subDays, addDays, startOfDay } from "date-fns";
import DashboardDay from '@/components/DashboardDay'

interface Week {
    start: Date;
    end: Date;
}

interface Shift {
    id: number;
    username: string;
    startTime: string;
    endTime: string;
}

function getWeek(today : Date) : Week {
    const day = today.getDay();
    const daysSinceSat = day % 7;
    const start = subDays(today, daysSinceSat);
    const end = addDays(start, 6);
    return { start: start, end: end };
}

function sortShiftsByDay(shifts : Shift[]): Shift[][] {
    const sorted : Shift[][] = [[],[],[],[],[],[],[]]

    shifts.forEach((shift) => {
        const utcDate = new Date(shift.startTime);
        const localDay = new Date(utcDate.toLocaleString("en-US", { timeZone: "America/Phoenix" })).getDay();
        sorted[localDay].push(shift);
    })
    return sorted;
}

export default function Dashboard() {
    const [ currentDate, setDate ] = useState(startOfDay(new Date()));
    const { start, end } = useMemo(() => getWeek(currentDate), [currentDate]);
    const [ sortedShifts, setSortedShifts ] = useState<Shift[][]>([[]])
    const endOfLastDay = addDays(end, 1);

    const fetchShifts = () => {
        console.log("Fetching data")
        fetch(`http://localhost:8080/api/shift/get?start=${start.toISOString()}&end=${endOfLastDay.toISOString()}`)
            .then((res) => res.json())
            .then((data) => {
                setSortedShifts(sortShiftsByDay(data));
            })
            .catch((error) => console.error("Error fetching shift data", error))
    };

    useEffect(() => {
        fetchShifts();
    }, [start, end])



    const goPrevWeek = (): void => {
        setDate((prev) => subDays(prev, 7));
    };
    const goNextWeek = (): void => {
        setDate((prev) => addDays(prev, 7));
    };
    return (
        <div className="bg-slate-800 w-screen min-h-screen">
            <div className="absolute top-8 left-8">
                <a href="/payperiod" target="_blank" rel="noopener noreferrer" className="p-4 border rounded-md">Pay Periods</a>
            </div>
            <div className="flex flex-col items-center p-8">
                <h2 className="font-bold text-3xl">
                    Week of {format(start, "MMM d")} to {format(end, "MMM d")}
                </h2>
                <div className="p-4 flex gap-5">
                    <button className="bg-gray-700 p-2 rounded-md" onClick={goPrevWeek}>Previous Week</button>
                    <button className="bg-gray-700 p-2 rounded-md" onClick={goNextWeek} style={{ marginLeft: "1rem" }}>
                        Next Week
                    </button>
                </div>
            </div>
            <div className="flex flex-col p-8 gap-y-2">
                <DashboardDay day="Sun" date={start} shifts={sortedShifts[0]} onRefresh={fetchShifts} />
                <DashboardDay day="Mon" date={addDays(start, 1)} shifts={sortedShifts[1]} onRefresh={fetchShifts} />
                <DashboardDay day="Tues" date={addDays(start, 2)} shifts={sortedShifts[2]} onRefresh={fetchShifts} />
                <DashboardDay day="Wed" date={addDays(start, 3)} shifts={sortedShifts[3]} onRefresh={fetchShifts} />
                <DashboardDay day="Thurs" date={addDays(start, 4)} shifts={sortedShifts[4]} onRefresh={fetchShifts} />
                <DashboardDay day="Fri" date={addDays(start, 5)} shifts={sortedShifts[5]} onRefresh={fetchShifts} />
                <DashboardDay day="Sat" date={addDays(start, 6)} shifts={sortedShifts[6]} onRefresh={fetchShifts} />
            </div>
        </div>
    );
}
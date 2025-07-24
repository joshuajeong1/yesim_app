'use client';
import { useState, useEffect, useMemo, useCallback } from "react"
import { format, subDays, addDays, startOfDay } from "date-fns";
import Cookies from 'js-cookie';
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

interface User {
    id: number;
    username: string;
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
    const endOfLastDay = useMemo(() => addDays(end, 1), [end]);

    const [ users, setUsers ] = useState<User[]>([]);

    const autoShifts = async () => {
        const body = {
            start: start,
            end: endOfLastDay,
        }

        const token = Cookies.get("token");

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shift/auto`, {
            method: "POST",
            headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })
        fetchShifts();
        alert("Shifts copied!");
    }

    const postShifts = async () => {
        const body = {
            startDate: start,
            endDate: endOfLastDay,
        }

        const token = Cookies.get("token");

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shift/post`, {
            method: "POST",
            headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })
        alert("Shifts posted!");
    }

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/get`)
            .then((res) => res.json())
            .then((data) => {
                setUsers(data.users)
            })
            .catch((error) => {
                console.error("Error getting users from backend: ", error)
            })
    }, []);
    
    const fetchShifts = useCallback(() => {
        console.log("Fetching data")
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shift/get?start=${start.toISOString()}&end=${endOfLastDay.toISOString()}`)
            .then((res) => res.json())
            .then((data) => {
                setSortedShifts(sortShiftsByDay(data));
            })
            .catch((error) => console.error("Error fetching shift data", error))
    }, [start, endOfLastDay]);

    useEffect(() => {
        fetchShifts();
    }, [fetchShifts])



    const goPrevWeek = (): void => {
        setDate((prev) => subDays(prev, 7));
    };
    const goNextWeek = (): void => {
        setDate((prev) => addDays(prev, 7));
    };
    return (
        <div className="bg-slate-800 w-screen min-h-screen text-white flex flex-col">
            <div className="flex flex-col items-center p-8">
                <h2 className="font-bold text-3xl">
                    Week of {format(start, "MMM d")} to {format(end, "MMM d")}
                </h2>
                <div className="p-4 flex gap-5">
                    <button className="bg-gray-700 p-3 rounded-md hover:bg-gray-900" onClick={goPrevWeek}>Previous Week</button>
                    <button className="bg-gray-700 p-3 rounded-md hover:bg-gray-900" onClick={goNextWeek} style={{ marginLeft: "1rem" }}>
                        Next Week
                    </button>
                </div>
                <div className="flex flex-col gap-y-2">
                    <button onClick={postShifts} className="bg-gray-700 p-3 rounded-md hover:bg-gray-900">Post Shifts</button>
                    <button onClick={autoShifts} className="bg-gray-700 p-3 rounded-md hover:bg-gray-900">Copy Last Week</button>
                </div>
            </div>
            <div className="2xl:absolute self-center 2xl:top-8 2xl:left-8 flex gap-x-4">
                <a href="/payperiod" target="_blank" rel="noopener noreferrer" className="p-4 border rounded-md">Pay Periods</a>
                <a href="/schedule" target="_blank" rel="noopener noreferrer" className="p-4 border rounded-md">Schedule</a>
                <a href="/users" target="_blank" rel="noopener noreferrer" className="p-4 border rounded-md">Users</a>
                <a href="/monthly" target="_blank" rel="noopener noreferrer" className="p-4 border rounded-md">Calendar View</a>
            </div>
            <div className="flex flex-col p-8 gap-y-2">
                <DashboardDay day="Sun" date={start} shifts={sortedShifts[0]} users={users} onRefresh={fetchShifts} />
                <DashboardDay day="Mon" date={addDays(start, 1)} shifts={sortedShifts[1]} users={users} onRefresh={fetchShifts} />
                <DashboardDay day="Tues" date={addDays(start, 2)} shifts={sortedShifts[2]} users={users} onRefresh={fetchShifts} />
                <DashboardDay day="Wed" date={addDays(start, 3)} shifts={sortedShifts[3]} users={users} onRefresh={fetchShifts} />
                <DashboardDay day="Thurs" date={addDays(start, 4)} shifts={sortedShifts[4]} users={users} onRefresh={fetchShifts} />
                <DashboardDay day="Fri" date={addDays(start, 5)} shifts={sortedShifts[5]} users={users} onRefresh={fetchShifts} />
                <DashboardDay day="Sat" date={addDays(start, 6)} shifts={sortedShifts[6]} users={users} onRefresh={fetchShifts} />
            </div>
        </div>
    );
}
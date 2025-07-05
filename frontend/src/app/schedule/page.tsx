'use client';
import { useState, useMemo, useEffect } from "react"
import { format, subDays, addDays, startOfDay } from "date-fns";
import ScheduleDay from '@/components/ScheduleDay'

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
interface User {
    id: number;
    username: string;
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

export default function Schedule() {
    const [ currentDate, setDate ] = useState(startOfDay(new Date()));
    const { start, end } = useMemo(() => getWeek(currentDate), [currentDate]);
    const [ sortedShifts, setSortedShifts ] = useState<Shift[][]>([[]])
    const endOfLastDay = addDays(end, 1);

    const defaultUser: User = {
        id: -1,
        username: "All Users",
    }

    const [ users, setUsers ] = useState<User[]>([]);
    const [ selectedUser, setSelectedUser ] = useState<User>(defaultUser);

    useEffect(() => {
        fetch("http://localhost:8080/api/user/get")
            .then((res) => res.json())
            .then((data) => {
                const allUsers = [defaultUser, ...data.users];
                setUsers(allUsers);
            })
            .catch((error) => {
                console.error("Error getting users from backend: ", error)
            })
    }, []);

    const fetchShifts = () => {
            console.log("Fetching data")
            fetch(`http://localhost:8080/api/shift/get?start=${start.toISOString()}&end=${endOfLastDay.toISOString()}`)
                .then((res) => res.json())
                .then((data) => {
                    const userShifts =
                        selectedUser.id !== defaultUser.id ? 
                        data.filter((shift: Shift) => shift.username === selectedUser.username) : data;
                    setSortedShifts(sortShiftsByDay(userShifts));
                })
                .catch((error) => console.error("Error fetching shift data", error))
    };
    
    useEffect(() => {
        fetchShifts();
    }, [start, end, selectedUser.id])

    const goPrevWeek = (): void => {
        setDate((prev) => subDays(prev, 7));
    };
    const goNextWeek = (): void => {
        setDate((prev) => addDays(prev, 7));
    };
    return (
        <div className="bg-slate-800 w-screen h-screen">
            <div className="absolute right-16 top-8">
                <select
                    value={selectedUser.id}
                    onChange={(e) => {
                        const id = parseInt(e.target.value, 10);
                        const user = users.find((u) => u.id === id);
                        if (user) {
                            setSelectedUser(user);
                        }
                    }}
                >
                    {users.map((user : User) => {
                        return (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        )
                    })}
                </select>
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
            <div className="grid grid-cols-7 pt-4 px-2">
                <ScheduleDay day="Sun" date={start} shifts={sortedShifts[0]} />
                <ScheduleDay day="Mon" date={addDays(start, 1)} shifts={sortedShifts[1]} />
                <ScheduleDay day="Tues" date={addDays(start, 2)} shifts={sortedShifts[2]} />
                <ScheduleDay day="Wed" date={addDays(start, 3)} shifts={sortedShifts[3]} />
                <ScheduleDay day="Thurs" date={addDays(start, 4)} shifts={sortedShifts[4]} />
                <ScheduleDay day="Fri" date={addDays(start, 5)} shifts={sortedShifts[5]} />
                <ScheduleDay day="Sat" date={addDays(start, 6)} shifts={sortedShifts[6]} />
            </div>
        </div>
    );
}
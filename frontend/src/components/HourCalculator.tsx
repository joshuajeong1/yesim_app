"use client"

import { useState, useEffect } from 'react';
import { parseISO, differenceInMinutes } from "date-fns";
import { fromZonedTime } from 'date-fns-tz';
import Cookies from 'js-cookie';

interface Shift {
  id: number;
  username: string;
  startTime: string;
  endTime: string;
}

interface EmployeeHours {
  [username: string]: number;
}

interface User {
    id: number;
    username: string;
    payRate: number;
}


export default function HourCalculator() {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [hoursWorked, setHoursWorked] = useState<EmployeeHours>({});
    const [ users, setUsers ] = useState<User[]>([]);
    const [ totalHours, setTotalHours ] = useState(0);
    const grandTotalPay = Object.entries(hoursWorked).reduce((sum, [username, hours]) => {
        const user = users.find(u => u.username === username);
        const payRate = user?.payRate ?? 0;
        return sum + hours * payRate;
    }, 0);
    const getUsers = async () => {
        const token = Cookies.get("token");
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/getall`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setUsers(data.users);
            })
            .catch((error) => {
                console.error("Error getting users from backend: ", error)
            })
    };

    useEffect(() => {
        getUsers();
    }, []);

    const fetchShifts = async () => {
        if (!startDate || !endDate) {
            return;
        } 

        const start = fromZonedTime(`${startDate}T00:00:00`, "America/Phoenix");
        const end = fromZonedTime(`${endDate}T23:59:59`, "America/Phoenix");

        setHoursWorked({});
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shift/get?start=${start.toISOString()}&end=${end.toISOString()}`);
            
            if (!response.ok) throw new Error("Failed to fetch shifts");

            const data: Shift[] = await response.json();
            
            let countHours = 0;
            const totals: EmployeeHours = {};
            for (const shift of data) {
                const shiftStart = parseISO(shift.startTime);
                const shiftEnd = parseISO(shift.endTime);
                const minutes = differenceInMinutes(shiftEnd, shiftStart);
                const hours = minutes / 60;

                totals[shift.username] = (totals[shift.username] || 0) + hours;
                countHours += hours;
            }
            
            setHoursWorked(totals);
            setTotalHours(countHours);
        } 
        catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Employee Hours Worked</h1>
        <div className="flex flex-row gap-4 mb-4 justify-center">
            <div>
            <label className="block text-sm font-medium">Start Date</label>
            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded p-2 w-full"
            />
            </div>
            <div>
            <label className="block text-sm font-medium">End Date</label>
            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded p-2 w-full"
            />
            </div>
        </div>
        <div className="flex justify-center">
            <button
            onClick={fetchShifts}
            disabled={!startDate || !endDate}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-blue-700"
        >
            Calculate Hours
        </button>

        </div>
        <div className="mt-4">
            {Object.keys(hoursWorked).length === 0 ? (
                <></>
            ) : (
            <ul className="space-y-2 mt-4">
                {Object.entries(hoursWorked).map(([username, hours]) => {
                    const user = users.find(u => u.username === username);
                    const payRate = user?.payRate ?? 0;
                    const totalPay = hours * payRate;
                    return (
                        <li key={username} className="flex justify-between border-b pb-1">
                            <span>{username}</span>
                            <span>{hours.toFixed(2)} hours (${totalPay.toFixed(2)})</span>
                        </li>
                    );
                })}
                <li key="total" className="flex justify-between border-b pb-1">
                    <span>Total</span>
                    <span>{totalHours.toFixed(2)} hours (${grandTotalPay.toFixed(2)})</span>
                </li>
            </ul>
            )}
        </div>
        </div>
    );
    
}
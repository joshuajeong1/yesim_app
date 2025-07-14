"use client"

import { useState, useEffect } from 'react';
import { startOfMonth, endOfMonth, formatISO, subMonths, addMonths, format } from "date-fns";
import Calendar from '@/components/Calendar';

interface Shift {
  id: number;
  username: string;
  startTime: string;
  endTime: string;
  isPosted: boolean;
}

export default function MonthlyView() {
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        const fetchShifts = async () => {
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shift/get?start=${formatISO(start)}&end=${formatISO(end)}`
        );
        const data = await response.json();
        setShifts(data);
        };

        fetchShifts();
    }, [currentMonth]);

    const goPrevMonth = (): void => {
            setCurrentMonth((prev) => subMonths(prev, 1));
    };
    const goNextMonth = (): void => {
            setCurrentMonth((prev) => addMonths(prev, 1));
    };

    return (
        <div className="p-4 bg-slate-800 min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-4 text-center">Calendar</h1>
            <div className="flex justify-center m-4 gap-x-5">
                <button className="bg-gray-700 p-3 rounded-md hover:bg-gray-900" onClick={goPrevMonth}>Previous Month</button>
                <h1 className="flex justify-center items-center font-bold text-2xl">{format(currentMonth, "MMMM yyyy")}</h1>
                <button className="bg-gray-700 p-3 rounded-md hover:bg-gray-900" onClick={goNextMonth}>Next Month</button>
            </div>
            <Calendar shifts={shifts} month={currentMonth} isAdmin={true}/>
        </div>
    )
}
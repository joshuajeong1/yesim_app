"use client"

import { useState, useEffect } from 'react'
import PayPeriodItem from '@/components/PayPeriod';
import HourCalculator from '@/components/HourCalculator';
interface PayPeriod {
    id: number;
    startDate: string;
    endDate: string;
    hoursWorked: HoursWorked[];
}
interface HoursWorked {
    id: number;
    userId: number;
    payPeriodId: number;
    totalHours: number;
    user: User;
}

interface User {
    username: string;
    payRate: number;
}


export default function PayPeriod() {
    const [ periods, setPeriods ] = useState<PayPeriod[]>([]);

    const getPeriods = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/period/get`)
            .then((res) => res.json())
            .then((data) => {
                setPeriods(data)
            })
            .catch((error) => {
                console.error("Error getting users from backend: ", error)
            })
    }
    const addAuto = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/period/auto`, {
            method: "POST",
        })
        getPeriods();
    }

    useEffect(() => {
        getPeriods();
    }, [])


    return (
        <div className="bg-slate-800 w-screen min-h-screen text-white">
            <div className="p-8">
                <h1 className="text-2xl font-bold text-center">Pay Periods</h1>
                <a className="border rounded-md p-4" href="/dashboard">Back to Dashboard</a>
                <div className="flex flex-col items-center py-8 gap-y-4">
                    {periods.map((period : PayPeriod) => {
                        return (
                            <PayPeriodItem key={period.id} startDate={new Date(period.startDate)} endDate={new Date(period.endDate)} hoursWorked={period.hoursWorked} />
                        )
                    })}
                    <button onClick={addAuto} className="border rounded-md p-4">New Pay Period</button>
                </div>
                <HourCalculator />
            </div>
        </div>
    )
}
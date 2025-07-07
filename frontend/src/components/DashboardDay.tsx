import { useState, useEffect } from 'react';
import DashboardUser from '@/components/DashboardUser'
interface DashboardProps {
    day: string;
    date: Date;
    shifts: Shift[]
    users: User[]
    onRefresh: () => void;
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

export default function DashboardDay({ day, date, shifts = [], users = [], onRefresh}: DashboardProps) {
    
    return (
        <div className="w-full grid [grid-template-columns:5%_10%_85%] border p-5 rounded-md">
            <h1 className="text-lg text-gray-400">{date.getDate()}</h1>
            <h1 className="text-xl font-bold">{day}</h1>
            <div className="flex flex-col gap-y-3">
                {users.map((user: User) => {
                    const userShifts = shifts.filter(
                        (shift) => shift.username === user.username
                    );
                    return (
                        <DashboardUser
                        key={user.id}
                        date={date}
                        username={user.username}
                        id={user.id}
                        shifts={userShifts}
                        onRefresh={onRefresh}
                        />
                    )
                    })}
            </div>
        </div>
    );
}
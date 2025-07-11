import { format } from 'date-fns'
import { useState } from 'react'
interface ChildProps {
    startDate: Date;
    endDate: Date;
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

export default function PayPeriodItem( {startDate, endDate, hoursWorked}: ChildProps ) {
    const [ isOpen, setIsOpen ] = useState(false);
    const formattedStart = format(startDate, "MM/dd/yy");
    const formattedEnd = format(endDate, "MM/dd/yy");
    return (
        <>
            <div className="flex gap-x-4">
                <div className="border p-4 rounded-md">
                    <p><span>{formattedStart}</span> - <span>{formattedEnd}</span></p>
                </div>
                <button onClick={() => setIsOpen((prev) => !prev)} className="border p-4 rounded-md">View Data</button>
            </div>
            {isOpen && (
                <ul className="w-[30%] space-y-2">
                    {hoursWorked.map((hoursRecord : HoursWorked) => {
                        return (
                            <li key={hoursRecord.id} className="flex justify-between border-b pb-1">
                                <span>{hoursRecord.user.username}</span>
                                <span>{hoursRecord.totalHours.toFixed(2)} hours (${hoursRecord.user.payRate * hoursRecord.totalHours})</span>
                            </li>
                        )
                    })}
                </ul>
            )}
        </>
    )
}
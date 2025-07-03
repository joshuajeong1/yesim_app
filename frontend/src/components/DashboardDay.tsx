import { useState, useEffect } from 'react';
import DashboardUser from '@/components/DashboardUser'
interface DashboardProps {
    day: string;
    date: Date;
}

interface User {
    id: number;
    username: string;
}

export default function DashboardDay({ day, date }: DashboardProps) {
    const [ users, setUsers ] = useState<User[]>([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/user/get")
            .then((res) => res.json())
            .then((data) => {
                setUsers(data.users)
            })
            .catch((error) => {
                console.error("Error getting users from backend: ", error)
            })
    }, []);
    return (
        <div className="w-full grid [grid-template-columns:5%_10%_85%] border p-5">
            <h1 className="text-lg text-gray-400">{date.getDate()}</h1>
            <h1 className="text-xl font-bold">{day}</h1>
            <div className="flex flex-col gap-y-3">
                { users.map((user : User) => (
                    <DashboardUser key={user.id} date={date} username={user.username} id={user.id} />
                ))}
            </div>
        </div>
    );
}
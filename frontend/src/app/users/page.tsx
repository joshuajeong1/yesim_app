"use client"
import { useState, useEffect } from 'react';
import User from '@/components/User'
import { FaPlus } from "react-icons/fa";

interface User {
    id: number;
    username: string;
    payRate: number;
}


export default function Users() {
    const [ users, setUsers ] = useState<User[]>([]);
    const [ newUsername, setUsername ] = useState("");
    const [ newPayInput, setNewPayInput] = useState("0.00");

    const handleNewUser = async () => {
        try {
            const resp = await fetch("http://localhost:8080/api/user/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: newUsername, password: "", isAdmin: false, payRate: parseFloat(newPayInput)})
            })
            if(!resp.ok) {
                throw new Error("Error adding new user.");
            }
            getUsers();
            setUsername("");
            setNewPayInput("0.00");
            alert("Added new user!");
        }
        catch (error) {
            console.error(error);
        }
    }

    const getUsers = async () => {
        fetch("http://localhost:8080/api/user/getall")
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

    return (
        <div className="bg-slate-800 w-screen h-screen">
            <h1 className="text-center pt-8 font-bold text-2xl">Users</h1>
            <div className="flex justify-center mt-8">
                <div className="w-[40%] grid [grid-template-columns:60%_20%_10%_10%] gap-y-1 text-xl border p-4 rounded-md">
                    <h1 className="border-b-1 mb-2 p-1">Name</h1>
                    <h1 className="border-b-1 mb-2 p-1 text-center">Pay Rate</h1>
                    <div className="border-b-1 mb-2 p-1 col-span-2"></div>
                    {users.map((user : User) => {
                        return (
                            <User key={user.id} username={user.username} id={user.id} payRate={user.payRate} onRefresh={getUsers}/>
                        )
                    })}
                    <div>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="New User"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            step="0.1"
                            value={newPayInput}
                            onChange={(e) => setNewPayInput(e.target.value)}
                            className="w-full text-center"
                        />
                    </div>
                    <div className="col-span-1 flex justify-center items-center">
                        <button onClick={handleNewUser}><FaPlus className="hover:text-emerald-400"/></button>
                    </div>
                </div>
            </div>
        </div>
    )
}
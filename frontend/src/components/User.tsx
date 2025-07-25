import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useState } from 'react';
import Cookies from 'js-cookie';
interface ChildProps {
    username: string;
    id: number;
    payRate: number;
    onRefresh: () => void;
}

export default function User({username, id, payRate, onRefresh}:ChildProps) {

    const [ payRateInput, setPayRateInput ] = useState(payRate.toFixed(2))
    const [ originalRate, setOriginalRate ] = useState(payRate);

    const isChanged = parseFloat(payRateInput) !== originalRate;
    
    const handleEdit = async () => {
        const newRate = parseFloat(payRateInput);
        try {
            const token = Cookies.get("token");
            const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/update`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ userId: id, newPay: newRate }),
            });
            if(!resp.ok) {
                throw new Error("Failed to update payRate");
            }
            alert("Updated pay!")
            setOriginalRate(newRate);
        }
        catch (error) {
            alert(error);
        }
    }

    const handleDelete = async () => {
        try {
            const token = Cookies.get("token");
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            onRefresh();
            alert("User deleted!");
        }
        catch (error) {
            alert("Error deleting user: " + error);
        }
    }

    return (
        <>
        <div>
            {username}
        </div>
        <div className="">
            <input
                type="number"
                step="0.1"
                value={payRateInput}
                onChange={(e) => setPayRateInput((e.target.value))}
                className={`w-full text-center ${isChanged ? 'text-amber-300' : 'text-white'}`}
            />
        </div>
        <div className="flex justify-center items-center">
            <button onClick={handleDelete}><FaTrash className="hover:text-red-400"/></button>
        </div>
        <div>
            <button onClick={handleEdit}><MdEdit className="hover:text-emerald-400" /></button>
        </div>
        </>
    )
}
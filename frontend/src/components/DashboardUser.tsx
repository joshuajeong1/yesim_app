import { useState } from 'react';
import { FaPlus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

interface ChildProps {
    date: Date;
    username: string;
    id: number;
    shifts: Shift[];
    onRefresh: () => void;
}

interface Shift {
    id: number;
    username: string;
    startTime: string;
    endTime: string;
}

export default function DashboardUser({ date, username, id, shifts, onRefresh }: ChildProps) {
    const [ startHours, setStartHours ] = useState("");
    const [ endHours, setEndHours ] = useState("");
    const [ startMinutes, setStartMinutes ] = useState("00");
    const [ endMinutes, setEndMinutes ] = useState("00");
    const [ startMeridian, setStartMeridian ] = useState<"AM" | "PM">("AM");
    const [ endMeridian, setEndMeridian ] = useState<"AM" | "PM">("AM");

    const shift = shifts[0];

    const formatTime = (timeStr : string) => new Date(timeStr).toLocaleTimeString([], { hour: "numeric", minute: "2-digit"});

    const calcTime = (hourStr : string, minuteStr: string, meridian: "AM" | "PM", date: Date): Date | null => {
        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr || "0", 10);
        
        if (
            isNaN(hour) ||
            hour < 1 ||
            hour > 12 ||
            isNaN(minute) ||
            minute < 0 ||
            minute > 59
        ) {
        return null;
        }

        let hour24 = hour;
        if (meridian === "AM" && hour === 12) {
            hour24 = 0;
        }
        else if (meridian === "PM" && hour !== 12) {
            hour24 += 12;
        }
        const newDate = new Date(date);
        newDate.setUTCHours(date.getUTCHours() + hour24)
        newDate.setUTCMinutes(minute);

        return newDate;
    }
    
    const editShift = async() => {
        const startDate = calcTime(startHours, startMinutes, startMeridian, date);
        const endDate = calcTime(endHours, endMinutes, endMeridian, date);

        if (!startDate || !endDate || startDate > endDate) {
            alert("Start time is after end time!")
            return;
        }
        const body = {
            shiftId: shift.id,
            newStart: startDate,
            newEnd: endDate,
        }
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shift/edit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            })
        }
        catch (error) {
            alert("Error updating shift: " + error);
        }
        alert("Shift edited!");
        onRefresh();
    }

    const removeShift = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shift/${shift.id}`, {
                method: "DELETE"
            });
            onRefresh();
            alert("Shift deleted!");
        }
        catch (error) {
            alert("Error deleting shift: " + error);
        }
    }

    const addShift = async () => {
        const startDate = calcTime(startHours, startMinutes, startMeridian, date);
        const endDate = calcTime(endHours, endMinutes, endMeridian, date)

        if (!startDate || !endDate) {
            alert("Invalid input!");
            return null;
        }
        if(endDate <= startDate) {
            alert("Invalid input!");
            return null;
        }
        const body = {
            userId: id,
            startTime: startDate!.toISOString(),
            endTime: endDate!.toISOString(),
        }

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shift/new`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            onRefresh();
            alert("Shift added!");
            setStartHours("");
            setStartMinutes("00");
            setStartMeridian("AM");
            setEndHours("");
            setEndMinutes("00");
            setEndMeridian("AM");
        }
        catch (error) {
            console.error("Issue adding shift: " + error);
            alert("Error when attempting to add shift.");
        }
    }

    return (
        <div className="grid [grid-template-columns:10%_25%_65%] gap-x-3 justify-center">
            <span>{username}</span>
            {shift ? (
                <div className="grid [grid-template-columns:70%_15%_15%] text-emerald-500">
                    {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                    <button onClick={() => {
                        const confirmed = window.confirm("Are you sure you want to delete this shift?");
                        if (confirmed) {
                            removeShift();
                        }
                        }} 
                        className="text-white hover:text-red-400"
                    >
                            <FaTrash />
                    </button>
                    <button onClick={editShift}
                    className="text-white hover:text-blue-400"
                    >
                        <MdEdit />
                    </button>
                </div>
                
            ) : (
                <div className="text-sm text-gray-400">&nbsp;</div>
            )}
            
            
            <div className="flex justify-center">
                <input
                    type="number"
                    placeholder="HH"
                    value={startHours}
                    onChange={(e) => setStartHours(e.target.value)}
                    className="text-center w-12"
                />
                <p>:</p>
                <input
                    type="number"
                    placeholder="MM"
                    value={startMinutes}
                    onChange={(e) => setStartMinutes(e.target.value)}
                    className="text-center w-12"
                />
                <select
                    value={startMeridian}
                    onChange={(e) => setStartMeridian(e.target.value as "AM" | "PM")}
                    className=""
                >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </select>
                <p className="font-bold px-8">TO</p>
                <input
                    type="number"
                    placeholder="HH"
                    value={endHours}
                    onChange={(e) => setEndHours(e.target.value)}
                    className="text-center w-12"
                />
                <p>:</p>
                <input
                    type="number"
                    placeholder="MM"
                    value={endMinutes}
                    onChange={(e) => setEndMinutes(e.target.value)}
                    className="text-center w-12"
                />
                <select
                    value={endMeridian}
                    onChange={(e) => setEndMeridian(e.target.value as "AM" | "PM")}
                    className=""
                >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </select>
                <button disabled={!!shift} onClick={addShift} className={`pl-5 ${!!shift ? "text-gray-400 cursor-not-allowed" : "hover:text-green-400"}`}><FaPlus /></button>
            </div>  
                      
        </div>
    )
}
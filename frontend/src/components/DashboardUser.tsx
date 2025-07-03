import { useState } from 'react';
interface ChildProps {
    date: Date;
    username: string;
    id: number;
    shifts: Shift[]
}

interface Shift {
    id: number;
    username: string;
    startTime: string;
    endTime: string;
}

export default function DashboardUser({ date, username, id, shifts }: ChildProps) {
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
    
    const removeShift = async () => {
        try {
            const resp = fetch(`http://localhost:8080/api/shift/${shift.id}`, {
                method: "DELETE"
            });

            alert("Shift deleted!");

        }
        catch (error) {
            alert("Error deleting shift!");
        }
    }

    const addShift = async () => {
        const startDate = calcTime(startHours, startMinutes, startMeridian, date);
        const endDate = calcTime(endHours, endMinutes, endMeridian, date)

        if (!startDate || !endDate) {
            alert("Invalid input!");
            return null;
        }

        const body = {
            userId: id,
            startTime: startDate!.toISOString(),
            endTime: endDate!.toISOString(),
        }

        try {
            const resp = fetch("http://localhost:8080/api/shift/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

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
        <div className="grid [grid-template-columns:10%_22%_33%_33%] gap-x-3 justify-start">
            <span>{username}</span>
            {shift ? (
                <div className="text-emerald-500">{formatTime(shift.startTime)} - {formatTime(shift.endTime)}</div>
            ) : (
                <div className="text-sm text-gray-400">&nbsp;</div>
            )}
            
            <button onClick={removeShift}>-</button>
            <div className="flex">
                <input
                    type="text"
                    placeholder="HH"
                    value={startHours}
                    onChange={(e) => setStartHours(e.target.value)}
                    className="text-center w-12"
                />
                <p>:</p>
                <input
                    type="text"
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
                    type="text"
                    placeholder="HH"
                    value={endHours}
                    onChange={(e) => setEndHours(e.target.value)}
                    className="text-center w-12"
                />
                <p>:</p>
                <input
                    type="text"
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
                <button onClick={addShift}>+</button>
            </div>            
        </div>
    )
}
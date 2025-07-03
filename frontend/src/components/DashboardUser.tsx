import { useState } from 'react';
interface ChildProps {
    date: Date;
    username: string;
    id: number;
}

export default function DashboardUser({ date, username, id }: ChildProps) {
    const [ startHours, setStartHours ] = useState("");
    const [ endHours, setEndHours ] = useState("");
    const [ startMinutes, setStartMinutes ] = useState("00");
    const [ endMinutes, setEndMinutes ] = useState("00");
    const [ startMeridian, setStartMeridian ] = useState<"AM" | "PM">("AM");
    const [ endMeridian, setEndMeridian ] = useState<"AM" | "PM">("AM");

    const [ shiftStart, setShiftStart ] = useState<Date | null>(null);
    const [ shiftEnd, setShiftEnd ] = useState<Date | null>(null);

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
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const startDate = calcTime(startHours, startMinutes, startMeridian, date);
        const endDate = calcTime(endHours, endMinutes, endMeridian, date)
        
        if(!startDate || !endDate) {
            alert("Invalid input");
            return;
        }
        
        setShiftStart(startDate);
        setShiftEnd(endDate);
    };

    return (
        <div className="grid [grid-template-columns:10%_22%_33%_33%] gap-x-3 justify-start">
            <span>{username}</span>
            <p className="emerald-500">5:00 AM - 9:00 PM</p>
            <button>+</button>
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
            </div>            
        </div>
    )
}
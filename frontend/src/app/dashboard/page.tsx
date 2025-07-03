'use client';
import { useState } from "react"
import { format, subDays, addDays, startOfDay } from "date-fns";
import DashboardDay from '@/components/DashboardDay'

interface Week {
    start: Date;
    end: Date;
}

function getWeek(today : Date) : Week {
    const day = today.getDay();
    const daysSinceSat = (day + 1) % 7;
    const start = subDays(today, daysSinceSat);
    const end = addDays(start, 6);
    return { start: start, end: end };
}


export default function Dashboard() {
    const [ currentDate, setDate ] = useState(startOfDay(new Date()));
    const { start, end } = getWeek(currentDate);

    const goPrevWeek = (): void => {
        setDate((prev) => subDays(prev, 7));
    };
    const goNextWeek = (): void => {
        setDate((prev) => addDays(prev, 7));
    };
    return (
        <div className="bg-slate-800 w-screen min-h-screen">
            <div className="flex flex-col items-center p-8">
                <h2 className="font-bold text-3xl">
                    Week of {format(start, "MMM d")} to {format(end, "MMM d")}
                </h2>
                <div className="p-4 flex gap-5">
                    <button className="bg-gray-700 p-2 rounded-md" onClick={goPrevWeek}>Previous Week</button>
                    <button className="bg-gray-700 p-2 rounded-md" onClick={goNextWeek} style={{ marginLeft: "1rem" }}>
                        Next Week
                    </button>
                </div>
            </div>
            <div className="flex flex-col p-8">
                <DashboardDay day="Sunday" date={start} />
                <DashboardDay day="Monday" date={addDays(start, 1)} />
                <DashboardDay day="Tuesday" date={addDays(start, 2)} />
                <DashboardDay day="Wednesday" date={addDays(start, 3)} />
                <DashboardDay day="Thursday" date={addDays(start, 4)} />
                <DashboardDay day="Friday" date={addDays(start, 5)} />
                <DashboardDay day="Saturday" date={addDays(start, 6)} />
                <p>{currentDate.toISOString()}</p>
            </div>
        </div>
    );
}
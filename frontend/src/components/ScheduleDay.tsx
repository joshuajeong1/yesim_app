interface ScheduleProps {
    day: string;
    date: Date;
    shifts: Shift[]
}
interface Shift {
    id: number;
    username: string;
    startTime: string;
    endTime: string;
}

export default function ScheduleDay({day, date, shifts = []} : ScheduleProps) {
    const formatTime = (timeStr : string) => new Date(timeStr).toLocaleTimeString([], { hour: "numeric", minute: "2-digit"});

    return (
        <div className="flex flex-col">
            <div className="text-center border p-4 flex flex-col">
                <h1 className="text-lg text-gray-400">{date.getDate()}</h1>
                <h1 className="text-xl font-bold">{day}</h1>
            </div>
            <ul className="border h-full">
                {shifts.map((shift: Shift) => {
                    return (
                        <li key={shift.id} className="text-lg text-center my-4">{shift.username}: {formatTime(shift.startTime)} - {formatTime(shift.endTime)}</li>
                    )
                })}
            </ul>
        </div>
    )
}
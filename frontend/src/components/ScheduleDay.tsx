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
            <div className="text-center border p-4 flex flex-col bg-slate-900">
                <h1 className="text-lg text-gray-400">{date.getDate()}</h1>
                <h1 className="text-xl font-bold">{day}</h1>
            </div>
            <div className="border h-full flex flex-col gap-y-8">
                {shifts.map((shift: Shift) => {
                    return (
                        <div key={shift.id} className="text-sm text-center my-4 flex flex-col">
                            <p className="text-lg font-bold">{shift.username}:</p> 
                            <p>{formatTime(shift.startTime)} - {formatTime(shift.endTime)}  </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
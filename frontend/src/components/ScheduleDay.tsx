interface ScheduleProps {
    day: string;
    date: Date;
    shifts: Shift[]
    isAdmin: boolean;
}
interface Shift {
    id: number;
    username: string;
    startTime: string;
    endTime: string;
    isPosted: boolean;
}

export default function ScheduleDay({day, date, shifts = [], isAdmin} : ScheduleProps) {
    
    const formatTime = (timeStr : string) => new Date(timeStr).toLocaleTimeString([], { hour: "numeric", minute: "2-digit"});
    let postedShifts = [];
    if(isAdmin) {
        postedShifts = shifts;
    }
    else {
        postedShifts = shifts.filter(shift => shift.isPosted);
    }

    return (
        <div className="flex flex-col print-black">
            <div className="text-center border p-4 flex flex-col bg-slate-900 print-white">
                <h1 className="text-lg text-gray-400">{date.getDate()}</h1>
                <h1 className="text-xl font-bold">{day}</h1>
            </div>
            <div className="border h-full flex flex-col gap-y-4">
                {postedShifts.map((shift: Shift) => {
                    return (
                        <div key={shift.id} className="text-sm text-center my-4 flex flex-col">
                            <p className={`text-lg print-black font-bold ${shift.isPosted ? 'text-white' : 'text-yellow-400'}`}>{shift.username}:</p> 
                            <p className={`print-black print-smaller ${shift.isPosted ? 'text-white' : 'text-yellow-400'}`}>{formatTime(shift.startTime)} - {formatTime(shift.endTime)}  </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
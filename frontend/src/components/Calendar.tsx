"use client";

import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
} from "date-fns";

import { toZonedTime, format as tzFormat } from "date-fns-tz";

interface Shift {
  id: number;
  username: string;
  startTime: string;
  endTime: string;
  isPosted: boolean;
}
interface ChildProps {
  shifts: Shift[];
  month: Date;
  isAdmin: boolean;
}

export default function Calendar({ shifts, month, isAdmin }: ChildProps) {
  
  let postedShifts = [];
  if(isAdmin) {
      postedShifts = shifts;
  }
  else {
      postedShifts = shifts.filter(shift => shift.isPosted);
  }

  const timezone = "America/Phoenix";

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);

  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const weeks = [];
  let currentDate = calendarStart;

  while (currentDate <= calendarEnd) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(currentDate);
      currentDate = addDays(currentDate, 1);
    }
    weeks.push(week);
  }

    

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="border rounded">
      <div className="grid grid-cols-7 border-b bg-slate-900">
        {dayNames.map((day) => (
          <div key={day} className="p-2 text-center font-semibold">
            {day}
          </div>
        ))}
      </div>
      {weeks.map((week, i) => (
        <div key={i} className="grid grid-cols-7 border-b">
          {week.map((day) => {
            const dayShifts = postedShifts.filter((shift) => {
              const startZoned = toZonedTime(parseISO(shift.startTime), timezone);
              return isSameDay(startZoned, day);
            });

            return (
              <div
                key={day.toISOString()}
                className="border-r p-2 min-h-[100px] align-top"
              >
                <div
                  className={
                    format(day, "M") === format(month, "M")
                      ? "font-bold mb-4"
                      : "text-gray-500 mb-4"
                  }
                >
                  {format(day, "d")}
                </div>
                {dayShifts.map((shift) => {
                  const startZoned = toZonedTime(parseISO(shift.startTime), timezone);
                  const endZoned = toZonedTime(parseISO(shift.endTime), timezone);

                  return (
                    <div key={shift.id} className={`text-sm ${shift.isPosted ? 'text-white' : 'text-yellow-400'}`}>
                      {shift.username[0]}:{" "}
                      {tzFormat(startZoned, "h:mm a", { timeZone: timezone })} -{" "}
                      {tzFormat(endZoned, "h:mm a", { timeZone: timezone })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
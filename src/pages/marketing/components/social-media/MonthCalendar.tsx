
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";

interface MonthCalendarProps {
  selectedMonth: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  setIsCalendarOpen: (isOpen: boolean) => void;
  handlePreviousMonth: () => void;
  handleNextMonth: () => void;
}

const MonthCalendar: React.FC<MonthCalendarProps> = ({
  selectedMonth,
  selectedDate,
  setSelectedDate,
  setIsCalendarOpen,
  handlePreviousMonth,
  handleNextMonth
}) => {
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const currentYear = selectedMonth.getFullYear();
  const currentMonth = selectedMonth.getMonth();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Get days from previous month to fill the first week
  const prevMonthDays = [];
  const prevMonth = subMonths(selectedMonth, 1);
  const daysInPrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0).getDate();
  
  for (let i = 0; i < firstDayOfMonth; i++) {
    prevMonthDays.unshift(daysInPrevMonth - i);
  }
  
  // Current month days
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Calculate how many days we need from next month
  const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
  const nextMonthDays = Array.from({ length: totalCells - (prevMonthDays.length + days.length) }, (_, i) => i + 1);
  
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={handlePreviousMonth} 
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-xl font-medium">
          {format(selectedMonth, "MMMM yyyy")}
        </div>
        <button 
          onClick={handleNextMonth} 
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {daysOfWeek.map(day => (
          <div key={day} className="text-gray-500 font-medium py-2">
            {day}
          </div>
        ))}
        {prevMonthDays.map(day => (
          <div key={`prev-${day}`} className="py-2 text-gray-300">
            {day}
          </div>
        ))}
        {days.map(day => {
          const isToday = 
            day === new Date().getDate() && 
            currentMonth === new Date().getMonth() && 
            currentYear === new Date().getFullYear();
          const isSelected = 
            day === selectedDate.getDate() && 
            currentMonth === selectedDate.getMonth() && 
            currentYear === selectedDate.getFullYear();
          
          return (
            <div 
              key={`current-${day}`}
              className={`py-2 cursor-pointer rounded-full hover:bg-gray-100 ${isToday ? 'font-bold' : ''} ${
                isSelected ? 'bg-purple-500 text-white hover:bg-purple-600' : ''
              }`}
              onClick={() => {
                setSelectedDate(new Date(currentYear, currentMonth, day));
                setIsCalendarOpen(false);
              }}
            >
              {day}
            </div>
          );
        })}
        {nextMonthDays.map(day => (
          <div key={`next-${day}`} className="py-2 text-gray-300">
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthCalendar;

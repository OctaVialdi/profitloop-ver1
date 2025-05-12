
import { useState, useCallback } from 'react';
import { format, addMonths, subMonths } from 'date-fns';

interface ContentManager {
  name: string;
  dailyTarget: number;
  monthlyTarget: number;
  monthlyTargetAdjusted: number;
  progress: number;
  onTimeRate: number;
  effectiveRate: number;
  score: number;
}

export const useTargetManagement = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);
  const [isEditTargetOpen, setIsEditTargetOpen] = useState(false);
  const [editingManager, setEditingManager] = useState<ContentManager | null>(null);
  const [targetValue, setTargetValue] = useState<string>("20");
  
  // Mock content managers data
  const contentManagers: ContentManager[] = [
    {
      name: "John Doe",
      dailyTarget: 20,
      monthlyTarget: 20,
      monthlyTargetAdjusted: 20,
      progress: 75,
      onTimeRate: 80,
      effectiveRate: 90,
      score: 82
    },
    {
      name: "Jane Smith",
      dailyTarget: 20,
      monthlyTarget: 20,
      monthlyTargetAdjusted: 15,
      progress: 80,
      onTimeRate: 70,
      effectiveRate: 85,
      score: 78
    },
    {
      name: "Mike Johnson",
      dailyTarget: 15,
      monthlyTarget: 15,
      monthlyTargetAdjusted: 18,
      progress: 65,
      onTimeRate: 75,
      effectiveRate: 80,
      score: 76
    },
    {
      name: "Sara Williams",
      dailyTarget: 18,
      monthlyTarget: 18,
      monthlyTargetAdjusted: 20,
      progress: 85,
      onTimeRate: 85,
      effectiveRate: 88,
      score: 86
    }
  ];

  const handlePreviousMonth = useCallback(() => {
    setSelectedMonth(subMonths(selectedMonth, 1));
  }, [selectedMonth]);

  const handleNextMonth = useCallback(() => {
    setSelectedMonth(addMonths(selectedMonth, 1));
  }, [selectedMonth]);

  const handleEditTarget = useCallback((manager: ContentManager) => {
    setEditingManager(manager);
    setTargetValue(manager.monthlyTargetAdjusted.toString());
    setIsEditTargetOpen(true);
  }, []);

  const handleSaveTarget = useCallback(() => {
    // In a real app, you would update the manager's target here
    setIsEditTargetOpen(false);
    setEditingManager(null);
  }, []);

  // Calendar rendering logic
  const renderMonthCalendar = useCallback(() => {
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
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
          </button>
          <div className="text-xl font-medium">
            {format(selectedMonth, "MMMM yyyy")}
          </div>
          <button 
            onClick={handleNextMonth} 
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
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
  }, [selectedDate, selectedMonth, handleNextMonth, handlePreviousMonth]);

  return {
    selectedDate,
    selectedMonth,
    isCalendarOpen,
    isMonthSelectorOpen,
    isEditTargetOpen,
    editingManager,
    targetValue,
    contentManagers,
    setSelectedDate,
    setSelectedMonth,
    setIsCalendarOpen,
    setIsMonthSelectorOpen,
    setIsEditTargetOpen,
    setEditingManager,
    setTargetValue,
    handleEditTarget,
    handleSaveTarget,
    renderMonthCalendar
  };
};

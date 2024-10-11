import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isWithinInterval, parseISO } from 'date-fns';
import { Icon } from '@iconify/react/dist/iconify.js';

interface TodoItem {
  todo_id: string;
  name: string;
  status: string;
  shared: boolean;
  start: string;
  end: string;
}

interface CalendarProps {
  todoData: TodoItem[];
  onDateClick: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ todoData, onDateClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [pinkMode, setPinkMode] = useState(false);

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate)
    });

    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    const isDateInRange = (date: Date) => {
        return todoData.some(todo => 
            isWithinInterval(date, { start: parseISO(todo.start), end: parseISO(todo.end) })
        );
    };

    const handleDateClick = (date: Date) => {
        if (isDateInRange(date)) {
            if (selectedDate && isSameDay(date, selectedDate)) {
                setSelectedDate(null);
                onDateClick(new Date(0))
                return;
            }
            setSelectedDate(date);
            onDateClick(date);
        }
    };

    return (
        <div className={`p-4 h-1/2 rounded-3xl shadow-lg w-full ${pinkMode ? 'bg-pink-200' : 'bg-blue-200'}`}>
        <div className="flex justify-between items-center mb-4">
            <h2
            className="text-xl font-semibold text-indigo-800 cursor-pointer"
            onClick={() => {
                if (localStorage.getItem('clickCount')) {
                const clickCount = parseInt(localStorage.getItem('clickCount')!, 10) + 1;
                localStorage.setItem('clickCount', clickCount.toString());
                if (clickCount === 1) {
                    setPinkMode(false);
                }
                if (clickCount === 10) {
                    setPinkMode(prev => !prev);
                    localStorage.setItem('clickCount', '0');
                }
                } else {
                localStorage.setItem('clickCount', '1');
                }
            }}
            >
            {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div>
            <button onClick={handlePrevMonth} className="text-indigo-600 mr-2 rounded-full bg-slate-200 p-2">
                <Icon icon="mingcute:left-fill" className='text-xl' />
            </button>
            <button onClick={handleNextMonth} className="text-indigo-600 p-2 rounded-full bg-slate-200">
                <Icon icon="mingcute:right-fill" className='text-xl' />
            </button>
            </div>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-indigo-600 font-medium">{day}</div>
            ))}
            {daysInMonth.map(date => {
            const isCurrentMonth = isSameMonth(date, currentDate);
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isInRange = isDateInRange(date);
            return (
                <div
                key={date.toString()}
                className={`
                    p-2 rounded-full cursor-pointer
                    ${isCurrentMonth ? 'text-indigo-800' : 'text-indigo-300'}
                    ${isSelected ? 'bg-indigo-500 text-white' : ''}
                    ${isInRange && !isSelected ? 'hover:bg-indigo-300 bg-red-50' : ''}
                    ${!isInRange ? 'opacity-50' : ''}
                `}
                onClick={() => handleDateClick(date)}
                >
                {format(date, 'd')}
                </div>
            );
            })}
        </div>
        </div>
    );
};

export default Calendar;
import React, { useEffect, useState } from 'react';
import { format, parseISO, isToday, isTomorrow, isThisWeek, isAfter, isBefore, isEqual, startOfDay, endOfDay, addDays } from 'date-fns';
import { motion } from 'framer-motion';
import ViewTodo from './popup/ViewTodo';

interface Task {
  id: string;
  status: string;
  text: string;
  start: string;
  end: string;
}

interface ActivityTodoProps {
  todoData: any[];
  selectedDate: Date | null;
}

const ActivityTodo: React.FC<ActivityTodoProps> = ({ todoData, selectedDate }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [todoId, setTodoId] = useState('');
  const [showTodoDetailPopup, setShowTodoDetailPopup] = React.useState(false);
  const toggleTodoDetailPopup = () => setShowTodoDetailPopup(!showTodoDetailPopup);

  useEffect(() => {
    const newTasks = todoData
      .map((item: any) => {
        const start = selectedDate ? format(selectedDate, 'yyyy-MM-dd') + 'T' + format(parseISO(item.start), 'HH:mm:ss') : item.start;
        const end = selectedDate ? format(selectedDate, 'yyyy-MM-dd') + 'T' + format(parseISO(item.end), 'HH:mm:ss') : item.end;
        return {
          id: item.todo_id,
          status: item.status,
          text: item.name,
          start,
          end,
        };
      });
    setTasks(newTasks);
  }, [todoData, selectedDate]);

  const groupTasksByDate = () => {
    const grouped: { [key: string]: Task[] } = {};
    const currentDate = new Date();
    const startOfToday = startOfDay(currentDate);
    const endOfToday = endOfDay(currentDate);
    const startOfTomorrow = startOfDay(addDays(currentDate, 1));
    const endOfTomorrow = endOfDay(addDays(currentDate, 1));
  
    tasks.forEach(task => {
      const startDate = parseISO(task.start);
      const endDate = parseISO(task.end);
  
      const addToGroup = (date: Date, label: string) => {
        if (!grouped[label]) grouped[label] = [];
        if (!grouped[label].some(t => t.id === task.id)) {
          grouped[label].push(task);
        }
      };
  
      if (isBefore(endDate, startOfToday)) {
        addToGroup(startDate, 'Past');
      } else {
        if (
          (isBefore(startDate, startOfToday) && isAfter(endDate, startOfToday)) ||
          (isEqual(startDate, startOfToday) || isEqual(endDate, startOfToday)) ||
          (isAfter(startDate, startOfToday) && isBefore(startDate, endOfToday))
        ) {
          addToGroup(currentDate, 'Today');
        }
        if (
          (isBefore(startDate, startOfTomorrow) && isAfter(endDate, startOfTomorrow)) ||
          (isEqual(startDate, startOfTomorrow) || isEqual(endDate, startOfTomorrow)) ||
          (isAfter(startDate, startOfTomorrow) && isBefore(startDate, endOfTomorrow))
        ) {
          addToGroup(addDays(currentDate, 1), 'Tomorrow');
        }
        let currentCheckDate = isAfter(startDate, startOfToday) ? startDate : startOfToday;
        while (isBefore(currentCheckDate, endDate) || isEqual(currentCheckDate, endDate)) {
          const label = isToday(currentCheckDate)
            ? 'Today'
            : isTomorrow(currentCheckDate)
            ? 'Tomorrow'
            : isThisWeek(currentCheckDate, { weekStartsOn: 1 })
            ? format(currentCheckDate, 'EEEE')
            : format(currentCheckDate, 'MMMM d, yyyy');
          addToGroup(currentCheckDate, label);
          currentCheckDate = addDays(currentCheckDate, 1);
        }
      }
    });
  
    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      const order = ['Today', 'Tomorrow', 'Past'];
      const aIndex = order.indexOf(a);
      const bIndex = order.indexOf(b);
      
      // sooooo, 1 is like go down, -1 go up (in the list). phm kan? xixixi (for ur future reference ig)
      const getStatusOrder = (key: string) => {
        const tasks = grouped[key];
        if (tasks.some(task => task.status === 'Belum Selesai')) return -1;
        if (tasks.some(task => task.status === 'Dalam Progress')) return -1;
        if (tasks.some(task => task.status === 'Selesai')) return 1;
        return 0;
      };
  
      if (a === 'Past' && getStatusOrder(a) === -1) return -1;
      if (b === 'Past' && getStatusOrder(b) === -1) return 1;
  
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
  
      const statusOrderA = getStatusOrder(a);
      const statusOrderB = getStatusOrder(b);
      if (statusOrderA !== statusOrderB) return statusOrderA - statusOrderB;
  
      return a.localeCompare(b);
    });
  
    const sortedGrouped: { [key: string]: Task[] } = {};
    sortedKeys.forEach(key => {
      sortedGrouped[key] = grouped[key];
    });
  
    return sortedGrouped;
  };
  
  const groupedTasks = groupTasksByDate();

  return (
    <div className="dark:bg-gray-900 bg-[#f6f6f6] text-white p-6 rounded-3xl shadow-lg min-w-full mx-auto min-h-[45dvh] max-h-[45dvh] lg:min-h-full overflow-y-auto sigma-uwu-scrollbar">
      <ViewTodo todo_id={todoId} show={showTodoDetailPopup} onClose={toggleTodoDetailPopup} />
      {Object.entries(groupedTasks).length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center"
          >
            <span className="text-4xl">✨</span>
            <span className="text-lg ml-4 text-black dark:text-white">No tasks found</span>
          </motion.div>
        </div>
      ) : (
        Object.entries(groupedTasks).map(([date, tasksForDate]) => (
          <motion.div
            key={date}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">{date}</h2>
              <ul>
                {tasksForDate.map(task => (
                  <li key={task.id} className="mb-2" onClick={() => {
                    setTodoId(task.id);
                    toggleTodoDetailPopup();
                  }}>
                    <div className='flex justify-between items-center'>
                        <span className={`font-medium ${task.status == 'Selesai' ? 'line-through' : ''} dark:text-gray-200 text-gray-800`}>
                          {task.text.length > 20 ? `${task.text.substring(0, 20)}...` : task.text}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                        {format(parseISO(task.start), 'HH:mm')}
                        {format(parseISO(task.start), 'yyyy-MM-dd') === format(parseISO(task.end), 'yyyy-MM-dd') ? ` - ${format(parseISO(task.end), 'HH:mm')}` : ''}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{task.status}</p>
                    {selectedDate === null && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {format(parseISO(task.start), 'dd MMMM yyyy')} - {format(parseISO(task.end), 'dd MMMM yyyy')}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
          
        ))
      )}
    </div>
  );
};

export default ActivityTodo;
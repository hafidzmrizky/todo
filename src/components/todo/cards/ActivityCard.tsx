import React from 'react';
import { Icon } from '@iconify/react';
import { format } from 'date-fns';
import ViewTodo from '../popup/ViewTodo';

interface ActivityCard {
    task: {
        todo_id: string;
        name: string;
        start: string;
        end: string;
        shared: boolean;
        status: string;
    };
}

const ActivityCard = ({ task }: ActivityCard) => {

    const [showTodoDetailPopup, setShowTodoDetailPopup] = React.useState(false);
    const toggleTodoDetailPopup = () => setShowTodoDetailPopup(!showTodoDetailPopup);

    const formatTime = (dateString: string | number | Date) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const isPast = new Date(task.end) < new Date();

    const isToday = new Date(task.start).toDateString() === new Date().toDateString() || 
                                (new Date(task.start) <= new Date() && new Date(task.end) >= new Date());

  return (
    <>          
    <div className={`font-poppins h-48 flex flex-col p-4 rounded-xl mt-3 ${task.status === 'Selesai' ? 'bg-green-100' : isToday ? 'bg-amber-100' : isPast ? 'bg-red-100' : 'bg-blue-300'}`}>
    <div className="flex justify-between items-start mb-2">
      <div>
        {isToday && (
          <div className="text-xs font-semibold text-amber-600 mb-1">Today - {format(new Date(task.end), 'EEEE, d MMMM yyyy')}</div>
        )}
        {!isToday && !isPast && (
          <div className="text-sm font-semibold text-black mb-1">
            {format(new Date(task.start), 'EEEE, d MMMM yyyy')}
            {new Date(task.start).toDateString() !== new Date(task.end).toDateString() && (
              <> - {format(new Date(task.end), 'EEEE, d MMMM yyyy')}</>
            )}
          </div>
        )}
        {isPast && (
          <div className="text-xs font-semibold text-red-600 mb-1">{format(new Date(task.end), 'EEEE, d MMMM yyyy')}</div>
        )}
      </div>
    <button className={`text-black hover:text-gray-600 border border-black p-1 rounded-full hover:bg-gray-100 ${task.shared ? 'bg-green-100' : ''}`} onClick={toggleTodoDetailPopup}>
      <Icon icon="mingcute:arrow-up-line" width="20" height="20" style={{ transform: 'rotate(45deg)' }} />
    </button>
    </div>
    <h2 className="text-2xl font-medium font-poppins text-black mb-2">
    {task.status === 'Selesai' ? <s>{task.name.length > 30 ? `${task.name.substring(0, 30)}...` : task.name}</s> : task.name.length > 30 ? `${task.name.substring(0, 30)}...` : task.name}
    </h2>
    <div className="flex-grow">
    </div>
    <div className="text-sm text-gray-600">
      <span>
        {task.status} • {formatTime(task.start)} {new Date(task.start).toDateString() === new Date(task.end).toDateString() ? ' - ' + formatTime(task.end) : ''}
      </span>
    </div>
    <ViewTodo todo_id={task.todo_id} show={showTodoDetailPopup} onClose={toggleTodoDetailPopup} />
  </div>
  </>
  );
};

export default ActivityCard;
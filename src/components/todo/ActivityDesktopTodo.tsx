import { Icon } from "@iconify/react/dist/iconify.js";
import ActivityCard from "./cards/ActivityCard";
import { motion } from "framer-motion";

interface ActivityDesktopTodoProps {
    todoData: any[];
    selectedDate: Date | null;
}

const ActivityDesktopTodo: React.FC<ActivityDesktopTodoProps> = ({ todoData, selectedDate }) => {

    const sortedTasks = todoData.sort((a, b) => {

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const aStart = new Date(a.start);
            const aEnd = new Date(a.end);
            const bStart = new Date(b.start);
            const bEnd = new Date(b.end);

            const isAToday = aStart <= today && aEnd >= today && a.status !== 'Selesai';
            const isBToday = bStart <= today && bEnd >= today && b.status !== 'Selesai';

            const isAFuture = aStart > today && a.status !== 'Selesai';
            const isBFuture = bStart > today && b.status !== 'Selesai';

            const isAPast = aEnd < today && a.status !== 'Selesai';
            const isBPast = bEnd < today && b.status !== 'Selesai';

            const isASelesai = a.status === 'Selesai';
            const isBSelesai = b.status === 'Selesai';

            if (isAToday && !isBToday) return -1;
            if (!isAToday && isBToday) return 1;

            if (isAFuture && !isBFuture) return -1;
            if (!isAFuture && isBFuture) return 1;

            if (isAPast && !isBPast) return -1;
            if (!isAPast && isBPast) return 1;

            if (isASelesai && !isBSelesai) return 1;
            if (!isASelesai && isBSelesai) return -1;

            return 0;
        });

    return (
        <div className="max-h-[45vh] h-[35dvh] min-h-[35dvh] lg:min-h-full flex flex-col  w-full max-w-lg rounded-xl bg-slate-50 dark:bg-gray-800 p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-poppins font-bold">To-do</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">bro.. you have {todoData.length} tasks</p>
        </div>
        
        {todoData.length === 0 ? (
          <div className="flex items-center justify-center flex-grow">
            <h2 className="text-lg font-semibold text-gray-500">No to-do items</h2>
          </div>
        ) : (
          <div className="overflow-y-auto flex-grow sigma-uwu-scrollbar">
            <div className="space-y-4">
              {sortedTasks.map((task, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ActivityCard task={task} />
                </motion.div>
              ))}
            </div>
            </div>
        )}
      </div>
    )

}

export default ActivityDesktopTodo;
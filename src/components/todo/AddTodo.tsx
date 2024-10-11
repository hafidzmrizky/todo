import { useLocalStorage } from "@/hooks/useLocalStorage";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

const AddTodo: React.FC = () => {
    const [sessionToken] = useLocalStorage('session_token', '');
    const [name, setName] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');

    const header = useMemo(() => ({
        'session-id': sessionToken,
        'Content-Type': 'application/json',
    }), [sessionToken]);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const data = await fetch('/api/todo/action/add', {
            method: 'POST',
            headers: header,
            body: JSON.stringify({ name, start, end }),
        });

        if (data.status === 201) {
            handleReset();
            window.location.reload();
        } else {
            alert('Failed to create task.');
        }
    };

    const handleReset = () => {
        setName('');
        setStart('');
        setEnd('');
    };

    return (
        <div className="bg-slate-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-[600px] max-h-[80vh] overflow-x-hidden mb-4">
            <h2 className="text-2xl font-semibold mb-4 font-poppins">Add a new task</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Task Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out text-gray-700"
                        placeholder="Enter task name"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                        </label>
                        <div className="relative">
                            <input
                                type="datetime-local"
                                id="start"
                                value={start}
                                onChange={(e) => setStart(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out text-gray-700"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                        </label>
                        <div className="relative">
                            <input
                                type="datetime-local"
                                id="end"
                                value={end}
                                onChange={(e) => setEnd(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out text-gray-700"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <motion.button
                        type="button"
                        onClick={handleReset}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:dark:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out bg-white dark:bg-gray-700 dark:text-gray-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Reset
                    </motion.button>
                    <motion.button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Create Task
                    </motion.button>
                </div>
            </form>
        </div>
    )
}

export default AddTodo;

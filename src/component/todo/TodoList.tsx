import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<string[]>([]);
    const [input, setInput] = useState<string>('');

    const addTodo = () => {
        if (input.trim()) {
            setTodos([...todos, input.trim()]);
            setInput('');
        }
    };

    const removeTodo = (index: number) => {
        setTodos(todos.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-black text-white p-4 rounded">
            <h1 className="text-2xl font-bold mb-4">To-Do List</h1>
            <div className="flex mb-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-l text-black"
                    placeholder="Add a new task"
                />
                <button
                    onClick={addTodo}
                    className="p-2 bg-blue-500 text-black rounded-r"
                >
                    Add
                </button>
            </div>
            <div className="overflow-y-auto max-h-64">
                <ul>
                    <AnimatePresence>
                        {todos.map((todo, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex justify-between items-center p-2 mb-2 border border-gray-300 rounded"
                            >
                                {todo}
                                <button
                                    onClick={() => removeTodo(index)}
                                    className="text-red-500"
                                >
                                    Remove
                                </button>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            </div>
        </div>
    );
};

export default TodoList;
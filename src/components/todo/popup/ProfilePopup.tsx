import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import AddTodo from "../AddTodo";
import Profile from "@/components/account/Profile";

interface ProfilePopupProps {
    show: boolean;
    onClose: () => void;
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({ show, onClose }) => {

    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg z-50 w-full max-w-md md:max-w-[400px] max-h-[50vh] overflow-y-hidden overflow-x-hidden">
            <div className="flex items-center justify-between mb-4">
                <motion.button 
                onClick={onClose} 
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700 bg-gray-300 dark:bg-gray-700"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                >
                <Icon icon="ic:baseline-close" className="text-xl dark:text-white" />
                </motion.button>
            </div>
            <Profile />
            </div>
        </div>
    )
}

export default ProfilePopup;
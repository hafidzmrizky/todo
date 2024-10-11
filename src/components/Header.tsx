import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Search from './todo/popup/Search';
import AddTodoPopup from './todo/popup/AddTodo';
import { useRouter } from 'next/router';
import ProfilePopup from './todo/popup/ProfilePopup';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const router = useRouter();
  const currentLocation = router.pathname;

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggleSearch = () => setShowSearch(!showSearch);
  const toggleAddTodo = () => setShowAddTodo(!showAddTodo);
  const toggleProfile = () => setShowProfile(!showProfile);

  return (
    <div className="h-16 w-full dark:bg-[#1a1a1a] bg-slate-100 rounded-lg items-center flex p-4 sticky top-0 z-50">
      <div className="text-xl font-bold mr-auto flex items-center" onClick={() => window.location.href = '/'}>
        <img src="/img/logo_todo.png" alt="logo" className="h-10 mr-2" />
        <h1 className="inline font-poppins">Todo App</h1>
      </div>
      {currentLocation === '/' && (
        <div className="flex items-center">
          <Icon icon="mi:add" className="ml-3 lg:hidden text-2xl cursor-pointer" onClick={toggleAddTodo} />
          <Icon icon="material-symbols:search" className="ml-3 text-2xl cursor-pointer" onClick={toggleSearch} />
        </div>
      )}
      <Icon icon="solar:user-bold" className="ml-3 text-2xl cursor-pointer" onClick={toggleDropdown} />
      {showDropdown && (
        <div className="absolute right-2 top-full mt-2 w-48 bg-white dark:bg-[#1a1a1a] rounded-md shadow-lg z-50">
          <ul className="py-1">
            <li className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer" onClick={toggleProfile}>
              <a>Manage Session</a>
            </li>
          </ul>
        </div>
      )}
      <Search show={showSearch} onClose={toggleSearch} />
      <AddTodoPopup show={showAddTodo} onClose={toggleAddTodo} />
      <ProfilePopup show={showProfile} onClose={toggleProfile} />
    </div>
  );
};

export default Header;
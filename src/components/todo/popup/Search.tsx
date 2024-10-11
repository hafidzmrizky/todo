import React, { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import ViewTodo from './ViewTodo';

interface PopupProps {
  show: boolean;
  onClose: () => void;
}

const Search: React.FC<PopupProps> = ({ show, onClose }) => {
  const [searchHistory, setSearchHistory] =  useLocalStorage('search_history', '');
  const [sessionToken] = useLocalStorage('session_token', '');
  const [searchH, setSearchH] = useState(searchHistory ? searchHistory.split(',') : []);
  interface TodoItem {
    todo_id: string;
    name: string;
  }
  const [noSearchResult, setNoSearchResult] = useState(false);
  const [searchResult, setSearchResult] = useState<TodoItem[]>([]);
  const [todoId, setTodoID] = useState('');
  const [showTodoDetailPopup, setShowTodoDetailPopup] = React.useState(false);
  const toggleTodoDetailPopup = () => setShowTodoDetailPopup(!showTodoDetailPopup);

  const headers = useMemo(() => ({
    'session-id': sessionToken,
  }), [sessionToken]);

  if (!show) return null;

  const handleRemoveSearchTerm = (term: string) => {
    setSearchHistory(searchH.filter((t) => t !== term).join(','));
    setSearchH(searchH.filter((t) => t !== term));
  };

  const handleSearching = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = event.target.value.trim();

    const searchAPI = await fetch(`/api/todo/search?q=${newTerm}`, {
      headers,
    });
   
    if (searchAPI.ok) {
      const data = await searchAPI.json();

      if (data.length === 0) {
        setNoSearchResult(true);
      } else {
        setNoSearchResult(false);
        setSearchResult(data);
      }
    }

    if (newTerm && !searchH.includes(newTerm)) {
      setTimeout(() => {
        const updatedSearchH = [...searchH, newTerm];
        if (updatedSearchH.length > 5) {
          updatedSearchH.shift();
        }
        setSearchHistory(updatedSearchH.join(','));
        setSearchH(updatedSearchH);
      }, 200);
    }
  };
  let typingTimeout: NodeJS.Timeout;

  const handleTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      if (event.target.value.trim() !== '') {
        handleSearching(event);
      }
    }, 500);

  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {showTodoDetailPopup && <ViewTodo todo_id={todoId} show={showTodoDetailPopup} onClose={toggleTodoDetailPopup} />}
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg z-50 w-96 md:w-[600px]  max-h-[80vh] overflow-y-auto">
        <div className="flex items-center mb-4">
          <Icon icon="mdi:magnify" className="text-gray-400 mr-2" />
          <input
            id='search'
            onInput={handleTyping}
            type="text"
            placeholder="Search for todos"
            className="flex-grow bg-transparent border-none outline-none text-lg"
          />
        </div>

        <div className="mb-6">
          <h3 className="text-sm text-gray-500 mb-2">was searching for</h3>
          <div className="flex flex-wrap gap-2">
            {searchH.map((term, index) => (
              <span key={index} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-sm flex items-center">
                <p onClick={() => {
                handleSearching({ target: { value: term } } as any);
                (document.getElementById('search') as HTMLInputElement).value = term;
              }}>{term}</p>
                <button onClick={() => handleRemoveSearchTerm(term)} className="ml-1 text-gray-500 hover:text-gray-700">×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          {noSearchResult && <h3 className="text-lg font-bold dark:text-gray-200 text-gray-500">no result found, maybe try making that todo? ;p </h3>}
          {searchResult.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <span className='md:hidden'>{item.name.length > 25 ? `${item.name.substring(0, 25)}...` : item.name}</span>
                <span className='hidden md:block'>{item.name.length > 50 ? `${item.name.substring(0, 50)}...` : item.name}</span>
              </div>
                <div className='flex items-center'>
                    <button className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm" onClick={() => {
                        setTodoID(item.todo_id);
                        toggleTodoDetailPopup();
                    }}>View</button>
                </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500">
            <button onClick={onClose} className="text-blue-500 hover:underline">Close</button>
        </div>
      </div>
    </div>
  );
};

export default Search;
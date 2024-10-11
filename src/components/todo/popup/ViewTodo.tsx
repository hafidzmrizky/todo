import useFetch from '@/hooks/useFetch';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Icon } from '@iconify/react/dist/iconify.js';
import { motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { format, parseISO, addMinutes, set } from 'date-fns';

interface PopupPropsViewTodo {
  todo_id: string;
  show: boolean;
  onClose: () => void;
}

interface TodoData {
    session_id: string;
    todo_id: string;
    name: string;
    status: string;
    shared: boolean;
    start: string;
    end: string;
}

interface TodoDateTimeInputProps {
  editedTodo: TodoData;
  setEditedTodo: React.Dispatch<React.SetStateAction<TodoData>>;
}

const ViewTodo: React.FC<PopupPropsViewTodo> = ({ todo_id, show, onClose }) => {
    if (!show) return null;
    const baseUrl = 'https://assignment.arcanius.id/todo';
    const MySwal = withReactContent(Swal);
    const [sessionToken] = useLocalStorage('session_token', '');
    const [editMode, setEditMode] = React.useState(false);
    const [todoData, setTodoData] = React.useState<TodoData | null>(null);
    const [editedTodo, setEditedTodo] = useState<TodoData | null>(todoData);
    if (!sessionToken) {
        return (
            <div>
            </div>
        )
    }

    const headers = useMemo(() => ({
        'session-id': sessionToken,
      }), [sessionToken]);
    
    

    const { data, loading, error } = useFetch(`/api/todo/${todo_id}`, headers);

    useEffect(() => {
        if (error) {
          console.error(error);
          console.error('Session check failed, generating new session');
        }

        if (data) {
          setTodoData(data);
          setEditedTodo(data);
        }
    }, [error, data]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>please wait o.o</p>
            </div>
        );
    }

    const shareTodo = () => {

      const updateTodo = fetch(`/api/todo/action/share`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'session-id': sessionToken,
        },
        body: JSON.stringify({ todo_id, share: true }),
      });

      updateTodo.then(response => {
        if (response.status === 200) {
          setTodoData(todoData ? { ...todoData, shared: true } : null);
          navigator.clipboard.writeText(`${baseUrl}?import=${todo_id}`).catch(error => {
            MySwal.fire({
              toast: true,
              position: 'bottom',
              icon: 'error',
              title: 'Failed to copy link to clipboard!, link is ' + `${baseUrl}?import=${todo_id}`,
              showConfirmButton: false,
              timer: 8000,
              timerProgressBar: true,
            });
          });
          MySwal.fire({
            toast: true,
            position: 'bottom',
            icon: 'success',
            title: 'Todo shared successfully! and copied to clipboard',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } else {
          MySwal.fire({
            toast: true,
            position: 'bottom',
            icon: 'error',
            title: 'Failed to share Todo!',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        }}).catch(error => {
          MySwal.fire({
            toast: true,
            position: 'bottom',
            icon: 'error',
            title: 'An error occurred: ' + error.message,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        })
      };

    const unshareTodo = () => {
        const updateTodo = fetch(`/api/todo/action/share`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'session-id': sessionToken,
          },
          body: JSON.stringify({ todo_id, share: false }),
        });
  
        updateTodo.then(response => {
          if (response.status === 200) {
            setTodoData(todoData ? { ...todoData, shared: false } : null);
            MySwal.fire({
              toast: true,
              position: 'bottom',
              icon: 'success',
              title: 'Todo unshared successfully!',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
          } else {
            MySwal.fire({
              toast: true,
              position: 'bottom',
              icon: 'error',
              title: 'Failed to unshare Todo!',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
          }
        }).catch(error => {
          MySwal.fire({
            toast: true,
            position: 'bottom',
            icon: 'error',
            title: 'An error occurred: ' + error.message,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        })
    }

    const addToCalendar = () => {

        if (!todoData) {
            return;
        }

        const calendarEvent = {
            title: todoData?.name,
            start: todoData?.start,
            end: todoData?.end,
            description: `Status: ${todoData?.status}`,
        };

        const calendarData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `SUMMARY:${calendarEvent.title}`,
        `DTSTART:${calendarEvent.start.replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTEND:${calendarEvent.end.replace(/[-:]/g, '').split('.')[0]}Z`,
        `DESCRIPTION:${calendarEvent.description}`,
        'END:VEVENT',
        'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([calendarData], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${calendarEvent.title}.ics`;
        a.click();
        URL.revokeObjectURL(url);

        MySwal.fire({
            toast: true,
            position: 'bottom',
            icon: 'success',
            title: 'Event added to calendar!',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
    }

    const handleSave = () => {

        const update = fetch(`/api/todo/action/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'session-id': sessionToken,
            },
            body: JSON.stringify(editedTodo),
        });

        update.then(response => {
            setEditMode(false);
            if (response.status === 200) {
                MySwal.fire({
                    toast: true,
                    position: 'bottom',
                    icon: 'success',
                    title: 'Todo updated successfully!',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });

                window.location.reload();
                setTodoData(editedTodo);
            } else {
                MySwal.fire({
                    toast: true,
                    position: 'bottom',
                    icon: 'error',
                    title: 'Failed to update Todo!',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
            }
        }).catch(error => {
            MySwal.fire({
                toast: true,
                position: 'bottom',
                icon: 'error',
                title: 'An error occurred: ' + error.message,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        });
    };
    
    const statusOptions = [
        { id: 1, label: 'Belum Selesai' },
        { id: 2, label: 'Dalam Progress' },
        { id: 3, label: 'Selesai' },
    ];

    const formatForInput = (isoString: string | undefined) => {
      if (!isoString) return '';
      const date = parseISO(isoString);
      return format(date, "yyyy-MM-dd'T'HH:mm");
    };

    const handleDateTimeChange = (field: 'start' | 'end', value: string) => {
      const date = new Date(value);
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      const utcDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
      if (editedTodo) {
      setEditedTodo({
        ...editedTodo,
        [field]: utcDate.toISOString(),
      });
      console.log(editedTodo);
      }
    };

    const formatDate = (isoString: string | undefined) => {
      if (!isoString) return '';
      const date = parseISO(isoString);
      return format(date, "dd MMM yyyy 'at' HH:mm");
    }
    
  function deleteTodo() {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
      const deleteTodo = fetch(`/api/todo/action/remove`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        'session-id': sessionToken,
        },
        body: JSON.stringify({ todo_id }),
      });

      deleteTodo.then(response => {
        if (response.status === 200) {
        MySwal.fire({
          toast: true,
          position: 'top-right',
          icon: 'success',
          title: 'Todo deleted successfully!',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        window.location.reload();
        } else {
        MySwal.fire({
          toast: true,
          position: 'top-right',
          icon: 'error',
          title: 'Failed to delete Todo!',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        }
      }).catch(error => {
        MySwal.fire({
        toast: true,
        position: 'top-right',
        icon: 'error',
        title: 'An error occurred: ' + error.message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        });
      });
      }
    });

  }

      return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4 my-8 max-h-[90vh] overflow-hidden">
            <div className="absolute top-2 left-2 z-10">
              <motion.button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors duration-200 ease-in-out p-2 rounded-full bg-black bg-opacity-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon icon="eva:arrow-back-fill" width="24" height="24" />
              </motion.button>
            </div>
            <div className="absolute top-2 right-2 z-10 flex">
              <motion.button
                onClick={() => shareTodo()}
                className="text-white hover:text-gray-200 transition-colors duration-200 ease-in-out p-2 mr-2 rounded-full bg-black bg-opacity-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon icon="fluent:share-16-regular" width="24" height="24" />
              </motion.button>
              <motion.button
                onClick={() => addToCalendar()}
                className="text-white hover:text-gray-200 transition-colors duration-200 ease-in-out p-2 mr-2 rounded-full bg-black bg-opacity-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon icon="carbon:calendar" width="24" height="24" />
              </motion.button>
              <motion.button
                onClick={() => setEditMode(!editMode)}
                className="text-white hover:text-gray-200 transition-colors duration-200 ease-in-out p-2 rounded-full bg-black bg-opacity-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon icon={editMode ? "basil:cross-outline" : "akar-icons:edit"} width="24" height="24" />
              </motion.button>
            </div>
            <div className="relative">
              <img src="https://is3.cloudhost.id/gotong-garuda-hack/image-todo/_183e648f-165d-4fe3-a597-04f084c52f48.jpeg" alt="To do list" className="w-full h-48 sm:h-64 object-cover object-center" />
              <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black to-transparent w-full">
                {editMode ? (
                  <input
                    type="text"
                    value={editedTodo?.name}
                    onChange={(e) => setEditedTodo({...todoData, name: e.target.value} as TodoData)}
                    className='text-xl sm:text-2xl font-semibold text-white font-poppins bg-transparent border-b border-white w-full'
                  />
                ) : (
                  <p className='text-xl sm:text-2xl font-semibold text-white font-poppins truncate'>{todoData?.name}</p>
                )}
                {!editMode && (
                  <p className='text-sm text-gray-300 font-poppins'>
                    {todoData?.status}
                  </p>
                )}
              </div>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 12rem)' }}>
              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <select
                      value={editedTodo?.status}
                      onChange={(e) => setEditedTodo({...editedTodo, status: e.target.value} as TodoData)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.id} value={option.label}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Start Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={formatForInput(editedTodo?.start)}
                      onChange={(e) => handleDateTimeChange('start', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      End Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={formatForInput(editedTodo?.end)}
                      onChange={(e) => handleDateTimeChange('end', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <motion.button
                    onClick={handleSave}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Save Changes
                  </motion.button>
                  <motion.button
                    onClick={deleteTodo}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Delete Todo
                  </motion.button>
                </div>
              ) : (
                <div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Start</p>
                      <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{formatDate(todoData?.start)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">End</p>
                      <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{formatDate(todoData?.end)}</p>
                    </div>
                    {todoData?.shared && (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 dark:text-gray-400">This todo is shared</p>
                        <motion.button
                          onClick={unshareTodo}
                          className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Unshare
                        </motion.button>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>,
    document.body
  );
};

export default ViewTodo;

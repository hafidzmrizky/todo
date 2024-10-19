import React, { useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import Calendar from '@/components/calendar/Calendar';
import ActivityTodo from '@/components/todo/ActivityTodo';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import useFetch from '@/hooks/useFetch';
import ActivityDesktopTodo from '@/components/todo/ActivityDesktopTodo';
import { motion } from 'framer-motion';
import AddTodo from '@/components/todo/AddTodo';
import AffirmationDisplay from '@/components/todo/WordsOfAffirmation';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

// ok, for reference future me, this is to delay the funct call to avoid multiple crazy fetches and to save on network usage (i think? it works, so uh dont touch pls)
function debounce(fn: Function, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

const IndexPage: React.FC = () => {
  const [sessionToken, setSessionToken] = useLocalStorage('session_token', '');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [todoData, setTodoData] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const router = useRouter();
  const importId = router.query.import as string;
  const connectId = router.query.connectcode as string;

  const headers = useMemo(() => ({
    'session-id': sessionToken,
  }), [sessionToken]);

  const { data, loading, error, refetch } = useFetch(`/api/todo?status=${filterStatus}`, headers);

  useEffect(() => {
    if (connectId) {
      const fetchData = async () => {
        const response = await fetch(`/api/session/check`, {
          headers: {
            'session-id': connectId,
          },
        });

        if (response.status === 200) {
          setSessionToken(connectId);
          Swal.fire({
            title: 'Connection successful',
            text: 'Your account has been connected successfully',
            icon: 'success',
            toast: true,
            position: 'top-right',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          
          if (sessionToken) {
            router.push('/');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        } else {
          Swal.fire({
            title: 'Connection failed',
            text: 'Failed to connect the account',
            icon: 'error',
            toast: true,
            position: 'top-right',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      };

      fetchData();
    }
  }, [connectId]);

  const debouncedSetFilterStatus = debounce((status: string) => {
    refetch(`/api/todo?status=${status}`, headers);
    setFilterStatus(status);
  }, 300); 

  const handleSetFilterStatus = (status: string) => {
    debouncedSetFilterStatus(status);
  };

  const handleCalendarDateClick = async (date: Date) => {
    setSelectedDate(date);

    let url = '/api/todo';

    if (filterStatus) {
      url += `?status=${filterStatus}`;
    }

    if (date.getTime() === 0) {
      setSelectedDate(null);
    } else {
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);
      filterStatus ? url += `&date=${nextDay.toISOString()}` : url += `?date=${nextDay.toISOString()}`;
    }

    try {
      const response = await fetch(url, {
        headers,
      });
      if (!response.ok) {
        throw new Error('Failed to fetch to-do data');
      }
      const todoItems = await response.json();
      setTodoData(todoItems);
    } catch (fetchError) {
      console.error('Error fetching to-do data:', fetchError);
    }
  };

  useEffect(() => {
    if (error) {
      console.error(error);
      console.error('Session check failed, generating new session');
    }

    if (data) {
      setTodoData(data);
      console.log('Session is valid');
    } else {
      setTodoData([]);
    }
  }, [error, loading, data]);

  useEffect(() => {
    const fetchData = async () => {
      if (importId) {
        const response = await fetch(`/api/todo/action/import?importId=${importId}`, {
          headers,
        });

        if (response.ok) {
          Swal.fire({
            title: 'Import successful',
            text: 'Your task have been imported successfully',
            icon: 'success',
            toast: true,
            position: 'top-right',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });

          router.push('/');

          setTodoData([...todoData, await response.json()]);
        } else {
          Swal.fire({
            title: 'Import failed',
            text: 'Failed to import your task',
            icon: 'error',
            toast: true,
            position: 'top-right',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      }
    };

    fetchData();
  }, [importId]);

  return (
    <>
      {loading && (
        <div className='dark:bg-[#121212] dark:text-white bg-white text-black'>
          <div className='w-full h-screen flex justify-center items-center'>
            <div className='text-2xl font-bold'>Loading...</div>
          </div>
        </div>
      )}
      {!loading && (
        <div className="dark:bg-[#121212] dark:text-white bg-white text-black min-h-screen flex flex-col">
          <Header setFilterStatus={handleSetFilterStatus} filterStatus={filterStatus} />
          <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
            <div className="flex flex-col lg:flex-row flex-grow overflow-y-auto">
              <div className="w-full lg:w-1/3 flex flex-col p-4">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-4"
                >
                  <Calendar todoData={data} onDateClick={handleCalendarDateClick} />
                </motion.div>
                <div className="flex-grow">
                  <ActivityTodo todoData={todoData} selectedDate={selectedDate} />
                </div>
              </div>
              
              <div className="hidden lg:flex w-full lg:w-1/3 p-4">
                <ActivityDesktopTodo todoData={todoData} selectedDate={selectedDate} />
              </div>

              <div className="w-full lg:w-1/3 flex flex-col p-4">
                <div className="hidden lg:block mb-4">
                  <AddTodo />
                </div>
                <div className="flex-grow">
                  <AffirmationDisplay />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IndexPage;

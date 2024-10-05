import React from 'react';
import TodoList from '@/component/todo/TodoList';

const IndexPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <TodoList />
    </div>
  );
};

export default IndexPage;
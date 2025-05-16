// src/components/TodoList.tsx

import React, { useEffect, useState } from 'react';

import { API_URL } from '../api/api';
import { Todo } from '../types/todo-type';
import { TodoTile } from './TodoTile';

interface TodoListProps {
  onSelectTodo: (id: number) => void;
}
export interface FetchTodosParams {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setFilteredTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}
/**
 * fetchTodos function fetches todos from the API and updates the state.
 * @param setTodos - React setState Function to set the todos state.
 * @param setFilteredTodos - React setState Function to set the filtered todos state.
 * @param setLoading - react setState Function to set the loading state.
 * @param setError - react setState Function to set the error state.
 *
 * @returns {Promise<void>} - A promise that resolves when the todos are fetched and state is updated.  You should call this in useEffect.
 * setup useEffect to call this function when the component mounts
 * wraps the fetch API call in a try-catch block to handle errors gracefully and update the loading and error states accordingly.
 * The function uses async/await syntax to handle asynchronous operations, making the code cleaner and easier to read.
 * fetch from the URL https://jsonplaceholder.typicode.com/todos
 */
// remove eslint-disable-next-line @typescript-eslint/no-unused-vars when you use the parameters in the function
export const fetchTodos = async ({
  setTodos,
  setFilteredTodos,
  setLoading,
  setError,
}: FetchTodosParams): Promise<void> => {
  try {
    setLoading(true);

    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const posts = (await response.json()) as Todo[];

    setTodos(posts);
    setFilteredTodos(posts);
  } catch (e) {
    setError((e as Error).message);
  } finally {
    setLoading(false);
  }
};
/**
 * TodoList component fetches todos from the API and displays them in a list.
 * It also provides filter buttons to filter the todos based on their completion status.
 * @param onSelectTodo - A function that is called when a todo is selected. It receives the todo id as an argument.
 * @returns
 */

// remove the following line when you use onSelectTodo in the component

export const TodoList: React.FC<TodoListProps> = ({ onSelectTodo }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const FetchTodoProps: FetchTodosParams = {
    setTodos,
    setFilteredTodos,
    setLoading,
    setError,
  };

  // 0: all, 1: open, 2: completed
  const [currentFilter, setCurrentFilter] = useState(0);

  // useEffect Functions
  useEffect(() => {
    fetchTodos(FetchTodoProps);
  }, []);

  useEffect(() => {
    setFilteredTodos(() => {
      if (currentFilter !== 0) {
        const shouldFilterComplete = currentFilter === 2;
        return todos.filter((todo) => todo.completed === shouldFilterComplete);
      } else {
        return todos;
      }
    });
  }, [currentFilter]);

  // Handler Functions
  const onHandleSetFilter = (filter: number) => {
    setCurrentFilter(filter);
    setError(null);
  };

  return (
    <div className="todo-list">
      <h2>Todo List</h2>
      <div className="filter-buttons">
        <button
          data-testid="filter-all"
          className={currentFilter === 0 ? 'active' : 'inactive'}
          onClick={() => onHandleSetFilter(0)}
        >
          All
        </button>
        <button
          data-testid="filter-open"
          className={currentFilter === 1 ? 'active' : 'inactive'}
          onClick={() => onHandleSetFilter(1)}
        >
          Open
        </button>
        <button
          data-testid="filter-completed"
          className={currentFilter === 2 ? 'active' : 'inactive'}
          onClick={() => onHandleSetFilter(2)}
        >
          Completed
        </button>
      </div>
      {loading ? (
        <p>Loading todos</p>
      ) : (
        <div className="todo-list">
          {error ? (
            <h3>Error loading todos</h3>
          ) : (
            filteredTodos.map((todo) => TodoTile(todo, onSelectTodo))
          )}
        </div>
      )}
    </div>
  );
};

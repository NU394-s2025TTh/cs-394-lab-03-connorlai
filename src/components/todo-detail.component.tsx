// src/components/TodoDetail.tsx

import React, { SetStateAction, useEffect, useState } from 'react';

import { API_URL } from '../api/api';
import { Todo } from '../types/todo-type';

interface TodoDetailProps {
  todoId: number;
}
interface FetchTodoProps {
  todoId: number;
  setTodo: React.Dispatch<SetStateAction<Todo | null>>;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  setError: React.Dispatch<SetStateAction<string | null>>;
}

const fetchTodo = async ({ todoId, setTodo, setLoading, setError }: FetchTodoProps) => {
  try {
    setLoading(true);
    const response = await fetch(`${API_URL}/${todoId}`);

    const post = (await response.json()) as Todo;
    if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

    setTodo(post);
  } catch (e) {
    setError((e as Error).message);
  } finally {
    setLoading(false);
  }
};

/**
 * TodoDetail component fetches and displays the details of a specific todo item based on the provided todoId.
 * It uses the useEffect hook to fetch the todo details from the API when the component mounts or when the todoId changes.
 * @param todoId - The ID of the todo item to fetch and display.
 */
export const TodoDetail: React.FC<TodoDetailProps> = ({ todoId }: TodoDetailProps) => {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const todoProps = {
      todoId,
      setTodo,
      setLoading,
      setError,
    };

    fetchTodo(todoProps);
  }, [todoId]);

  return (
    <div className="todo-detail">
      <h2>Todo Details</h2>
      {loading ? (
        <p>Loading todo</p>
      ) : (
        <>
          {error ? (
            <p>Error loading todo</p>
          ) : (
            <div>
              <h3>{todo?.title ?? 'Null Title'}</h3>
              <h3>{todo?.completed ? 'Completed' : 'Incomplete'}</h3>
            </div>
          )}
        </>
      )}
    </div>
  );
};

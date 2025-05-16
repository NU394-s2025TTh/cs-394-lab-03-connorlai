import { Todo } from '../types/todo-type';

export const TodoTile = (todo: Todo, onSelectTodo: (id: number) => void) => {
  return (
    <div key={todo.id}>
      <button className="todo-button" onClick={() => onSelectTodo(todo.id)}>
        <h3>{todo.title}</h3>
        <p>Completed: {String(todo.completed)}</p>
      </button>
    </div>
  );
};

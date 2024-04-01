import React, { useState, KeyboardEvent } from "react";
import { v4 as uuidv4 } from "uuid";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { KeyboardEventOnInputField } from "./types";

enum Status {
  active,
  completed,
}

interface Todo {
  id: string;
  title: string;
  status: Status;
}

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: uuidv4(), title: "Taste JavaScript", status: Status.active },
    { id: uuidv4(), title: "Buy a unicorn", status: Status.completed },
  ]);
  const [todo, setTodo] = useState<string>("");
  const [toggle, setToggle] = useState<Status | null>(null);

  console.log(todos);

  const handleKeyDown = (e: KeyboardEventOnInputField) => {
    if (e.key === "Enter") {
      const value = e.target.value.trim();

      if (value.length < 2) return;

      setTodos([
        ...todos,
        { id: uuidv4(), title: todo, status: Status.active },
      ]);
      setTodo("");
    }
  };
  const changeStatus = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              status:
                todo.status === Status.completed
                  ? Status.active
                  : Status.completed,
            }
          : todo
      )
    );
  };
  const toggleAll = () => {
    const newStatus =
      toggle === Status.completed ? Status.active : Status.completed;
    setToggle(newStatus);

    setTodos(
      todos.map((todo) => ({
        ...todo,
        status: newStatus,
      }))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => todo.status === Status.active));
  };

  const selectAll = () => {
    setTodos(todos);
  };

  const selectActive = () => {
    setTodos(todos.filter((todo) => todo.status === Status.active));
  };
  const selectCompleted = () => {
    setTodos(todos.filter((todo) => todo.status === Status.completed));
  };

  return (
    <>
      <section className="todoapp">
        <Header
          handleKeyDown={handleKeyDown}
          todoInputOnChange={(e) => setTodo(e.target.value)}
          todoInputValue={todo}
        />
        {/* This section should be hidden by default and shown when there are todos  */}
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            checked={toggle === Status.completed}
            onChange={() => toggleAll()}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {/* These are here just to show the structure of the list items 
         List items should get the className `editing` when editing and `completed` when marked as completed  */}
            {todos.map((todo) => (
              <li className={todo.status.toString()}>
                <div className="view">
                  <input
                    className="toggle"
                    type="checkbox"
                    checked={todo.status === Status.completed}
                    onChange={() => changeStatus(todo.id)}
                  />
                  <label
                    style={{
                      textDecoration:
                        todo.status === Status.completed
                          ? "line-through"
                          : "none",
                    }}
                  >
                    {todo.title}
                  </label>
                  <button
                    className="destroy"
                    onClick={() => deleteTodo(todo.id)}
                  ></button>
                </div>
                <input className="edit" value="Create a TodoMVC template" />
              </li>
            ))}
          </ul>
        </section>
        {/* This footer should be hidden by default and shown when there are todos */}
        <footer className="footer">
          {/* This should be `0 items left` by default */}
          <span className="todo-count">
            <strong>
              {todos.filter((todo) => todo.status === Status.active).length}
            </strong>{" "}
            item left
          </span>
          {/* Remove this if you don't implement routing  */}
          <ul className="filters">
            <li>
              <a className="selected" href="#/" onClick={() => selectAll()}>
                All
              </a>
            </li>
            <li>
              <a href="#/active" onClick={() => selectActive()}>
                Active
              </a>
            </li>
            <li>
              <a href="#/completed" onClick={() => selectCompleted()}>
                Completed
              </a>
            </li>
          </ul>
          {/* Hidden if no completed items are left ↓ */}
          {!!todos.filter((todo) => todo.status === Status.completed)
            .length && (
            <button
              className="clear-completed"
              onClick={() => clearCompleted()}
            >
              Clear completed
            </button>
          )}
        </footer>
      </section>
      <Footer />
    </>
  );
};

export default App;

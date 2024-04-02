import React, { useState, useCallback, useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { KeyboardEventOnInputField } from "./types";
import { useOutsideClick } from "./utils/useOutsideClick";

enum Status {
  active,
  completed,
}

enum Tabs {
  active,
  completed,
  all,
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

  const [tab, setTab] = useState<Tabs>(Tabs.all);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState<string>("");
  const veiwRef = useRef(null);

  useOutsideClick(veiwRef, () => {
    edit();
  });

  const edit = () => {
    setTodos(todos.map((todo) => (todo.id === editTodo?.id ? editTodo : todo)));
    setEditTodo(null);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEventOnInputField) => {
      if (e.key === "Enter") {
        const value = e.target.value.trim();

        if (value.length < 2) return;

        setTodos([
          ...todos,
          { id: uuidv4(), title: todo, status: Status.active },
        ]);
        setTodo("");
      }
    },
    [todos, todo]
  );

  const changeStatus = useCallback(
    (id: string) => {
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
    },
    [todos]
  );

  const toggleAll = useCallback(() => {
    const newStatus =
      toggle === Status.completed ? Status.active : Status.completed;
    setToggle(newStatus);

    setTodos(
      todos.map((todo) => ({
        ...todo,
        status: newStatus,
      }))
    );
  }, [toggle, todos]);

  const deleteTodo = useCallback(
    (id: string) => {
      setTodos(todos.filter((todo) => todo.id !== id));
    },
    [todos]
  );

  const clearCompleted = useCallback(() => {
    setTodos(todos.filter((todo) => todo.status === Status.active));
  }, [todos]);

  const visibleTodos = useMemo(
    () =>
      todos.filter(
        (todo) =>
          todo.status ===
          (tab === Tabs.active
            ? Status.active
            : tab === Tabs.completed
            ? Status.completed
            : todo.status)
      ),
    [todos, tab]
  );

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
          <ul
            className="todo-list"
            // ref={veiwRef}
          >
            {/* These are here just to show the structure of the list items 
         List items should get the className `editing` when editing and `completed` when marked as completed  */}

            {visibleTodos.map((todo) => (
              <li
                {...(todo.status === Status.completed && {
                  className: "completed",
                })}
                {...(editTodo?.id === todo.id && {
                  className: "editing",
                  ref: veiwRef,
                })}
              >
                <div className="view" onDoubleClick={() => setEditTodo(todo)}>
                  <input
                    className="toggle"
                    type="checkbox"
                    checked={todo.status === Status.completed}
                    onChange={() => changeStatus(todo.id)}
                  />
                  <label>{todo.title}</label>
                  <button
                    className="destroy"
                    onClick={() => deleteTodo(todo.id)}
                  ></button>
                </div>
                <input
                  className="edit"
                  value={editTodo?.title}
                  onChange={(e) => {
                    setEditTodo({ ...editTodo, title: e.target.value } as Todo);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && edit()}
                />
              </li>
            ))}
          </ul>
        </section>
        {/* This footer should be hidden by default and shown when there are todos */}
        {!!todos.length && (
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
                <a
                  className="selected"
                  href="#/"
                  onClick={() => {
                    setTab(Tabs.all);
                  }}
                >
                  All
                </a>
              </li>
              <li>
                <a
                  href="#/active"
                  onClick={() => {
                    setTab(Tabs.active);
                  }}
                >
                  Active
                </a>
              </li>
              <li>
                <a
                  href="#/completed"
                  onClick={() => {
                    setTab(Tabs.completed);
                  }}
                >
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
        )}
      </section>
      <Footer />
    </>
  );
};

export default App;

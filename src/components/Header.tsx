import { FC, ChangeEventHandler } from "react";
import { KeyboardEventOnInputField } from "../types";

interface Props {
  handleKeyDown: (e: KeyboardEventOnInputField) => void;
  todoInputOnChange: ChangeEventHandler<HTMLInputElement>;
  todoInputValue: string;
}

const Header: FC<Props> = ({
  handleKeyDown,
  todoInputValue,
  todoInputOnChange,
}) => {
  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          autoFocus
          // @ts-ignore
          onKeyDown={handleKeyDown}
          value={todoInputValue}
          onChange={todoInputOnChange}
        />
      </header>
    </div>
  );
};

export default Header;

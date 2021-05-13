import Styled from "./tasks.module.scss";
import addSvg from "../../assets/img/add.svg";
import { useState } from "react";
import axios from "axios";

const AddTaskForm = ({ list, onAddTask }) => {
  const [visibleForm, setVisibleForm] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleVisibleForm = () => {
    setVisibleForm(!visibleForm);
    setInputValue("");
  };

  const addTask = () => {
    if (!inputValue) {
      alert("Необходимо заполнить поле!");
      return;
    }
    setIsLoading(true);
    const obj = {
      listId: list.id,
      text: inputValue,
      completed: false,
    };
    axios
      .post(`http://localhost:3001/tasks`, obj)
      .then(({ data }) => {
        onAddTask(list.id, data);
      })
      .catch(() => {
        alert("Ошибка добавления");
      })
      .finally(() => {
        toggleVisibleForm();
        setIsLoading(false);
      });
  };

  return (
    <div className={Styled.tasks__form}>
      {!visibleForm ? (
        <div onClick={toggleVisibleForm} className={Styled.tasks__form_new}>
          <img src={addSvg} alt="" />
          <span>Новая задача</span>
        </div>
      ) : (
        <div className={Styled.tasks__form_block}>
          <input
            value={inputValue}
            type="text"
            className="field"
            placeholder="Текст задачи"
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button disabled={isLoading} onClick={addTask} className="button">
            {isLoading ? "Происходит добавление задачи" : "Добавить задачу"}
          </button>
          <button onClick={toggleVisibleForm} className="button button-cancel">
            Отмена
          </button>
        </div>
      )}
    </div>
  );
};

export default AddTaskForm;

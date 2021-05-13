import React, { useState } from "react";
import List from "../List";
import Badge from "../Badge";

import addSvg from "../../assets/img/add.svg";
import "./addButtonList.scss";
import axios from "axios";

const AddButtonList = ({ colors, onAdd }) => {
  const [visiblePopup, setVisiblePopup] = React.useState(false);
  const [selectedColor, setSelectedColor] = React.useState(3);
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addList = () => {
    if (!inputValue) {
      alert("Введите название списка");
      return;
    }
    setIsLoading(true);
    axios
      .post("http://localhost:3001/lists", {
        name: inputValue,
        colorId: selectedColor,
      })
      .then(({ data }) => {
        const color = colors.filter((c) => c.id === selectedColor)[0];
        const listObj = {
          ...data,
          color: { name: color.name, hex: color.hex, tasks: [] },
        };
        onAdd(listObj);
      })
      .finally(() => {
        setInputValue("");
        setSelectedColor(colors[0].id);
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    if (!colors) {
      return;
    }
    setSelectedColor(colors[0].id);
  }, [colors]);

  return (
    <div className="add-list">
      <List
        onClick={() => setVisiblePopup(!visiblePopup)}
        items={[
          {
            icon: <img src={addSvg} alt="" />,
            name: "Добавить список",
          },
        ]}
      />
      {visiblePopup && (
        <div className="add-list__popup">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="field"
            type="text"
            placeholder="Название папки"
          />
          <div className="add-list__popup-colors">
            <ul>
              {colors.map((color) => (
                <li key={color.id}>
                  <Badge
                    className={selectedColor === color.id && "active"}
                    onClick={() => setSelectedColor(color.id)}
                    color={color.name}
                  />
                </li>
              ))}
            </ul>
          </div>
          <button onClick={addList} className="button">
            {isLoading ? "Идет добавление..." : "Добавить"}
          </button>
        </div>
      )}
    </div>
  );
};
export default AddButtonList;

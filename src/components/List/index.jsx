import classNames from "classnames";
import Badge from "../Badge";

import removeSvg from "../../assets/img/remove.svg";
import "./list.scss";
import axios from "axios";

const List = ({
  items,
  onClick,
  isRemovable,
  onRemove,
  onClickItem,
  activeItem,
}) => {
  const removeList = (item) => {
    if (window.confirm("Вы подтверждаете удаление ?")) {
      axios.delete(`http://localhost:3001/lists/${item.id}`).then(() => {
        onRemove(item.id);
      });
    }
  };
  return (
    <ul className="todo__list" onClick={onClick}>
      {items.map((item, idx) => (
        <li
          onClick={onClickItem ? () => onClickItem(item) : null}
          key={idx}
          className={classNames({
            active: activeItem && activeItem.id === item.id 
          })}
        >
          <i> {item.icon ? item.icon : <Badge color={item.color.name} />} </i>
          <span>
            {item.name} {item.tasks && ` (${item.tasks.length})`}
          </span>
          {isRemovable && (
            <img
              onClick={() => removeList(item)}
              className="todo__list-removeicon"
              src={removeSvg}
              alt=""
            />
          )}
        </li>
      ))}
    </ul>
  );
};
export default List;

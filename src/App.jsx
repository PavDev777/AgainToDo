import React from "react";
import List from "./components/List";
import AddButtonList from "./components/AddButtonList";
import Tasks from "./components/Tasks";
import axios from "axios";
import { useHistory, Route, useLocation } from "react-router-dom";

import Styled from "./App.module.scss";
import listSvg from "./assets/img/list.svg";

function App() {
  const [lists, setLists] = React.useState(null);
  const [colors, setColors] = React.useState(null);
  const [activeItem, setActiveItem] = React.useState(null);
  let history = useHistory();
  const location = useLocation();

  const onAddLists = (obj) => {
    const newLists = [...lists, obj];
    setLists(newLists);
  };

  const onAddTask = (listId, taskObj) => {
    const newLists = lists.map((item) => {
      if (item.id === listId) {
        item.tasks = [...item.tasks, taskObj];
      }
      return item;
    });
    setLists(newLists);
  };

  React.useEffect(() => {
    axios
      .get("http://localhost:3001/lists?_expand=color&_embed=tasks")
      .then(({ data }) => {
        setLists(data);
      });
    axios.get("http://localhost:3001/colors").then(({ data }) => {
      setColors(data);
    });
  }, []);

  const onRemove = (id) => {
    const newLists = lists.filter((item) => item.id !== id);
    setLists(newLists);
  };

  const onRemoveTask = (listId, taskId) => {
    if (window.confirm("Вы действительно хотите удалить задачу?")) {
      const newLists = lists.map((list) => {
        if (list.id === listId) {
          list.tasks = list.tasks.filter((task) => task.id !== taskId);
        }
        return list;
      });
      setLists(newLists);
      axios.delete(`http://localhost:3001/tasks/${taskId}`).catch(() => {
        alert("Не удалось удалить задачу");
      });
    }
  };

  const onCompleteTask = (listId, taskId, completed) => {
    const newLists = lists.map((list) => {
      if (list.id === listId) {
        list.tasks = list.tasks.map((task) => {
          if (task.id === taskId) { 
            task.completed = completed
          }
          return task 
        })
      }
      return list
    })
    setLists(newLists)
    axios.patch(`http://localhost:3001/tasks/${taskId}`, {completed})
  }

  const onEditTitle = (id, title) => {
    const newLists = lists.map((item) => {
      if (item.id === id) {
        item.name = title;
      }
      return item;
    });
    setLists(newLists);
  };

  const editTask = (listId, obj) => {
    const newLists = lists.map((list) => {
      if (list.id === listId) {
        list.tasks = list.tasks.map((task) => {
          if (task.id === obj.id) { 
            task.text = obj.text
          }
          return task 
        })
      }
      return list
    })
    setLists(newLists)
  }

  React.useEffect(() => {
    const listId = location.pathname.split("/")[2];
    const activeId = lists && lists.find((list) => list.id === Number(listId));
    setActiveItem(activeId);
  }, [location.pathname, lists]);

  return (
    <div className={Styled.todo}>
      <div className={Styled.todo__sidebar}>
        <List
          onClickItem={(list) => {
            history.push(`/`);
          }}
          items={[
            {
              icon: <img src={listSvg} alt="" />,
              name: "Все задачи",
              active: location.pathname === '/'
            },
          ]}
        />

        {lists ? (
          <List
            items={lists}
            isRemovable
            onRemove={onRemove}
            onClickItem={(item) => {
              history.push(`/lists/${item.id}`);
            }}
            activeItem={activeItem}
          />
        ) : (
          "Loading..."
        )}
        <AddButtonList onAdd={onAddLists} colors={colors} />
      </div>

      <div className={Styled.todo__tasks}>
        <Route path="/" exact>
          {lists &&
            lists.map((list) => (
              <Tasks
                key={list.id}
                list={list}
                onEditTitle={onEditTitle}
                onAddTask={onAddTask}
                onRemoveTask={onRemoveTask}
                onCompleteTask={onCompleteTask}
              />
            ))}
        </Route>

        <Route path="/lists/:id">
          {lists && activeItem && (
            <Tasks
              list={activeItem}
              onEditTitle={onEditTitle}
              onAddTask={onAddTask}
              onRemoveTask={onRemoveTask}
              editTask={editTask}
              onCompleteTask={onCompleteTask}
            />
          )}
        </Route>
      </div>
    </div>
  );
}

export default App;

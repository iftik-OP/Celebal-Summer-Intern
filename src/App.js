import "./App.css";
import { useState } from "react";

const getLocalItems = () => {
  let list = localStorage.getItem("todos");

  if (list) {
    return JSON.parse(localStorage.getItem("todos"));
  } else {
    return [];
  }
};

const getCompletedItems = () => {
  let completed = localStorage.getItem("completed");
  if (completed) {
    return JSON.parse(localStorage.getItem("completed"));
  } else {
    return [];
  }
};

function App() {
  const [value, setValue] = useState("");
  const [todos, setTodos] = useState(getLocalItems());
  const [completed, setCompleted] = useState(getCompletedItems());
  const [filter1, setFilter1] = useState(true);
  const [filter2, setFilter2] = useState(true);

  const handleFilters = (e) => {
    //check if the div clicked is the completed filter or the pending filter
    if (e.target.classList.contains("complete-filter")) {
      setFilter1(!filter1);
    } else {
      setFilter2(!filter2);
    }
  };
  const addTodo = (todo) => {
    const newTodos = [...todos, todo];
    setTodos(newTodos);
    //set ites to local storage
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value) {
      addTodo(value);
    }
    setValue("");
  };

  //remove task from the list and local storage
  const removeTask = (e) => {
    const task = e.target.parentElement;
    const newTodos = todos.filter(
      (todo) => todo !== task.querySelector(".todo-text").innerText
    );
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const removeCompleted = (e) => {
    const task = e.target.parentElement;
    const newCompleted = completed.filter(
      (todo) => todo !== task.querySelector(".completed").innerText
    );
    setCompleted(newCompleted);
    localStorage.setItem("completed", JSON.stringify(newCompleted));
  };

  const taskCompleted = (e) => {
    e.preventDefault();
    const task = e.target;
    if (task.classList.contains("todo-text")) {
      //remove task from todos and add to completed
      setCompleted([...completed, task.innerText]);
      localStorage.setItem("completed", JSON.stringify(completed));
      removeTask(e);
    } else {
      //remove task from completed and add to todos
      addTodo(task.innerText);
      const newCompleted = completed.filter((todo) => todo !== task.innerText);
      setCompleted(newCompleted);
      localStorage.setItem("completed", JSON.stringify(newCompleted));
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>To Do App</h1>
        <form type="submit" className="searchBox" onSubmit={handleSubmit}>
          <input
            value={value}
            placeholder="Enter a task"
            type="text"
            name="todo"
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
          <button className="add-btn" type="submit">
            Add Task
          </button>
        </form>
        {/* add filter to show only completed tasks or only pending tasks */}
        <div className="filters">
          <p className="filter-title">Filters:</p>
          <div
            className="complete-filter"
            style={{ backgroundColor: filter1 ? "green" : "initial" }}
            onClick={handleFilters}
          >
            Completed{" "}
          </div>
          <div
            className="pending-filter"
            style={{ backgroundColor: filter2 ? "red" : "initial" }}
            onClick={handleFilters}
          >
            {" "}
            Pending
          </div>
        </div>
        <div className="todo-box">
          <p className="box-title">What we have on the list!</p>
          {/* //check if filter2 is true, then only render the pending tasks */}

          {filter2 &&
            todos.map((todo, index) => {
              return (
                <div key={index} className="todo">
                  <p className="todo-text" onClick={taskCompleted}>
                    {todo}
                  </p>
                  <p className="remove" onClick={removeTask}>
                    Remove
                  </p>
                </div>
              );
            })}
          {filter1 && completed.length > 0 && (
            <p className="completed-title">Completed Tasks</p>
          )}
          {filter1 &&
            completed.map((todo, index) => {
              return (
                <div key={index} className="todo">
                  <p className="completed" onClick={taskCompleted}>
                    {todo}
                  </p>
                  <p className="remove" onClick={removeCompleted}>
                    Remove
                  </p>
                </div>
              );
            })}
          <p className="box-title">
            1. Enter any task and press 'Add Task'<br></br>2. Click on text to
            toggle task. <br></br>3. Click on Remove to remove the task from the
            list and local storage
          </p>
          <p></p>
        </div>
      </header>
    </div>
  );
}

export default App;

import React from "react";
import "./App.css";

export const todos = ({ task }) => {
  return (
    <div className="todo">
      <p>{task}</p>
      <button>Remove</button>
    </div>
  );
};

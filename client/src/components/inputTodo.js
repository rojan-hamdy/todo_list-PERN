import React, { useState } from "react";
import { useToast } from "../context/ToastContext";

const InputTodo = ({ onAddTodo }) => {
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError, showWarning } = useToast();

  const onSubmitForm = async (e) => {
    e.preventDefault();
    const trimmed = description.trim();
    if (!trimmed) {
      showWarning("Please enter a task description!");
      return;
    }

    setIsSubmitting(true);
    try {
      const body = { description: trimmed };
      const response = await fetch("http://localhost:5000/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Failed to create todo");
      }

      const newTodo = await response.json();
      setDescription("");
      showSuccess("Task added successfully!");
      if (onAddTodo) {
        onAddTodo(newTodo);
      }
    } catch (err) {
      console.error(err.message);
      showError("Could not save task. Check server connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="input-todo-card">
      <form className="input-todo-form" onSubmit={onSubmitForm}>
        <div className="input-group-custom">
          <input
            type="text"
            className="todo-text-input"
            placeholder="What needs to be done today?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
          />
          <button className="add-todo-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="btn-spinner"></span>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Add Task</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputTodo;
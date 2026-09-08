import React, { useState } from "react";
import { useToast } from "../context/ToastContext";

const EditTodo = ({ todo, onUpdateTodo }) => {
  const [description, setDescription] = useState(todo.description);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError, showWarning } = useToast();

  const updateDescription = async (e) => {
    e.preventDefault();
    const trimmed = description.trim();
    if (!trimmed) {
      showWarning("Task description cannot be empty!");
      return;
    }

    setIsSubmitting(true);
    try {
      const body = { description: trimmed };
      const response = await fetch(`http://localhost:5000/todos/${todo.todo_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      showSuccess("Task updated successfully!");
      if (onUpdateTodo) {
        onUpdateTodo(todo.todo_id, trimmed);
      }

      // Close modal using bootstrap jQuery API if available
      if (window.$) {
        window.$(`#id${todo.todo_id}`).modal('hide');
      }
    } catch (err) {
      console.error(err.message);
      showError("Failed to update task. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="action-btn edit-btn"
        data-toggle="modal"
        data-target={`#id${todo.todo_id}`}
        title="Edit Task"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
        <span>Edit</span>
      </button>

      <div className="modal fade" id={`id${todo.todo_id}`} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content custom-modal-content">
            <div className="modal-header custom-modal-header">
              <h5 className="modal-title font-weight-bold">Edit Task</h5>
              <button
                type="button"
                className="close text-muted"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => setDescription(todo.description)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <form onSubmit={updateDescription}>
              <div className="modal-body custom-modal-body">
                <label className="form-label font-weight-bold mb-2">Description</label>
                <input
                  type="text"
                  className="form-control custom-modal-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="modal-footer custom-modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary text-capitalize"
                  data-dismiss="modal"
                  onClick={() => setDescription(todo.description)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary custom-save-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditTodo;
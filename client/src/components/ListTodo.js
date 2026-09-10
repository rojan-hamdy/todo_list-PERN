import React from 'react';
import EditTodo from './EditTodo';
import { useToast } from '../context/ToastContext';

const ListTodo = ({
  todos,
  loading,
  onDeleteTodo,
  onToggleComplete,
  onUpdateTodo,
  filterStatus,
  searchTerm,
  setSearchTerm,
  setFilterStatus
}) => {
  const { showSuccess, showError } = useToast();

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      showSuccess("Task deleted successfully!");
      if (onDeleteTodo) {
        onDeleteTodo(id);
      }
    } catch (err) {
      console.error(err.message);
      showError("Could not delete task. Please try again.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-state-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading your tasks...</p>
      </div>
    );
  }

  // Empty state when no tasks exist at all
  if (todos.length === 0 && !searchTerm && filterStatus === 'all') {
    return (
      <div className="empty-state-container">
        <div className="empty-state-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 11l3 3L22 4"></path>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
          </svg>
        </div>
        <h3 className="empty-state-title">All caught up!</h3>
        <p className="empty-state-subtitle">You have no pending tasks. Add a task above to get started.</p>
      </div>
    );
  }

  // Empty state when search or filter returns zero matches
  if (todos.length === 0) {
    return (
      <div className="empty-state-container">
        <div className="empty-state-icon text-muted">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </div>
        <h4 className="empty-state-title">No matching tasks found</h4>
        <p className="empty-state-subtitle">
          No tasks matched your search "{searchTerm}" or filter "{filterStatus}".
        </p>
        <button
          className="btn btn-outline-primary btn-sm mt-2"
          onClick={() => {
            setSearchTerm('');
            setFilterStatus('all');
          }}
        >
          Reset Filters & Search
        </button>
      </div>
    );
  }

  return (
    <div className="todo-list-wrapper">
      <div className="todo-cards-container">
        {todos.map((todo) => {
          const isDone = Boolean(todo.is_completed);

          return (
            <div key={todo.todo_id} className={`todo-card ${isDone ? 'completed' : ''}`}>
              <div className="todo-card-left">
                {/* Custom Checkbox */}
                <label className="custom-checkbox-container" title={isDone ? "Mark as Active" : "Mark as Completed"}>
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => onToggleComplete(todo.todo_id)}
                  />
                  <span className="checkmark">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                </label>

                {/* Todo Description */}
                <div className="todo-text-wrapper">
                  <span className={`todo-description ${isDone ? 'completed-text' : ''}`}>
                    {todo.description}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="todo-card-actions">
                <EditTodo todo={todo} onUpdateTodo={onUpdateTodo} />

                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(todo.todo_id)}
                  title="Delete Task"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListTodo;
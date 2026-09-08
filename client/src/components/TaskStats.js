import React from 'react';

const TaskStats = ({ totalTasks, activeTasks, completedTasks }) => {
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="task-stats-card">
      <div className="stats-header">
        <div className="stats-info">
          <span className="stats-title">Progress Metrics</span>
          <span className="stats-count">
            {completedTasks} of {totalTasks} tasks completed
          </span>
        </div>
        <div className="stats-percentage-badge">
          {percentage}% Complete
        </div>
      </div>

      <div className="progress-bar-track">
        <div 
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="stats-chips">
        <div className="chip chip-total">
          <span className="chip-dot"></span>
          <span>Total: <strong>{totalTasks}</strong></span>
        </div>
        <div className="chip chip-active">
          <span className="chip-dot"></span>
          <span>Pending: <strong>{activeTasks}</strong></span>
        </div>
        <div className="chip chip-completed">
          <span className="chip-dot"></span>
          <span>Completed: <strong>{completedTasks}</strong></span>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;

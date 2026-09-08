import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './App.css';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';
import Header from './components/Header';
import TaskStats from './components/TaskStats';
import InputTodo from './components/inputTodo';
import SearchFilter from './components/SearchFilter';
import ListTodo from './components/ListTodo';

const MainApp = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'completed'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'alpha'
  const { showError, showInfo } = useToast();

  // Load local completed states map from localStorage
  const [completedMap, setCompletedMap] = useState(() => {
    try {
      const saved = localStorage.getItem('pern_todo_completed_map');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save completed states map to localStorage
  useEffect(() => {
    localStorage.setItem('pern_todo_completed_map', JSON.stringify(completedMap));
  }, [completedMap]);

  // Fetch todos from server API
  const getTodos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/todos");
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      console.error(err.message);
      showError("Backend server offline. Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    getTodos();
  }, [getTodos]);

  // Add todo handler (optimistic state update)
  const handleAddTodo = (newTodo) => {
    setTodos((prev) => [newTodo, ...prev]);
  };

  // Delete todo handler
  const handleDeleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.todo_id !== id));
    setCompletedMap((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  // Update todo description handler
  const handleUpdateTodo = (id, newDescription) => {
    setTodos((prev) =>
      prev.map((t) => (t.todo_id === id ? { ...t, description: newDescription } : t))
    );
  };

  // Toggle todo completion handler
  const handleToggleComplete = (id) => {
    setCompletedMap((prev) => {
      const isCurrentlyCompleted = Boolean(prev[id]);
      const nextState = !isCurrentlyCompleted;
      if (nextState) {
        showInfo("Task marked as completed!");
      } else {
        showInfo("Task marked as active.");
      }
      return { ...prev, [id]: nextState };
    });
  };

  // Map todos with completion status from completedMap (or server is_completed property if present)
  const enrichedTodos = useMemo(() => {
    return todos.map((todo) => ({
      ...todo,
      is_completed: todo.is_completed !== undefined ? todo.is_completed : Boolean(completedMap[todo.todo_id])
    }));
  }, [todos, completedMap]);

  // Calculate task statistics
  const stats = useMemo(() => {
    const total = enrichedTodos.length;
    const completed = enrichedTodos.filter((t) => t.is_completed).length;
    const active = total - completed;
    return { total, active, completed };
  }, [enrichedTodos]);

  // Filter and sort todos
  const processedTodos = useMemo(() => {
    let result = [...enrichedTodos];

    // Filter by search keyword
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((t) => t.description.toLowerCase().includes(term));
    }

    // Filter by status (All, Active, Completed)
    if (filterStatus === 'active') {
      result = result.filter((t) => !t.is_completed);
    } else if (filterStatus === 'completed') {
      result = result.filter((t) => t.is_completed);
    }

    // Sort todos
    if (sortBy === 'newest') {
      result.sort((a, b) => b.todo_id - a.todo_id);
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => a.todo_id - b.todo_id);
    } else if (sortBy === 'alpha') {
      result.sort((a, b) => a.description.localeCompare(b.description));
    }

    return result;
  }, [enrichedTodos, searchTerm, filterStatus, sortBy]);

  return (
    <div className="app-layout">
      <div className="app-container">
        <Header />

        <main className="app-main-content">
          <TaskStats
            totalTasks={stats.total}
            activeTasks={stats.active}
            completedTasks={stats.completed}
          />

          <InputTodo onAddTodo={handleAddTodo} />

          <SearchFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            sortBy={sortBy}
            setSortBy={setSortBy}
            counts={{ all: stats.total, active: stats.active, completed: stats.completed }}
          />

          <ListTodo
            todos={processedTodos}
            loading={loading}
            onDeleteTodo={handleDeleteTodo}
            onToggleComplete={handleToggleComplete}
            onUpdateTodo={handleUpdateTodo}
            filterStatus={filterStatus}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setFilterStatus={setFilterStatus}
          />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <MainApp />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

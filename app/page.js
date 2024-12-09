"use client";

import React, { useState, useEffect } from "react";

// Hardcoded login credentials
const validUser = { username: "user", password: "password" };

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");  // Ensure empty string initialization
  const [completedTasks, setCompletedTasks] = useState(0);
  const [user, setUser] = useState(null);
  const [dueDate, setDueDate] = useState("");    // Ensure empty string initialization
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);     // Error state for invalid login

  // Handle adding a new task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (taskName !== "") {
      const newTask = { name: taskName, isCompleted: false, dueDate };
      setTasks([...tasks, newTask]);
      setTaskName(""); // Reset taskName
      setDueDate("");  // Reset dueDate
    }
  };

  // Handle task completion
  const toggleTaskCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].isCompleted = !updatedTasks[index].isCompleted;
    setTasks(updatedTasks);

    // Update completed tasks count
    const newCompletedCount = updatedTasks.filter(task => task.isCompleted).length;
    setCompletedTasks(newCompletedCount);
  };

  // Calculate task progress percentage based on dates
  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    if (username === validUser.username && password === validUser.password) {
      localStorage.setItem("isLoggedIn", true); // Store login status in localStorage
      setIsLoggedIn(true);
      setError(null); // Clear any error if login is successful
    } else {
      setError("Invalid credentials. Please try again."); // Set error message
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  // Check if the user is logged in
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    if (loggedInStatus) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white flex-col items-center justify-start p-6">
      {/* If not logged in, show login page */}
      {!isLoggedIn ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <h1 className="text-2xl font-bold mb-6">Login</h1>
          {/* Show error message if login fails */}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleLogin} className="mb-6 flex flex-col space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="p-2 rounded w-60 text-black"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="p-2 rounded w-60 text-black"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400"
            >
              Login
            </button>
          </form>
        </div>
      ) : (
        <div className="w-full">
          {/* Header */}
          <h1 className="text-2xl font-bold mb-6">Task Manager</h1>

          {/* Add Task Form */}
          <form onSubmit={handleAddTask} className="mb-6 flex space-x-4">
            <input
              type="text"
              className="border-2 border-gray-400 p-2 rounded w-60 text-black"
              placeholder="Enter your task"
              value={taskName} // Controlled input
              onChange={(e) => setTaskName(e.target.value)}
            />
            <input
              type="date"
              className="border-2 border-gray-400 p-2 rounded w-60 text-black"
              value={dueDate} // Controlled input
              onChange={(e) => setDueDate(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400"
            >
              Add Task
            </button>
          </form>

          {/* Task Progress Meter */}
          <div className="w-60 mb-6">
            <h2 className="font-bold text-lg">Progress</h2>
            <div className="h-2 bg-gray-600 rounded-full">
              <div
                className="h-2 bg-green-500 rounded-full"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
            <p className="text-center text-sm mt-2">{calculateProgress()}% Completed</p>
          </div>

          {/* Task List */}
          <div className="w-60">
            {tasks.length === 0 ? (
              <p className="text-center text-gray-400">No tasks added</p>
            ) : (
              <ul className="space-y-2">
                {tasks.map((task, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-700 p-2 rounded-lg"
                  >
                    <span className={task.isCompleted ? "line-through text-gray-400" : ""}>
                      {task.name} (Due: {task.dueDate})
                    </span>
                    <button
                      onClick={() => toggleTaskCompletion(index)}
                      className={`py-1 px-3 rounded ${task.isCompleted ? 'bg-red-500' : 'bg-green-500'} text-white`}
                    >
                      {task.isCompleted ? 'Undo' : 'Complete'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-6 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-400"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default App;

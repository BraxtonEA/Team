import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Settings, ChevronLeft, List, FolderOpen, Check, Clock, AlertCircle } from 'lucide-react';

const TaskFlowApp = () => {
  const [currentView, setCurrentView] = useState('menu');
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Complete project proposal', projectId: 1, priority: 'High', status: 'In Progress', dueDate: '2024-10-28', description: 'Finish the Q4 proposal' },
    { id: 2, name: 'Review team feedback', projectId: 1, priority: 'Medium', status: 'Pending', dueDate: '2024-10-26', description: 'Go through all feedback' },
    { id: 3, name: 'Update documentation', projectId: 2, priority: 'Low', status: 'Pending', dueDate: '2024-10-30', description: 'Update API docs' }
  ]);
  const [projects, setProjects] = useState([
    { id: 1, name: 'Q4 Planning', progress: 65, startDate: '2024-10-01', endDate: '2024-12-31' },
    { id: 2, name: 'Website Redesign', progress: 30, startDate: '2024-10-15', endDate: '2024-11-30' }
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date(2014, 9, 24));
  const [darkMode, setDarkMode] = useState(true);
  const [textSize, setTextSize] = useState('medium');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newTask, setNewTask] = useState({ name: '', priority: 'Medium', dueDate: '', projectId: null });
  const [newProject, setNewProject] = useState({ name: '', startDate: '', endDate: '' });

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    
    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }
    return days;
  };

  const addTask = () => {
    if (newTask.name.trim()) {
      setTasks([...tasks, { 
        id: tasks.length + 1, 
        ...newTask, 
        status: 'Pending',
        description: ''
      }]);
      setNewTask({ name: '', priority: 'Medium', dueDate: '', projectId: null });
      setShowTaskForm(false);
    }
  };

  const addProject = () => {
    if (newProject.name.trim()) {
      setProjects([...projects, { 
        id: projects.length + 1, 
        ...newProject, 
        progress: 0
      }]);
      setNewProject({ name: '', startDate: '', endDate: '' });
      setShowProjectForm(false);
    }
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'Completed' ? 'Pending' : 'Completed' }
        : task
    ));
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const MainMenu = () => (
    <div className="flex flex-col gap-4 p-8">
      <h1 className={`${textSizes[textSize]} text-2xl font-bold text-white mb-6`}>TaskFlow</h1>
      <button onClick={() => setCurrentView('tasks')} className="w-full bg-gray-800 hover:bg-gray-700 text-white py-4 px-6 rounded-lg border border-gray-700 transition-colors flex items-center gap-3">
        <List size={20} />
        <span className={textSizes[textSize]}>Tasks</span>
      </button>
      <button onClick={() => setCurrentView('projects')} className="w-full bg-gray-800 hover:bg-gray-700 text-white py-4 px-6 rounded-lg border border-gray-700 transition-colors flex items-center gap-3">
        <FolderOpen size={20} />
        <span className={textSizes[textSize]}>Projects</span>
      </button>
      <button onClick={() => setCurrentView('calendar')} className="w-full bg-gray-800 hover:bg-gray-700 text-white py-4 px-6 rounded-lg border border-gray-700 transition-colors flex items-center gap-3">
        <Calendar size={20} />
        <span className={textSizes[textSize]}>Calendar</span>
      </button>
      <button onClick={() => setCurrentView('settings')} className="w-full bg-gray-800 hover:bg-gray-700 text-white py-4 px-6 rounded-lg border border-gray-700 transition-colors flex items-center gap-3">
        <Settings size={20} />
        <span className={textSizes[textSize]}>Settings</span>
      </button>
    </div>
  );

  const TasksView = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentView('menu')} className="text-gray-400 hover:text-white">
            <ChevronLeft size={24} />
          </button>
          <h2 className={`${textSizes[textSize]} font-semibold text-white`}>Tasks</h2>
        </div>
        <button onClick={() => setShowTaskForm(true)} className="text-blue-500 hover:text-blue-400">
          <Plus size={24} />
        </button>
      </div>
      
      {showTaskForm && (
        <div className="p-4 bg-gray-800 border-b border-gray-700">
          <input
            type="text"
            placeholder="Task name"
            value={newTask.name}
            onChange={(e) => setNewTask({...newTask, name: e.target.value})}
            className="w-full bg-gray-900 text-white px-3 py-2 rounded mb-2 border border-gray-700"
          />
          <div className="flex gap-2 mb-2">
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
              className="flex-1 bg-gray-900 text-white px-3 py-2 rounded border border-gray-700"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
              className="flex-1 bg-gray-900 text-white px-3 py-2 rounded border border-gray-700"
            />
          </div>
          <select
            value={newTask.projectId || ''}
            onChange={(e) => setNewTask({...newTask, projectId: e.target.value ? parseInt(e.target.value) : null})}
            className="w-full bg-gray-900 text-white px-3 py-2 rounded mb-2 border border-gray-700"
          >
            <option value="">No Project</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={addTask} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Add</button>
            <button onClick={() => setShowTaskForm(false)} className="flex-1 bg-gray-700 text-white py-2 rounded hover:bg-gray-600">Cancel</button>
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tasks.map(task => {
          const project = projects.find(p => p.id === task.projectId);
          return (
            <div key={task.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="flex items-start gap-3">
                <button 
                  onClick={() => toggleTaskStatus(task.id)}
                  className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center ${
                    task.status === 'Completed' ? 'bg-blue-600 border-blue-600' : 'border-gray-600'
                  }`}
                >
                  {task.status === 'Completed' && <Check size={14} className="text-white" />}
                </button>
                <div className="flex-1">
                  <h3 className={`${textSizes[textSize]} font-medium ${task.status === 'Completed' ? 'line-through text-gray-500' : 'text-white'}`}>
                    {task.name}
                  </h3>
                  {task.description && (
                    <p className={`${textSizes[textSize]} text-gray-400 text-sm mt-1`}>{task.description}</p>
                  )}
                  {project && (
                    <span className="inline-block bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded mt-2">
                      {project.name}
                    </span>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className={`flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                      <AlertCircle size={14} />
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span className="flex items-center gap-1 text-gray-400">
                        <Clock size={14} />
                        {task.dueDate}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      task.status === 'Completed' ? 'bg-green-900 text-green-300' :
                      task.status === 'In Progress' ? 'bg-blue-900 text-blue-300' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  
import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Settings, ChevronLeft, List, FolderOpen, Check, Clock, AlertCircle, Trash2 } from 'lucide-react';

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

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const deleteProject = (projectId) => {
    setProjects(projects.filter(project => project.id !== projectId));
    // Also remove project association from tasks
    setTasks(tasks.map(task => 
      task.projectId === projectId ? { ...task, projectId: null } : task
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
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-400 p-2"
                  title="Delete task"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const ProjectsView = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentView('menu')} className="text-gray-400 hover:text-white">
            <ChevronLeft size={24} />
          </button>
          <h2 className={`${textSizes[textSize]} font-semibold text-white`}>Projects</h2>
        </div>
        <button onClick={() => setShowProjectForm(true)} className="text-blue-500 hover:text-blue-400">
          <Plus size={24} />
        </button>
      </div>
      
      {showProjectForm && (
        <div className="p-4 bg-gray-800 border-b border-gray-700">
          <input
            type="text"
            placeholder="Project name"
            value={newProject.name}
            onChange={(e) => setNewProject({...newProject, name: e.target.value})}
            className="w-full bg-gray-900 text-white px-3 py-2 rounded mb-2 border border-gray-700"
          />
          <div className="flex gap-2 mb-2">
            <input
              type="date"
              placeholder="Start Date"
              value={newProject.startDate}
              onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
              className="flex-1 bg-gray-900 text-white px-3 py-2 rounded border border-gray-700"
            />
            <input
              type="date"
              placeholder="End Date"
              value={newProject.endDate}
              onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
              className="flex-1 bg-gray-900 text-white px-3 py-2 rounded border border-gray-700"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={addProject} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Add</button>
            <button onClick={() => setShowProjectForm(false)} className="flex-1 bg-gray-700 text-white py-2 rounded hover:bg-gray-600">Cancel</button>
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {projects.map(project => {
          const projectTasks = tasks.filter(t => t.projectId === project.id);
          const completedTasks = projectTasks.filter(t => t.status === 'Completed').length;
          
          return (
            <div key={project.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start justify-between mb-2">
                <h3 className={`${textSizes[textSize]} font-medium text-white`}>{project.name}</h3>
                <button 
                  onClick={() => deleteProject(project.id)}
                  className="text-red-500 hover:text-red-400 p-1"
                  title="Delete project"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: `${project.progress}%`}}></div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{project.startDate} - {project.endDate}</span>
                <span>{completedTasks}/{projectTasks.length} tasks</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const CalendarView = () => {
    const days = getDaysInMonth(selectedDate);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-700">
          <button onClick={() => setCurrentView('menu')} className="text-gray-400 hover:text-white mb-4">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))} className="text-blue-500 hover:text-blue-400 px-4 py-2 bg-gray-800 rounded border border-gray-700">
              &lt;
            </button>
            <span className={`${textSizes[textSize]} font-medium text-white`}>
              {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </span>
            <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))} className="text-blue-500 hover:text-blue-400 px-4 py-2 bg-gray-800 rounded border border-gray-700">
              &gt;
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-2 text-center mb-2">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
              <div key={day} className="text-gray-400 text-sm font-medium">{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {days.map((dayObj, index) => (
              <button
                key={index}
                className={`aspect-square flex items-center justify-center rounded ${
                  !dayObj.isCurrentMonth ? 'text-gray-600' :
                  dayObj.day === selectedDate.getDate() && dayObj.isCurrentMonth ? 'bg-blue-600 text-white' :
                  'text-gray-300 hover:bg-gray-800'
                } border border-gray-700`}
              >
                {dayObj.day}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className={`${textSizes[textSize]} font-medium text-white mb-3`}>Tasks for this day</h3>
          <div className="space-y-2">
            {tasks.filter(t => {
              if (!t.dueDate) return false;
              const taskDate = new Date(t.dueDate);
              return taskDate.getDate() === selectedDate.getDate() && 
                     taskDate.getMonth() === selectedDate.getMonth() &&
                     taskDate.getFullYear() === selectedDate.getFullYear();
            }).map(task => (
              <div key={task.id} className="bg-gray-800 rounded p-3 border border-gray-700">
                <h4 className="text-white font-medium">{task.name}</h4>
                <span className={`text-sm ${getPriorityColor(task.priority)}`}>{task.priority}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const SettingsView = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <button onClick={() => setCurrentView('menu')} className="text-gray-400 hover:text-white mb-4">
          <ChevronLeft size={24} />
        </button>
        <h2 className={`${textSizes[textSize]} text-xl font-semibold text-white`}>Settings</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <span className={`${textSizes[textSize]} text-white`}>Dark Mode</span>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-blue-600' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}></div>
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <label className={`${textSizes[textSize]} text-white block mb-2`}>Text Size</label>
          <select 
            value={textSize}
            onChange={(e) => setTextSize(e.target.value)}
            className="w-full bg-gray-900 text-white px-3 py-2 rounded border border-gray-700"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <span className={`${textSizes[textSize]} text-white`}>Push Notifications</span>
            <button 
              onClick={() => setPushNotifications(!pushNotifications)}
              className={`w-12 h-6 rounded-full transition-colors ${pushNotifications ? 'bg-blue-600' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${pushNotifications ? 'translate-x-6' : 'translate-x-1'}`}></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen bg-gray-900 text-white overflow-hidden">
      {currentView === 'menu' && <MainMenu />}
      {currentView === 'tasks' && <TasksView />}
      {currentView === 'projects' && <ProjectsView />}
      {currentView === 'calendar' && <CalendarView />}
      {currentView === 'settings' && <SettingsView />}
    </div>
  );
};

export default TaskFlowApp;
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useTaskContext } from '../context/TaskContext'
import { useState } from 'react'

const TaskSidebar = () => {
  const { state, dispatch } = useTaskContext()
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium' as const,
    dueDate: ''
  })

  const handleAddTask = () => {
    if (!newTask.title.trim()) return

    const task = {
      id: Date.now().toString(),
      ...newTask,
      status: 'todo' as const,
      createdAt: new Date().toISOString(),
      position: [-4 + Math.random() * 0.5, Math.random() * 0.5, Math.random() * 0.5] as [number, number, number],
      color: getPriorityColor(newTask.priority)
    }

    dispatch({ type: 'ADD_TASK', payload: task })
    setNewTask({
      title: '',
      description: '',
      assignee: '',
      priority: 'medium',
      dueDate: ''
    })
    dispatch({ type: 'SET_ADDING_TASK', payload: false })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#dc2626'
      case 'high': return '#ea580c'
      case 'medium': return '#2563eb'
      case 'low': return '#059669'
      default: return '#6b7280'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'דחוף'
      case 'high': return 'גבוה'
      case 'medium': return 'בינוני'
      case 'low': return 'נמוך'
      default: return 'בינוני'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'todo': return 'לביצוע'
      case 'inprogress': return 'בביצוע'
      case 'review': return 'בבדיקה'
      case 'done': return 'הושלם'
      default: return status
    }
  }

  return (
    <div className="w-80 bg-gray-900/50 backdrop-blur-md border-r border-gray-700/50 p-6 overflow-y-auto">
      {/* Task Details */}
      <AnimatePresence>
        {state.selectedTask && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">פרטי משימה</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch({ type: 'SELECT_TASK', payload: null })}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </motion.button>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-white mb-1">{state.selectedTask.title}</h3>
                <p className="text-gray-300 text-sm">{state.selectedTask.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-400">סטטוס:</span>
                  <div className="text-white font-medium">{getStatusLabel(state.selectedTask.status)}</div>
                </div>
                <div>
                  <span className="text-gray-400">עדיפות:</span>
                  <div className="text-white font-medium">{getPriorityLabel(state.selectedTask.priority)}</div>
                </div>
                <div>
                  <span className="text-gray-400">מבצע:</span>
                  <div className="text-white font-medium">{state.selectedTask.assignee}</div>
                </div>
                <div>
                  <span className="text-gray-400">תאריך יעד:</span>
                  <div className="text-white font-medium">{new Date(state.selectedTask.dueDate).toLocaleDateString('he-IL')}</div>
                </div>
              </div>
              
              <div className="flex space-x-2 space-x-reverse pt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white text-sm font-medium transition-colors"
                >
                  ערוך
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => dispatch({ type: 'DELETE_TASK', payload: state.selectedTask!.id })}
                  className="flex-1 py-2 bg-red-500 hover:bg-red-600 rounded text-white text-sm font-medium transition-colors"
                >
                  מחק
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add New Task */}
      <AnimatePresence>
        {state.isAddingTask && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">משימה חדשה</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch({ type: 'SET_ADDING_TASK', payload: false })}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </motion.button>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="כותרת המשימה"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <textarea
                placeholder="תיאור המשימה"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              
              <input
                type="text"
                placeholder="שם המבצע"
                value={newTask.assignee}
                onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">עדיפות נמוכה</option>
                <option value="medium">עדיפות בינונית</option>
                <option value="high">עדיפות גבוהה</option>
                <option value="urgent">דחוף</option>
              </select>
              
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddTask}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                ➕ הוסף משימה
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Statistics */}
      <div className="bg-gray-800/30 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">📊 סטטיסטיקות</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">סה"כ משימות:</span>
            <span className="text-white font-medium">{state.tasks.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">הושלמו:</span>
            <span className="text-green-400 font-medium">
              {state.tasks.filter(t => t.status === 'done').length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">בביצוע:</span>
            <span className="text-orange-400 font-medium">
              {state.tasks.filter(t => t.status === 'inprogress').length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">ממתינות:</span>
            <span className="text-red-400 font-medium">
              {state.tasks.filter(t => t.status === 'todo').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskSidebar
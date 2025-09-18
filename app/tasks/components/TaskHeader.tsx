'use client'

import { motion } from 'framer-motion'
import { useTaskContext } from '../context/TaskContext'

const TaskHeader = () => {
  const { state, dispatch } = useTaskContext()
  
  const statusCounts = {
    todo: state.tasks.filter(t => t.status === 'todo').length,
    inprogress: state.tasks.filter(t => t.status === 'inprogress').length,
    review: state.tasks.filter(t => t.status === 'review').length,
    done: state.tasks.filter(t => t.status === 'done').length,
  }

  const filters = [
    { key: 'all', label: 'הכל', count: state.tasks.length },
    { key: 'todo', label: 'לביצוע', count: statusCounts.todo },
    { key: 'inprogress', label: 'בביצוע', count: statusCounts.inprogress },
    { key: 'review', label: 'בבדיקה', count: statusCounts.review },
    { key: 'done', label: 'הושלם', count: statusCounts.done },
  ]

  return (
    <header className="bg-black/50 backdrop-blur-md border-b border-gray-700/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 space-x-reverse">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
          >
            🎯 ניהול משימות 3D
          </motion.h1>
          
          <div className="flex space-x-2 space-x-reverse">
            {filters.map((filter) => (
              <motion.button
                key={filter.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch({ type: 'SET_FILTER', payload: filter.key })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  state.filter === filter.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                {filter.label} ({filter.count})
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4 space-x-reverse">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch({ type: 'SET_ADDING_TASK', payload: true })}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            ➕ משימה חדשה
          </motion.button>
          
          <div className="flex items-center space-x-2 space-x-reverse text-gray-400">
            <span className="text-sm">סה"כ משימות:</span>
            <span className="text-lg font-bold text-white">{state.tasks.length}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default TaskHeader
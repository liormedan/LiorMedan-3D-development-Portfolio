'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'

export interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'inprogress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee: string
  dueDate: string
  createdAt: string
  position: [number, number, number]
  color: string
}

interface TaskState {
  tasks: Task[]
  selectedTask: Task | null
  filter: string
  isAddingTask: boolean
}

type TaskAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SELECT_TASK'; payload: Task | null }
  | { type: 'SET_FILTER'; payload: string }
  | { type: 'SET_ADDING_TASK'; payload: boolean }
  | { type: 'MOVE_TASK'; payload: { id: string; status: Task['status']; position: [number, number, number] } }

const initialState: TaskState = {
  tasks: [
    {
      id: '1',
      title: 'עיצוב ממשק משתמש',
      description: 'יצירת עיצוב מודרני לאפליקציה',
      status: 'todo',
      priority: 'high',
      assignee: 'לירן מדן',
      dueDate: '2024-01-15',
      createdAt: '2024-01-01',
      position: [-4, 0, 0],
      color: '#ef4444'
    },
    {
      id: '2',
      title: 'פיתוח API',
      description: 'בניית שרת וממשקי תקשורת',
      status: 'inprogress',
      priority: 'urgent',
      assignee: 'דני כהן',
      dueDate: '2024-01-20',
      createdAt: '2024-01-02',
      position: [-1.5, 0, 0],
      color: '#f59e0b'
    },
    {
      id: '3',
      title: 'בדיקות איכות',
      description: 'בדיקות אוטומטיות ומנואליות',
      status: 'review',
      priority: 'medium',
      assignee: 'שרה לוי',
      dueDate: '2024-01-25',
      createdAt: '2024-01-03',
      position: [1.5, 0, 0],
      color: '#3b82f6'
    },
    {
      id: '4',
      title: 'פרסום לפרודקשן',
      description: 'העלאה לשרת הפרודקשן',
      status: 'done',
      priority: 'low',
      assignee: 'מיכל אברהם',
      dueDate: '2024-01-30',
      createdAt: '2024-01-04',
      position: [4, 0, 0],
      color: '#10b981'
    }
  ],
  selectedTask: null,
  filter: 'all',
  isAddingTask: false
}

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload }
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] }
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      }
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      }
    case 'SELECT_TASK':
      return { ...state, selectedTask: action.payload }
    case 'SET_FILTER':
      return { ...state, filter: action.payload }
    case 'SET_ADDING_TASK':
      return { ...state, isAddingTask: action.payload }
    case 'MOVE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, status: action.payload.status, position: action.payload.position }
            : task
        )
      }
    default:
      return state
  }
}

const TaskContext = createContext<{
  state: TaskState
  dispatch: React.Dispatch<TaskAction>
} | null>(null)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTaskContext() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider')
  }
  return context
}
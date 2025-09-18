'use client'

import { Suspense } from 'react'
import TaskBoard3D from './components/TaskBoard3D'
import TaskSidebar from './components/TaskSidebar'
import TaskHeader from './components/TaskHeader'
import { TaskProvider } from './context/TaskContext'

export default function TasksPage() {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <TaskHeader />
        <div className="flex h-[calc(100vh-80px)]">
          <TaskSidebar />
          <div className="flex-1 relative">
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <div className="text-white text-xl">טוען לוח משימות תלת-ממדי...</div>
              </div>
            }>
              <TaskBoard3D />
            </Suspense>
          </div>
        </div>
      </div>
    </TaskProvider>
  )
}
'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Box, Float } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useTaskContext } from '../context/TaskContext'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const TaskCube = ({ task, onClick }: { task: any; onClick: () => void }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  const priorityHeight = useMemo(() => {
    switch (task.priority) {
      case 'urgent': return 1.5
      case 'high': return 1.2
      case 'medium': return 1.0
      case 'low': return 0.8
      default: return 1.0
    }
  }, [task.priority])

  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.3}>
      <group position={task.position}>
        <Box
          ref={meshRef}
          args={[0.8, priorityHeight, 0.8]}
          onClick={onClick}
        >
          <meshStandardMaterial
            color={task.color}
            metalness={0.3}
            roughness={0.4}
            transparent
            opacity={0.9}
          />
        </Box>
        
        <Text
          position={[0, priorityHeight/2 + 0.5, 0]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {task.title}
        </Text>
        
        <Text
          position={[0, priorityHeight/2 + 0.3, 0]}
          fontSize={0.1}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
        >
          {task.assignee}
        </Text>
      </group>
    </Float>
  )
}

const StatusColumn = ({ status, position, color, label }: { 
  status: string; 
  position: [number, number, number]; 
  color: string; 
  label: string 
}) => {
  return (
    <group position={position}>
      <Box args={[2, 0.1, 2]} position={[0, -1, 0]}>
        <meshStandardMaterial color={color} transparent opacity={0.3} />
      </Box>
      
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.3}
        color={color}
        anchorX="center"
        anchorY="middle"
        font-weight="bold"
      >
        {label}
      </Text>
    </group>
  )
}

const TaskBoard3D = () => {
  const { state, dispatch } = useTaskContext()
  
  const filteredTasks = useMemo(() => {
    if (state.filter === 'all') return state.tasks
    return state.tasks.filter(task => task.status === state.filter)
  }, [state.tasks, state.filter])

  const handleTaskClick = (task: any) => {
    dispatch({ type: 'SELECT_TASK', payload: task })
  }

  const columns = [
    { status: 'todo', position: [-4, 0, 0] as [number, number, number], color: '#ef4444', label: 'לביצוע' },
    { status: 'inprogress', position: [-1.5, 0, 0] as [number, number, number], color: '#f59e0b', label: 'בביצוע' },
    { status: 'review', position: [1.5, 0, 0] as [number, number, number], color: '#3b82f6', label: 'בבדיקה' },
    { status: 'done', position: [4, 0, 0] as [number, number, number], color: '#10b981', label: 'הושלם' },
  ]

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 3, 8], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#7928ca" intensity={0.5} />
        
        {/* Status Columns */}
        {columns.map((column) => (
          <StatusColumn key={column.status} {...column} />
        ))}
        
        {/* Task Cubes */}
        {filteredTasks.map((task) => (
          <TaskCube
            key={task.id}
            task={task}
            onClick={() => handleTaskClick(task)}
          />
        ))}
        
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={15}
        />
      </Canvas>

      {/* Controls Overlay */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md rounded-lg p-4 text-white">
        <h3 className="font-semibold mb-2">🎮 בקרות:</h3>
        <div className="text-sm space-y-1">
          <div>🖱️ גרור לסיבוב המצלמה</div>
          <div>🔍 גלגל עכבר לזום</div>
          <div>👆 לחץ על קוביה לפרטים</div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md rounded-lg p-4 text-white">
        <h3 className="font-semibold mb-2">📊 מקרא:</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>דחוף</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>גבוה</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>בינוני</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>נמוך</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskBoard3D
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Float, Box } from '@react-three/drei'

const NotFound3D = () => {
  return (
    <Float speed={1.4} rotationIntensity={1} floatIntensity={2}>
      <group>
        <Box args={[2, 0.5, 0.2]} position={[-1, 0, 0]}>
          <meshNormalMaterial />
        </Box>
        <Box args={[0.5, 2, 0.2]} position={[0, 0, 0]}>
          <meshNormalMaterial />
        </Box>
        <Box args={[2, 0.5, 0.2]} position={[1, 0, 0]}>
          <meshNormalMaterial />
        </Box>
        <Text
          position={[0, -1.5, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          404
        </Text>
      </group>
    </Float>
  )
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
      <div className="text-center">
        {/* 3D 404 */}
        <div className="h-64 mb-8">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <NotFound3D />
            <OrbitControls enableZoom={false} autoRotate />
          </Canvas>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-400 to-pink-600 bg-clip-text text-transparent">
            עמוד לא נמצא
          </h1>
          
          <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto">
            הדף שחיפשת לא קיים או הועבר למקום אחר
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/"
                className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                🏠 חזור לעמוד הבית
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/tasks"
                className="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-full text-white font-semibold hover:from-green-600 hover:to-teal-700 transition-all duration-300"
              >
                🎯 ניהול משימות 3D
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
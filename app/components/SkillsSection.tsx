'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Text, OrbitControls, Float } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import * as THREE from 'three'

const SkillOrb = ({ position, text, color }: { position: [number, number, number]; text: string; color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.3
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    }
  })

  return (
    <Float speed={1.4} rotationIntensity={1} floatIntensity={2}>
      <group position={position}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial
            color={color}
            metalness={0.7}
            roughness={0.2}
            transparent
            opacity={0.8}
          />
        </mesh>
        <Text
          position={[0, 0, 0.9]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {text}
        </Text>
      </group>
    </Float>
  )
}

const Skills3D = () => {
  const skills = [
    { text: "React", position: [-2, 1, 0] as [number, number, number], color: "#61dafb" },
    { text: "Three.js", position: [2, 1, 0] as [number, number, number], color: "#000000" },
    { text: "Next.js", position: [0, 2, 0] as [number, number, number], color: "#000000" },
    { text: "TypeScript", position: [-2, -1, 0] as [number, number, number], color: "#3178c6" },
    { text: "WebGL", position: [2, -1, 0] as [number, number, number], color: "#990000" },
    { text: "GSAP", position: [0, -2, 0] as [number, number, number], color: "#88ce02" },
  ]

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <pointLight position={[-10, -10, -10]} color="#7928ca" />
      {skills.map((skill, index) => (
        <SkillOrb key={index} {...skill} />
      ))}
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </>
  )
}

const SkillCard = ({ skill, index }: { skill: any; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, rotateY: 5 }}
      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
    >
      <div className="text-4xl mb-4">{skill.icon}</div>
      <h3 className="text-xl font-bold mb-2 text-white">{skill.name}</h3>
      <p className="text-gray-400 mb-4">{skill.description}</p>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          transition={{ duration: 1, delay: index * 0.1 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
        />
      </div>
      <span className="text-sm text-gray-400 mt-2 block">{skill.level}%</span>
    </motion.div>
  )
}

const SkillsSection = () => {
  const skills = [
    {
      name: "React & Next.js",
      description: "פיתוח אפליקציות מתקדמות עם React ו-Next.js",
      icon: "⚛️",
      level: 95
    },
    {
      name: "Three.js & WebGL",
      description: "יצירת חוויות תלת-ממדיות אינטראקטיביות",
      icon: "🎮",
      level: 90
    },
    {
      name: "TypeScript",
      description: "פיתוח עם טיפוסים חזקים ובטיחות קוד",
      icon: "📘",
      level: 88
    },
    {
      name: "GSAP & Framer Motion",
      description: "אנימציות מתקדמות וחוויות אינטראקטיביות",
      icon: "✨",
      level: 85
    },
    {
      name: "Blender & 3D Modeling",
      description: "יצירת מודלים תלת-ממדיים ואנימציות",
      icon: "🎨",
      level: 80
    },
    {
      name: "WebXR & AR",
      description: "מציאות רבודה ומציאות וירטואלית בדפדפן",
      icon: "🥽",
      level: 75
    }
  ]

  return (
    <section id="skills" className="py-20 px-6 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            הכישורים שלי
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            טכנולוגיות וכלים מתקדמים ליצירת חוויות דיגיטליות מרהיבות
          </p>
        </motion.div>

        {/* 3D Skills Visualization */}
        <div className="h-96 mb-16 rounded-xl overflow-hidden bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-gray-700/50">
          <Canvas camera={{ position: [0, 0, 8] }}>
            <Skills3D />
          </Canvas>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <SkillCard key={index} skill={skill} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default SkillsSection
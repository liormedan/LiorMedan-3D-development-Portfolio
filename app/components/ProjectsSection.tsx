'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Box, Sphere, Torus, Float, Text3D, Center } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useState } from 'react'

const Project3D = ({ type, color }: { type: string; color: string }) => {
  const renderShape = () => {
    switch (type) {
      case 'box':
        return (
          <Box args={[1, 1, 1]}>
            <meshStandardMaterial color={color} />
          </Box>
        )
      case 'sphere':
        return (
          <Sphere args={[0.8, 32, 32]}>
            <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
          </Sphere>
        )
      case 'torus':
        return (
          <Torus args={[0.8, 0.3, 16, 100]}>
            <meshStandardMaterial color={color} />
          </Torus>
        )
      default:
        return null
    }
  }

  return (
    <Float speed={1.4} rotationIntensity={1} floatIntensity={2}>
      {renderShape()}
    </Float>
  )
}

const ProjectCard = ({ project, index }: { project: any; index: number }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
    >
      <div className="h-64 relative">
        <Canvas camera={{ position: [0, 0, 3] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Project3D type={project.shape} color={project.color} />
          <OrbitControls enableZoom={false} autoRotate={isHovered} />
        </Canvas>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
        <p className="text-gray-400 mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech: string) => (
            <span
              key={tech}
              className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
        >
          צפה בפרויקט
        </motion.button>
      </div>
    </motion.div>
  )
}

const ProjectsSection = () => {
  const projects = [
    {
      title: "אתר אינטראקטיבי 3D",
      description: "אתר עם אנימציות תלת-ממדיות מתקדמות ואינטראקציה עם המשתמש",
      technologies: ["React", "Three.js", "GSAP"],
      shape: "sphere",
      color: "#0070f3"
    },
    {
      title: "מציאות רבודה AR",
      description: "אפליקציית מציאות רבודה לתצוגת מוצרים תלת-ממדיים",
      technologies: ["React Native", "AR.js", "WebXR"],
      shape: "box",
      color: "#7928ca"
    },
    {
      title: "גלריה וירטואלית",
      description: "חוויית גלריה וירטואלית עם ניווט תלת-ממדי",
      technologies: ["Next.js", "R3F", "Blender"],
      shape: "torus",
      color: "#ff6b6b"
    },
    {
      title: "משחק אינטראקטיבי",
      description: "משחק דפדפן עם פיזיקה ואנימציות מתקדמות",
      technologies: ["TypeScript", "Cannon.js", "React"],
      shape: "sphere",
      color: "#4ecdc4"
    },
    {
      title: "דוגמן מוצר 3D",
      description: "כלי לתצוגה ועריכה של מוצרים תלת-ממדיים",
      technologies: ["Three.js", "React", "WebGL"],
      shape: "box",
      color: "#45b7d1"
    },
    {
      title: "סימולציה פיזיקלית",
      description: "סימולציה אינטראקטיבית של חוקי פיזיקה",
      technologies: ["Matter.js", "Canvas API", "React"],
      shape: "torus",
      color: "#96ceb4"
    }
  ]

  return (
    <section id="projects" className="py-20 px-6 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            הפרויקטים שלי
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            אוסף של פרויקטים מתקדמים המשלבים טכנולוגיות תלת-ממדיות עם עיצוב מודרני
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection
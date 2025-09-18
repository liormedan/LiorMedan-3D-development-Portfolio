'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Box, Sphere, Torus, Float } from '@react-three/drei'
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
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-white">{project.title}</h3>
          {project.isLive && (
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium animate-pulse">
              🟢 Live
            </span>
          )}
        </div>
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
        {project.link ? (
          <motion.a
            href={project.link}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="block w-full py-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg text-white font-semibold hover:from-green-600 hover:to-teal-700 transition-all duration-300 text-center"
          >
            🚀 נסה עכשיו
          </motion.a>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            צפה בפרויקט
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

const ProjectsSection = () => {
  const projects = [
    {
      title: "🎯 מערכת ניהול משימות 3D",
      description: "אפליקציה אינטראקטיבית לניהול משימות עם קוביות תלת-ממדיות מרחפות",
      technologies: ["Next.js", "Three.js", "React Context"],
      shape: "box",
      color: "#10b981",
      link: "/tasks",
      isLive: true
    },
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

        {/* Featured Project */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">⭐</span>
              <h3 className="text-2xl font-bold text-white">פרויקט מומלץ</h3>
              <span className="mr-4 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium animate-pulse">
                🟢 זמין עכשיו
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                  🎯 מערכת ניהול משימות 3D
                </h4>
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  אפליקציה מתקדמת לניהול משימות עם ויזואליזציה תלת-ממדית אינטראקטיבית. 
                  כל משימה מיוצגת כקוביה מרחפת עם צבעים ועדיפויות שונות.
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {["Next.js", "Three.js", "React Context", "TypeScript", "Framer Motion"].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <motion.a
                  href="/tasks"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(16, 185, 129, 0.6)" }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl text-white font-bold text-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300"
                >
                  🚀 נסה את האפליקציה
                </motion.a>
              </div>
              
              <div className="h-64 rounded-xl overflow-hidden bg-gradient-to-br from-green-900/20 to-teal-900/20 border border-green-500/20">
                <Canvas camera={{ position: [0, 0, 5] }}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  <Float speed={1.4} rotationIntensity={1} floatIntensity={2}>
                    <Box args={[1, 1.2, 1]} position={[-1, 0, 0]}>
                      <meshStandardMaterial color="#10b981" metalness={0.3} roughness={0.4} />
                    </Box>
                    <Box args={[1, 0.8, 1]} position={[1, 0, 0]}>
                      <meshStandardMaterial color="#f59e0b" metalness={0.3} roughness={0.4} />
                    </Box>
                    <Box args={[1, 1.5, 1]} position={[0, 1, 0]}>
                      <meshStandardMaterial color="#ef4444" metalness={0.3} roughness={0.4} />
                    </Box>
                  </Float>
                  <OrbitControls enableZoom={false} autoRotate />
                </Canvas>
              </div>
            </div>
          </div>
        </motion.div>

        {/* All Projects Grid */}
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
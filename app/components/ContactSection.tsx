'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float, Text } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import * as THREE from 'three'

const ContactOrb = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
    }
  })

  return (
    <Float speed={1.4} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1.5, 100, 200]} scale={1.2}>
        <MeshDistortMaterial
          color="#7928ca"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  )
}

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <motion.form
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
          שם מלא
        </label>
        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
          placeholder="הכנס את שמך המלא"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          כתובת אימייל
        </label>
        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
          הודעה
        </label>
        <motion.textarea
          whileFocus={{ scale: 1.02 }}
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 resize-none"
          placeholder="ספר לי על הפרויקט שלך..."
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(121, 40, 202, 0.5)" }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
      >
        שלח הודעה
      </motion.button>
    </motion.form>
  )
}

const ContactSection = () => {
  const socialLinks = [
    { name: 'GitHub', icon: '🐙', href: '#' },
    { name: 'LinkedIn', icon: '💼', href: '#' },
    { name: 'Twitter', icon: '🐦', href: '#' },
    { name: 'Dribbble', icon: '🏀', href: '#' },
  ]

  return (
    <section id="contact" className="py-20 px-6 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">
            בוא נעבוד יחד
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            יש לך רעיון מעניין? בוא נהפוך אותו למציאות עם טכנולוגיות תלת-ממדיות מתקדמות
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 3D Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="h-96 rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-gray-700/50"
          >
            <Canvas camera={{ position: [0, 0, 4] }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <ContactOrb />
            </Canvas>
          </motion.div>

          {/* Contact Form */}
          <div>
            <ContactForm />
            
            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 pt-8 border-t border-gray-700"
            >
              <h3 className="text-lg font-semibold text-white mb-4">עקוב אחרי ברשתות החברתיות</h3>
              <div className="flex space-x-4 space-x-reverse">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center text-2xl hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                    title={link.name}
                  >
                    {link.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-gray-700 text-center"
        >
          <p className="text-gray-400">
            © 2024 Portfolio 3D. כל הזכויות שמורות. נבנה עם ❤️ ו-Three.js
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default ContactSection
'use client'

import { motion } from 'framer-motion'

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
        />
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
        >
          טוען חוויה תלת-ממדית...
        </motion.h2>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="w-64 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-4 mx-auto"
        />
      </div>
    </div>
  )
}

export default LoadingScreen
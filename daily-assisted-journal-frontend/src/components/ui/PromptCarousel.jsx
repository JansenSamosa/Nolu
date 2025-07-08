import { AnimatePresence } from 'framer-motion'
import React from 'react'
import { motion } from 'framer-motion'
const PromptCarousel = ({ children, index = 0, className }) => {
  return (
    <div
      key={index}
      className={`${className} h-full w-full flex items-center justify-center`}
    >
      {children[index]}
    </div>
  )
}

export default PromptCarousel
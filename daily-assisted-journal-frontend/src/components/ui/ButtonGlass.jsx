import React from 'react'
import { motion } from 'framer-motion'
const ButtonGlass = ({ children, className, onClick, clickable = true }) => {
  return( 
    <motion.button
      onClick={clickable && onClick}
      className={`${className} shadow-md bg-white/15  hover:bg-white/7
            active:shadow-sm active:bg-white/0
            transition-opacity rounded-2xl ${clickable && 'cursor-pointer'}`}
    >
      {children}
    </motion.button>
)}

export default ButtonGlass
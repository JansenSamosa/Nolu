import { AnimatePresence } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const AnimatedCarousel = ({ position=0, classNameContainer = '', classNameContent = '', children }) => {
  const [previousPosition, setPreviousPosition] = useState([null, null]) // [previous, current]
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef(null)
  
  const updateContainerWidth = () => {
    setContainerWidth(containerRef.current ? containerRef.current.offsetWidth : 0)
  }
  
  useEffect(() => {
    updateContainerWidth()
  }, [])
  
  if (previousPosition[1] !== position) {
    setPreviousPosition([previousPosition[1], position])
    updateContainerWidth()
  }
  const direction = position - previousPosition[0] 

  const slideVariants = {
    enter: (direction) => ({
      x: direction * containerWidth
    }),
    center: {
      x: '0%'
    },
    exit: (direction) => ({
      x: direction * -containerWidth
    })
  }


  return (
    <div ref={containerRef} className={`${classNameContainer} relative`}>
      <AnimatePresence mode='sync' custom={direction}>
        <motion.div
          key={position}
          className={`${classNameContent} absolute`}
          variants={slideVariants}
          initial='enter'
          animate='center'
          exit='exit'
          transition={{ duration: 0.5, type:'spring' }}
          custom={direction}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default AnimatedCarousel
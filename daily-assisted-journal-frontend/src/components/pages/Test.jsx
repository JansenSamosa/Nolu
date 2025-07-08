import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import AnimatedCarousel from '../ui/AnimatedCarousel'

const Test = () => {
  const [position, setPosition] = useState(0)

  return (
    <div
      className='background-saturated w-screen h-screen flex items-center'
    >
      <button
        className='size-10 cursor-pointer'
        onClick={() => setPosition(position - 1)}
      >
        <ChevronLeftIcon />
      </button>


      <AnimatedCarousel
        position={position}
        classNameContainer='flex-1 flex justify-center items-center h-100 bg-glass overflow-hidden '
        classNameContent='p-5 '
      >
        <div className='bg-white size-60 rounded-2xl flex justify-center items-center text-6xl'>
          {position}
        </div>
      </AnimatedCarousel>
      <button
        className='size-10 cursor-pointer'
        onClick={() => setPosition(position + 1)}
      >
        <ChevronRightIcon />
      </button>
    </div>
  )
}

export default Test
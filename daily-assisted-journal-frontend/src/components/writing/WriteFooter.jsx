import React from 'react'
import ButtonGlass from '../ui/ButtonGlass'
import { ArrowLongRightIcon, PencilIcon } from '@heroicons/react/24/outline'
import { DocumentTextIcon } from '@heroicons/react/24/solid'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { CheckBadgeIcon, CheckIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

const WriteFooter = ({ showWordCount = true, wordCount = 0, requiredWordCount = 10, showContinueButton = true, onClickContinueButton, className }) => {
  return (
    <MotionConfig
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: .5, type: 'tween', ease: 'backOut' }}
    >
      <motion.div
        className={`
          ${className} h-15 w-full flex justify-center items-center text-xl bg-glass rounded-none
             
        `}
      >
        <motion.div layout className='flex-7 p-4  h-full flex justify-center items-center'>
          <PencilIcon className='h-full mx-2 ' />
          <motion.p>
            {wordCount + (!showContinueButton ? ` / ${requiredWordCount}` : '')}
          </motion.p>
        </motion.div>
        {showContinueButton &&
          <motion.div
            layout
            className='flex-3 md:flex-1  h-full'
            initial={{ opacity:0, x:'-200%'}}
            animate={{ opacity: 1, x:0}}
            exit={{ opacity: 0 }}
            transition={{ duration: .5, type: 'tween', ease: 'backInOut' }}
          >
            <ButtonGlass
              className='size-full flex items-center justify-center p-2 rounded-none '
              onClick={onClickContinueButton}
              clickable={showContinueButton}
            >
              <ChevronRightIcon strokeWidth={1} className='h-full' opacity={0.8} />
            </ButtonGlass>
          </motion.div>}
      </motion.div>
    </MotionConfig>
  )
}

export default WriteFooter
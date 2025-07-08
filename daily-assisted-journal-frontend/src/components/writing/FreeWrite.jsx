import React, { useEffect, useState } from 'react'
import ButtonGlass from '../ui/ButtonGlass'
import Textarea from './Textarea'
import { word_count } from '../../utils/utils'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { ArrowRightCircleIcon, PencilIcon } from '@heroicons/react/24/outline'
import { ChevronRightIcon } from '@heroicons/react/16/solid'
import WriteFooter from './WriteFooter'

const FreeWrite = ({ className, response, setResponse, goToNextEntry }) => {
  const [isWriting, setIsWriting] = useState(false)
  const [responseWordCount, setResponseWordCount] = useState(word_count(response.userResponse))

  const setUserResponse = text => {
    setResponse({ userResponse: text })
    setResponseWordCount(word_count(text))
  }

  return (
    <div
      className={`${className} text-2xl size-full flex flex-col items-center justify-center`}
    >
      {!isWriting &&
        <motion.p
          className='px-10'
          initial={{ opacity: 0, position: 'relative', bottom: '30px' }}
          animate={{ opacity: 1, bottom: '0' }}
          transition={{ duration: 1, delay: 0, ease: 'backInOut' }}
        >
          Free Write: use this space to capture any remaining thoughts or ideas you have.
        </motion.p>
      }
      <motion.div
        className='w-fit flex flex-col justify-center items-center gap-3 p-5'
        initial={{ opacity: 0, position: 'relative', bottom: '30px' }}
        animate={{ opacity: 1, bottom: '0' }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, delay: 1, ease: 'backInOut' }}
      >
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, type: 'tween', ease: 'backInOut' }}
        >
          <ButtonGlass
            className='p-2 flex justify-center items-center '
            onClick={() => setIsWriting(!isWriting)}
          >
            <AnimatePresence mode='wait'>
              {!isWriting ?
                <motion.div
                  layout
                  key='choosing'
                  className='px-10'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'backInOut' }}
                >
                  Start writing
                </motion.div>
                :
                <motion.p
                  layout
                  key='writing'
                  className='px-5'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: !isWriting ? .5 : .25, delay: !isWriting ? .25 : 0, ease: 'backInOut' }}
                >
                  Free Write: Use this space to capture any remaining thoughts or ideas you have.
                </motion.p>}
            </AnimatePresence>
          </ButtonGlass>
        </motion.div>
        {!isWriting &&
          <motion.div
            className='w-full'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, type: 'tween', ease: 'backInOut' }}
          >
            <ButtonGlass
              className='p-1 px-5 w-3/4 '
              onClick={goToNextEntry}
            >
              <p className=''>Skip</p>
            </ButtonGlass>
          </motion.div>
        }
      </motion.div>
      {isWriting && 
        <motion.div
          className='flex-1 w-full h-full pt-0 flex flex-col'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5, type: 'tween', ease: 'backInOut' }}
        >
          <Textarea
            value={response.userResponse}
            onChange={e => setUserResponse(e.target.value)}
          />
          <WriteFooter
            showWordCount={false}
            wordCount={responseWordCount}
            requiredWordCount={20}
            showContinueButton={responseWordCount >= 20}
            onClickContinueButton={goToNextEntry}
            className='mt-5'
          />
        </motion.div>
      }
    </div>
  )
}

export default FreeWrite
import React, { useState, useEffect, useContext } from 'react'
import ButtonGlass from '../ui/ButtonGlass'
import { word_count } from '../../utils/utils'
import { staticDataContext } from '../../App'
import { ArrowPathIcon } from '@heroicons/react/20/solid'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeftIcon, ArrowUturnLeftIcon } from '@heroicons/react/16/solid'
import WriteFooter from './WriteFooter'

const PromptWrite = ({ className, response, setResponse, goToNextEntry }) => {
  const { prompts, moods } = useContext(staticDataContext)
  const [promptChoices, setPromptChoices] = useState([])
  const [responseWordCount, setResponseWordCount] = useState(0)

  const setPromptText = (text) => {
    setResponse({ ...response, promptText: text })
  }

  const setUserResponse = (text) => {
    setResponse({ ...response, userResponse: text })
    setResponseWordCount(word_count(text))
  }

  const refreshPromptChoices = () => {
    if (prompts && prompts.length >= 3) {
      const numSelections = Math.min(3, prompts.length);
      const indices = new Set();
      while (indices.size < numSelections) {
        indices.add(Math.floor(Math.random() * prompts.length));
      }
      const selectedPrompts = Array.from(indices).map(index => prompts[index]);
      setPromptChoices(selectedPrompts);
    }
  }



  useEffect(() => {
    refreshPromptChoices()
  }, [])

  return (
    <motion.div
      className={`${className} text-2xl size-full flex flex-col items-center justify-center`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: .5, type: 'tween', ease: 'backInOut' }}
    >
      {!response.promptText &&
        <motion.div
          className=' flex flex-col items-center justify-center  '
          initial={{ opacity: 0, position: 'relative', bottom: '30px' }}
          animate={{ opacity: 1, bottom: '0' }}
          transition={{ duration: 1, type: 'tween', ease: 'backInOut' }}
          exit={{ opacity: 0 }}
        >
          <p> Select today's writing prompt: </p>
        </motion.div>
      }
      <motion.div
        className=' flex flex-col justify-center items-center gap-3 p-5'
        initial={{ opacity: 0, position: 'relative', bottom: '30px' }}
        animate={{ opacity: 1, bottom: '0' }}
        transition={{ duration: 1, delay: 1, type: 'tween', ease: 'backInOut' }}
        exit={{ opacity: 0 }}
      >
        {promptChoices.map((text, index) =>
          (!response.promptText || response.promptText == text) && (
            <motion.div
              layout
              key={text}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, type: 'tween', ease: 'backInOut' }}
            >
              <ButtonGlass
                className=' w-full flex items-center justify-center bg-glass p-3'
                onClick={() => text == response.promptText ? setPromptText("") : setPromptText(text)}
              >
                <p>{text}</p>
              </ButtonGlass>
            </motion.div>
          ))}
      </motion.div>
      {response.promptText && <>
        <motion.div
          className='flex-1 w-full h-full pt-0 flex flex-col'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5, type: 'tween', ease: 'backInOut' }}
        >
          <textarea
            className=' w-full h-full px-5 focus:outline-none resize-none '
            value={response.userResponse}
            onChange={e => setUserResponse(e.target.value)}
            placeholder='Write here...'
          />
          <WriteFooter
            showWordCount={response.promptText}
            wordCount={responseWordCount}
            requiredWordCount={20}
            showContinueButton={responseWordCount >= 20}
            onClickContinueButton={goToNextEntry}
            className='mt-5'
          />
        </motion.div>
      </>}
    </motion.div>
  )
}

export default PromptWrite


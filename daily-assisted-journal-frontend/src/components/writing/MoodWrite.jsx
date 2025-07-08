import React, { useContext, useEffect, useState } from 'react'
import { StaticDataContext } from '../../App'
import { word_count } from '../../utils/utils'
import ButtonGlass from '../ui/ButtonGlass'
import Textarea from './Textarea'
import { ArrowLongRightIcon, PencilIcon } from '@heroicons/react/24/outline'
import { DocumentTextIcon } from '@heroicons/react/24/solid'
import WriteFooter from './WriteFooter'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'

const MoodWrite = ({ className, response, setResponse, goToNextEntry }) => {
  const REQUIRED_WORD_COUNT = 20

  const { moods, prompts } = useContext(StaticDataContext)
  
  // selected mood
  const [selected, setSelected] = useState(response.selectedMood)
  const [explanation, setExplanation] = useState(response.userResponse)

  const [explanationWordCount, setExplanationWordCount] = useState(word_count(response.userResponse))


  const meetsWordCount = () => explanationWordCount >= REQUIRED_WORD_COUNT

  useEffect(() => {
    setExplanationWordCount(word_count(explanation))
    setResponse({
      selectedMood: selected,
      userResponse: explanation,
    })
  }, [selected, explanation])

  return (
    <MotionConfig
      transition={{ duration: 0.5, type: 'tween', ease: 'backInOut' }}
    >
      <motion.div
        className={`${className}  text-2xl flex flex-col items-center justify-center size-full`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, type: 'tween', ease: 'backOut' }}
      >
        {!selected &&
          <motion.div
            className=' flex flex-col items-center justify-center'
            initial={{ opacity: 0, position: 'relative', bottom: '30px' }}
            animate={{ opacity: 1, bottom: '0' }}
            transition={{ duration: 1, type: 'tween', ease: 'backInOut' }}
            exit={{ opacity: 0 }}
          >
            <p> How are you feeling today? </p>
          </motion.div>
        }
        <motion.ul
          className=' flex items-center justify-center flex-wrap gap-2 p-5 md:w-1/2'
          initial={{ opacity: 0, position: 'relative', bottom: '30px' }}
          animate={{ opacity: 1, bottom: '0' }}
          transition={{ duration: 1, delay: 1, type: 'tween', ease: 'backInOut' }}
          exit={{ opacity: 0 }}
        >
          <AnimatePresence mode='popLayout'>
            {moods.map((item, index) => (!selected || selected == item) &&
              <motion.li
                layout
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <ButtonGlass
                  className={`text-2xl cursor-pointer p-3 gap-2 flex flex-wrap items-center justify-center`}
                  onClick={() => {
                    if (selected != item) { setSelected(item) }
                    else { setSelected('') }
                  }}
                >
                  {selected &&
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className='text-2xl relative left-[1px] '
                    >
                      Why do you feel
                    </motion.p>
                  }
                  <motion.p
                    layout
                  >
                    {selected ? `${item}?` : item}
                  </motion.p>
                </ButtonGlass>
              </motion.li>
            )}
          </AnimatePresence>
        </motion.ul>
        {selected &&
          <motion.div
            className='flex-1 w-full h-full pt-0 flex flex-col'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5, type: 'tween', ease: 'backInOut' }}
          >
            <Textarea
              value={explanation}
              onChange={e => setExplanation(e.target.value)}
            />
            <WriteFooter
              showWordCount={selected}
              wordCount={explanationWordCount}
              requiredWordCount={REQUIRED_WORD_COUNT}
              showContinueButton={explanationWordCount >= REQUIRED_WORD_COUNT}
              onClickContinueButton={goToNextEntry}
              className='mt-5'
            />
          </motion.div>
        }
      </motion.div>
    </MotionConfig>
  )
}

export default MoodWrite

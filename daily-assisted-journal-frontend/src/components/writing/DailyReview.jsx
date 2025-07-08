import React, { useContext, useEffect, useRef, useState } from 'react'
import { useAnimate, stagger, MotionConfig, LayoutGroup, AnimatePresence } from 'framer-motion'
import ButtonGlass from '../ui/ButtonGlass'
import { useNavigate } from 'react-router'
import { StreakContext } from '../../App'
import { motion } from 'framer-motion'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import { BookOpenIcon } from '@heroicons/react/24/outline'

const EntryItem = ({ entry, index }) => {
  const buttonRef = useRef(null)
  const [viewResponse, setViewResponse] = useState(false)

  let headerText = ""
  const response = entry.data.userResponse

  if (entry.type === 'mood') {
    headerText = `You felt ${entry.data.selectedMood}`
  } else if (entry.type === 'prompt') {
    headerText = entry.data.promptText
  } else {
    headerText = 'Free Write: use this space to capture any remaining thoughts or ideas you have.'
  }

  const handleClick = () => {
    setViewResponse(!viewResponse)
    
    // Scroll to this button after a brief delay (to let layout animation start)
    setTimeout(() => {
      buttonRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center', // 'start', 'center', 'end', or 'nearest'
        inline: 'nearest'
      })
    }, 100) // Small delay to let the layout animation begin
  }

  return (
    <motion.li
      className='w-full'
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'backInOut' }}
    >
      <MotionConfig
        transition={{ duration: 0.5, ease: 'backInOut' }}
      >
        <motion.button
          ref={buttonRef}
          className='w-full bg-glass px-5 cursor-pointer pt-5 flex flex-col gap-2'
          onClick={handleClick}
          layout
        >
          <motion.p
            layout
            className="font-bold"
          >
            {headerText}

          </motion.p>
          {viewResponse &&
            <motion.p
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: 'backInOut' }}
            >
              {response}
            </motion.p>
          }

          <motion.div
            layout
            className='size-7 m-auto'
          >
            {viewResponse ?
              <ChevronUpIcon />
              :
              <ChevronDownIcon />
            }
          </motion.div>
        </motion.button>
      </MotionConfig>
    </motion.li>
  )
}

const DailyReview = ({ entries }) => {
  const navigate = useNavigate()
  const [scope, animate] = useAnimate()
  const displayStreakElement = useRef(null)

  const { streakData, setStreakData } = useContext(StreakContext)

  const [showEntries, setShowEntries] = useState(false)

  useEffect(() => {
    const handleStreakAnim = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))


      await animate('.streak-number', {
        position: 'relative',
        right: [0, -50],
        opacity: [1, 0]
      }, { duration: .5, ease: 'backIn' })

      displayStreakElement.current.textContent = streakData.streak
      await animate('.streak-number', {
        right: [50, 0],
        opacity: [0, 1]
      }, { duration: .5, ease: 'backOut' })

      await new Promise(resolve => setTimeout(resolve, 2000))

      // 4 second long animation until entries are shown
      setShowEntries(true)
    }

    handleStreakAnim()
  }, [])

  return (
    <div ref={scope} className='flex-1 flex flex-col justify-center items-center text-2xl overflow-hidden'>
      <div className='flex-1 flex flex-col justify-center items-center overflow-scroll w-full md:w-3/4 lg:w-5/12 hide-scrollbar'>
        <LayoutGroup>
          {/* streak counter */}
          <motion.div
            className='font-bold flex flex-col px-15 py-5 text-center '
            layout
          >
            <motion.p
              ref={displayStreakElement}
              className='streak-number text-8xl '
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: .5 }}
            >
              {streakData.streak - 1}

            </motion.p>
            <motion.p
              className='streak-text text-4xl '
              initial={{ opacity: 0, position: 'relative', right: 50 }}
              animate={{ opacity: 1, right: 0 }}
              transition={{ duration: .5, delay: 1.5, ease: 'backOut' }}
            >
              day streak!

            </motion.p>
            <motion.p
              className='streak-message text-2xl font-normal mt-3'
              initial={{ opacity: 0, position: 'relative', bottom: 50 }}
              animate={{ opacity: 1, bottom: 0 }}
              transition={{ duration: 1, delay: 2, ease: 'backInOut' }}
            >
              Come back tomorrow to extend your streak

            </motion.p>
          </motion.div>
          {showEntries && (
            <motion.ul layout className='flex-1 w-full px-5 pb-5 flex flex-col gap-5'>
              {entries.map((entry, index) => (
                <EntryItem
                  key={entry.id || index}
                  entry={entry}
                  index={index}
                />
              ))}
            </motion.ul>
          )}
        </LayoutGroup>
      </div>
      <motion.div
        className='w-full'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 4, ease: 'backInOut' }}
      >
        <ButtonGlass
          className='w-full p-3 h-15 flex justify-center rounded-none '
          onClick={() => {navigate('/journal')}}
        >
          Return to Journal
          <BookOpenIcon className='ml-3' />
        </ButtonGlass>
      </motion.div>
    </div>
  )
}

export default DailyReview
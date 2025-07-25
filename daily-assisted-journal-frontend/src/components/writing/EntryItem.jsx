import React, { useRef, useState } from 'react'
import { MotionConfig, motion } from 'framer-motion'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'

/**
 * A collapsible entry item component that displays journal entries with expandable responses.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.entry - The entry object containing entry data
 * @param {string} props.entry.type - The type of entry ('mood', 'prompt', or other)
 * @param {Object} props.entry.data - The entry data object
 * @param {string} props.entry.data.selectedMood - The selected mood (for mood entries)
 * @param {string} props.entry.data.promptText - The prompt text (for prompt entries)
 * @param {string} props.entry.data.userResponse - The user's response to the entry
 * @param {number} props.index - The index of the entry in the list
 * 
 * @returns {JSX.Element} A motion-animated list item with expandable content
 * 
 * @example
 * const entry = {
 *   type: 'mood',
 *   data: {
 *     selectedMood: 'happy',
 *     userResponse: 'I had a great day today!'
 *   }
 * };
 * 
 * <EntryItem entry={entry} index={0} />
 */
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

export default EntryItem
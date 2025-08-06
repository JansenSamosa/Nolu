import React, { useContext, useEffect, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { calculateDateWithOffset, formatDateString, formatTimeString, getDayOfWeek } from '../../utils/utils'
import { motion } from 'framer-motion'
import { ClockIcon } from '@heroicons/react/24/outline'
import ButtonGlass from '../ui/ButtonGlass'
import { StreakContext } from '../../App'
import { useNavigate } from 'react-router'

const EntryView = ({ entry }) => {
  let headerText = ""
  const response = entry.data.userResponse

  if (entry.type === 'mood') {
    headerText = `You felt ${entry.data.selectedMood}`
  } else if (entry.type === 'prompt') {
    headerText = entry.data.promptText
  } else {
    headerText = 'Free Write:'
  }

  const createdAtDate = new Date(entry.createdAt)

  return (
    <li className='flex flex-col p-2'>
      <div className='w-fit flex justify-center items-center gap-2 h-fit'>
        <ClockIcon className='h-5 aspect-square' />
        <p className='text-xl'>{formatTimeString(createdAtDate)}</p>
      </div>
      <p className='flex-1 font-bold'>{headerText}</p>
      <div className='flex items-center '>
        <p className=''>{response}</p>
      </div>
    </li>
  )
}

const JournalDayView = ({ dayOffset, adjustDayOffset, entries }) => {
  const navigate = useNavigate()
  const { streakData, setStreakData } = useContext(StreakContext)

  const date = calculateDateWithOffset(dayOffset)
  
  const allowScrollToNextDay = !(dayOffset === 1 || (dayOffset === 0 && entries.length === 0))

  return (
    <div className=' w-full h-full flex flex-col text-2xl'>
      <div className=' w-full flex items-center justify-between h-25  font-bold bg-glass-frost'>
        <button
          className='h-full w-10 cursor-pointer transition-all bg-glass rounded-md rounded-r-none'
          onClick={() => adjustDayOffset(-1)}
        >
          <ChevronLeftIcon />
        </button>
        <div className='flex flex-1 flex-col justify-center items-center'>
          <h1 className='text-4xl'>{getDayOfWeek(date)}</h1>
          <h1 className='font-normal text-2xl'>{formatDateString(date)} 2025</h1>
        </div>
        {allowScrollToNextDay && <button
          className='h-full w-10 cursor-pointer transition-all bg-glass rounded-md rounded-l-none'
          onClick={() => adjustDayOffset(1)}
        >
          <ChevronRightIcon />
        </button>}
      </div>
      <motion.div
        className='w-full flex-1 text-2xl overflow-scroll'
      >
        {/* entries exist and dayOffset < 0 */}
        {entries.length > 0 && dayOffset < 0 && (
          <ul className='flex flex-col my-6 gap-6'>
            {entries.map((entry, index) => (
              <EntryView key={index} entry={entry} />
            ))}
          </ul>
        )}

        {/* no entries and dayOffset < 0 */}
        {entries.length === 0 && dayOffset < 0 && (
          <div className=' my-5 p-5 bg-glass-frost flex flex-col justify-center items-center'>
            No entries on this day...
          </div>
        )}
        {/* entries exist and dayOffset == 0 */}
        {entries.length > 0 && dayOffset === 0 && (
          <ul className='flex flex-col my-6 gap-12'>
            {entries.map((entry, index) => (
              <EntryView key={index} entry={entry} />
            ))}
          </ul>
        )}

        {/* no entries and dayOffset == 0 */}
        {entries.length === 0 && dayOffset === 0 && (
          <div className='flex flex-col justify-center items-center gap-5 h-full mx-10 text-center'>
            <div className='p-2.5 w-full'>
              <p>
                Current Streak: {`${streakData.streak} ${streakData.streak == 1 ? 'day' : 'days'}`}
              </p>
              <p className='text-xl mt-2 '>
                Complete a daily reflection everyday to increase this!
              </p>
            </div>
            <ButtonGlass className='px-10 py-2.5 ' onClick={() => navigate('/daily')}>
              Start Daily Reflection
            </ButtonGlass>
          </div>
        )}
        {/* dayOffst == 1 */}
        {dayOffset == 1 && (
          <div className='flex flex-col justify-center items-center h-full text-center'>
            <div>
              <p>
                Current Streak: {`${streakData.streak} ${streakData.streak == 1 ? 'day' : 'days'}`}
              </p>
              <p className='text-xl mt-2'>
                Come back tomorrow to increase your streak! 
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default JournalDayView
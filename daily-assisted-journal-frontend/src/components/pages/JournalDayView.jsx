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

  return (
    <div className=' w-full h-full flex flex-col text-2xl'>
      <div className=' w-full flex items-center justify-between h-30  font-bold bg-glass '>
        <button
          className='size-15 p-2.5 cursor-pointer hover:size-16 transition-all'
          onClick={() => adjustDayOffset(-1)}
        >
          <ChevronLeftIcon />
        </button>
        <div className='flex flex-1 flex-col justify-center items-center'>
          <h1 className='text-4xl'>{getDayOfWeek(date)}</h1>
          <h1 className='font-normal text-2xl'>{formatDateString(date)} 2025</h1>
        </div>
        <button
          className='size-15 p-2.5 cursor-pointer hover:size-16 transition-all'
          onClick={() => adjustDayOffset(1)}
        >
          <ChevronRightIcon />
        </button>
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
          <div className='flex flex-col justify-center items-center gap-5 h-full'>
            <p>{streakData.streak}</p>
            <ButtonGlass className='p-5 ' onClick={() => navigate('/daily')}> 
              Start Daily Reflection
            </ButtonGlass>
          </div>
        )}
        {/* dayOffst == 1 */}
      </motion.div>
    </div>
  )
}

export default JournalDayView
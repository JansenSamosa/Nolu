import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useFetchEntriesWithCache } from '../../api_handles/entriesHandler'
import ButtonGlass from '../ui/ButtonGlass'
import Header from '../ui/Header'
import AnimatedCarousel from '../ui/AnimatedCarousel'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import EntryItem from '../writing/EntryItem'
import { LayoutGroup, motion } from 'framer-motion'
import { formatDateString, getDayOfWeek, calculateDateWithOffset, getLocalISOString } from '../../utils/utils'
import JournalDayView from './JournalDayView'
import { StreakContext } from '../../App'


const Journal = () => {
  const { streakData, _ } = useContext(StreakContext)

  const navigate = useNavigate()
  const { fetchEntries, loading } = useFetchEntriesWithCache()

  const [visibleEntries, setVisibleEntries] = useState([])
  const [dayOffset, setDayOffset] = useState(0)

  const adjustDayOffset = (adjustment) => {
    const newOffset = Math.min(1, dayOffset + adjustment)
    const newDate = calculateDateWithOffset(newOffset)
    setDayOffset(newOffset)

    const refreshVisibleEntries = async () => {
      setVisibleEntries(await fetchEntries(newDate, newDate))
    }
    refreshVisibleEntries()
  }

  useEffect(() => {
    adjustDayOffset(0)

    // pre-fetch entries for caching purposes
    fetchEntries(calculateDateWithOffset(dayOffset - 10), calculateDateWithOffset(1))
  }, [])

  return !loading && (
    <div className='background-saturated w-screen h-screen
        flex flex-col
    '>
      <Header />
      <div className='flex-1 h-full'>
        <AnimatedCarousel
          position={dayOffset}
          classNameContainer='w-full h-full flex justify-center items-center overflow-hidden'
          classNameContent='h-full w-full md:w-3/4 lg:w-1/2 p-5 pb-0'
        >
          {!loading &&
            <JournalDayView dayOffset={dayOffset} adjustDayOffset={adjustDayOffset} entries={visibleEntries} />
          }
        </AnimatedCarousel>
      </div>
    </div>
  )
}

export default Journal
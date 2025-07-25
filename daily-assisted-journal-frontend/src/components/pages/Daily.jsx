import React, { useEffect, useRef, useState } from 'react'
import PromptCarousel from '../ui/PromptCarousel'
import MoodWrite from '../writing/MoodWrite'
import PromptWrite from '../writing/PromptWrite'
import FreeWrite from '../writing/FreeWrite'
import DailyReview from '../writing/DailyReview'
import { useSaveEntries } from '../../api_handles/entriesHandler'
import { useUpdateStreak } from '../../api_handles/streakHandler'
import { getLocalISOString, word_count } from '../../utils/utils'
import Header from '../ui/Header'


/**
 * Custom hook for managing new journal entries state and handlers
 * @returns {Object} Object containing entry states and their respective handlers
 * @returns {Object} returns.moodEntry - Mood entry state with createdAt and data properties
 * @returns {Object} returns.promptEntry - Prompt entry state with createdAt and data properties  
 * @returns {Object} returns.freeEntry - Free writing entry state with createdAt and data properties
 * @returns {Function} returns.handleMoodEntry - Handler function for updating mood entry data
 * @returns {Function} returns.handlePromptEntry - Handler function for updating prompt entry data
 * @returns {Function} returns.handleFreeEntry - Handler function for updating free entry data
 */
const useNewJournalEntries = () => {
  const [moodEntry, setMoodEntry] = useState({
    createdAt: getLocalISOString(),
    data: {
      selectedMood: '',
      userResponse: ''
    }
  })
  const [promptEntry, setPromptEntry] = useState({
    createdAt: getLocalISOString(),
    data: {
      promptText: '',
      userResponse: ''
    }
  })

  const [freeEntry, setFreeEntry] = useState({
    createdAt: getLocalISOString(),
    data: {
      userResponse: ''
    }
  })

  const handleMoodEntry = newData => {
    setMoodEntry({
      createdAt: !moodEntry.createdAt ? getLocalISOString() : moodEntry.createdAt,
      data: newData
    })
  }

  const handlePromptEntry = newData => {
    setPromptEntry({
      createdAt: !promptEntry.createdAt ? getLocalISOString() : promptEntry.createdAt,
      data: newData
    })
  }

  const handleFreeEntry = newData => {
    setFreeEntry({
      createdAt: !freeEntry.createdAt ? getLocalISOString() : freeEntry.createdAt,
      data: newData
    })
  }

  return {
    moodEntry,
    promptEntry,
    freeEntry,
    handleMoodEntry,
    handlePromptEntry,
    handleFreeEntry
  }
}

/**
 * Daily journaling component that manages the multi-stage writing process
 * 
 * This component orchestrates a three-stage journaling experience:
 * 1. Mood writing - User selects mood and writes about it
 * 2. Prompt writing - User responds to a daily prompt
 * 3. Free writing - User writes freely without constraints
 * 
 * After completing all stages, displays a review of completed entries.
 * Automatically saves entries and updates user streak when all stages are completed.
 * 
 * @component
 * @returns {JSX.Element} The daily journaling interface
 */
const Daily = () => {
  const started = useRef(getLocalISOString())

  const { saveEntries } = useSaveEntries()
  const { patchStreak } = useUpdateStreak()

  const [stageIndex, setStageIndex] = useState(0)

  const {
    moodEntry,
    promptEntry,
    freeEntry,
    handleMoodEntry,
    handlePromptEntry,
    handleFreeEntry
  } = useNewJournalEntries()


  const goToNextEntry = () => {
    const nextStage = Math.max(stageIndex + 1, 0)

    if (nextStage > 2) {
      const newEntries = [
        { type: 'mood', createdAt: moodEntry.createdAt, data: moodEntry.data },
        { type: 'prompt', createdAt: promptEntry.createdAt, data: promptEntry.data },
        { type: 'free', createdAt: freeEntry.createdAt, data: freeEntry.data }
      ]
      saveEntries(newEntries)
      patchStreak(started.current).then(() => setStageIndex(nextStage))
    } else {
      setStageIndex(nextStage)
    }
  }

  const getCompletedEntries = () => {
    const completedEntries = []

    if (moodEntry.data.selectedMood && word_count(moodEntry.data.userResponse) >= 20) {
      completedEntries.push({ type: 'mood', createdAt: moodEntry.createdAt, data: moodEntry.data })
    }

    if (promptEntry.data.promptText && word_count(promptEntry.data.userResponse) >= 20) {
      completedEntries.push({ type: 'prompt', createdAt: promptEntry.createdAt, data: promptEntry.data })
    }

    if (word_count(freeEntry.data.userResponse) >= 20) {
      completedEntries.push({ type: 'free', createdAt: freeEntry.createdAt, data: freeEntry.data })
    }

    return completedEntries
  }

  return (
    <div className='
      text-center 
      background-saturated
      flex flex-col
      h-screen w-screen
    '>
      <Header />
      {stageIndex != 3 ? <>
        {/* prompt container */}
        <div className='flex-1'>
          <PromptCarousel index={stageIndex}>
            <MoodWrite response={moodEntry.data} setResponse={handleMoodEntry} goToNextEntry={goToNextEntry} />
            <PromptWrite response={promptEntry.data} setResponse={handlePromptEntry} goToNextEntry={goToNextEntry} />
            <FreeWrite response={freeEntry.data} setResponse={handleFreeEntry} goToNextEntry={goToNextEntry} />
          </PromptCarousel>
        </div>
      </> :
        <DailyReview entries={getCompletedEntries()} />
      }
    </div>
  )
}

export default Daily
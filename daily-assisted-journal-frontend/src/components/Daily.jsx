import React, { useContext, useEffect, useState } from 'react'
import PromptCarousel from './PromptCarousel'
import ButtonGlass from './ButtonGlass'
import MoodWrite from './MoodWrite'
import PromptWrite from './PromptWrite'
import FreeWrite from './FreeWrite'
import DailyReview from './DailyReview'
import { useSaveEntries } from '../api_handles/entriesHandler'
import { staticDataContext } from '../App'
import { ArrowLeftCircleIcon, ArrowLeftIcon, ArrowRightCircleIcon, ArrowRightEndOnRectangleIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

const Daily = ({ date = new Date() }) => {
  const { saveEntries } = useSaveEntries()
  const { prompts, moods } = useContext(staticDataContext)

  const [stageIndex, setStageIndex] = useState(0)

  const [moodResponse, setMoodResponse] = useState({
    selectedMood: '',
    userResponse: ''
  })

  const [promptResponse, setPromptResponse] = useState({
    promptText: '',
    userResponse: ''
  })

  const [freeResponse, setFreeResponse] = useState({
    userResponse: ''
  })
  
  const randomizePrompt = () => {
    const randIndex = Math.floor(Math.random() * prompts.length)
    const selectedPrompt = prompts[randIndex]
    console.log(selectedPrompt)
    setPromptResponse(prev => ({
      ...prev,
      promptText: selectedPrompt
    }))
  }

  useEffect(() => {
    randomizePrompt()
  }, [])

  useEffect(() => {
    const clamped = Math.max(stageIndex, 0)
    setStageIndex(clamped)

    if (stageIndex > 2) {
      const temp = new Date()
      const createdAt = temp.toLocaleDateString()
      console.log(createdAt)

      const newEntries = [
        { type: 'mood', createdAt, data: moodResponse },
        { type: 'prompt', createdAt, data: promptResponse },
        { type: 'free', createdAt, data: freeResponse }
      ]

      saveEntries(newEntries)
    }
  }, [stageIndex])

  const goToNextEntry = () => {
    setStageIndex(stageIndex + 1)
  }

  return (
    <div className='
      text-center 
      overflow-hidden  
      background-saturated
      flex flex-col
      h-screen w-screen
    '>
      <div className='
         p-3
         shadow-lg bg-white/10 flex items-center justify-between
         h-15
         '
      >
        <h1 className='text-4xl font-bold text-color-main-title text-shadow-md'> Nolu </h1>
      </div>
      {stageIndex != 3 ? <>
        {/* prompt container */}
        <div className='flex-1'>
          <PromptCarousel index={stageIndex}>
            <MoodWrite response={moodResponse} setResponse={setMoodResponse} goToNextEntry={goToNextEntry}/>
            <PromptWrite response={promptResponse} setResponse={setPromptResponse} goToNextEntry={goToNextEntry}/>
            <FreeWrite response={freeResponse} setResponse={setFreeResponse} goToNextEntry={goToNextEntry}/>
          </PromptCarousel>
        </div>
      </> :
        <DailyReview moodData={moodResponse} promptData={promptResponse} freeData={freeResponse} />
      }
    </div>
  )
}

export default Daily
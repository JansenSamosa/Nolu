import React, { useContext, useEffect, useState } from 'react'
import PromptCarousel from './PromptCarousel'
import ButtonGlass from './ButtonGlass'
import { MoodContext } from '../App'
import MoodWrite from './MoodRight'
import PromptWrite from './PromptWrite'
import FreeWrite from './FreeWrite'
import DailyReview from './DailyReview'
import { saveEntry } from '../api'

const Daily = ({ date = new Date() }) => {
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

  useEffect(() => {
    const clamped = Math.max(stageIndex, 0)
    setStageIndex(clamped)

    if (stageIndex > 2) {
      const temp = new Date()
      const createdAt = temp.toJSON()

      const saveEntries = async () => {
        await saveEntry(createdAt, moodResponse, 'mood')
        await saveEntry(createdAt, promptResponse, 'prompt')
        await saveEntry(createdAt, freeResponse, 'free')
      }
      saveEntries()
    }
  }, [stageIndex])

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
         shadow-lg bg-white/10 flex items-end justify-between'
      >
        <h1 className='text-4xl font-bold text-color-main-title text-shadow-md'> Nolu </h1>
      </div>
      {stageIndex != 3 ? <>
        {/* prompt container */}
        <div className='flex-1'>
          <PromptCarousel index={stageIndex}>
            <MoodWrite response={moodResponse} setResponse={setMoodResponse} />
            <PromptWrite response={promptResponse} setResponse={setPromptResponse} />
            <FreeWrite response={freeResponse} setResponse={setFreeResponse} />
          </PromptCarousel>
        </div>

        {/* buttons */}
        <div className='w-full p-3 flex  gap-5 px-5'>
          <ButtonGlass
            onClick={() => setStageIndex(stageIndex - 1)}
            className={`flex-1 text-xl font-bold p-3`}
            clickable={stageIndex == 0 ? false : true}
          >
            Back
          </ButtonGlass>
          <ButtonGlass
            onClick={() => setStageIndex(stageIndex + 1)}
            className='flex-1 text-xl font-bold p-3'
          >
            {stageIndex < 2 ? `Next (${stageIndex + 1}/3)` : `Finish (${stageIndex + 1}/3)`}
          </ButtonGlass>
        </div>
      </> :
        <DailyReview moodData={moodResponse} promptData={promptResponse} freeData={freeResponse}/>
      }
    </div>
  )
}

export default Daily
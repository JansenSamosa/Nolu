import React, { useContext, useEffect, useState } from 'react'
import PromptCarousel from './PromptCarousel'
import ButtonGlass from './ButtonGlass'
import { MoodContext } from '../App'
import MoodWrite from './MoodRight'
import PromptWrite from './PromptWrite'
import FreeWrite from './FreeWrite'

const Daily = ({ date = new Date() }) => {
  const [stageIndex, setStageIndex] = useState(0)

  const [moodResponse, setMoodResponse] = useState({
    selectedMood: '',
    userResponse: ''
  })

  const [promptResponse, setPromptResponse] = useState({
    promptText: '',
    userResponse:''
  })

  const [freeResponse, setFreeResponse] = useState({
    userResponse:''
  })

  useEffect(() => {
    const clamped = Math.max(stageIndex, 0)
    setStageIndex(clamped)
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
        {/* <nav className='flex flex-1 justify-end gap-2'>
          <h1 className='text-color-main-title font-bold text-[1.2rem] text-shadow-md  text-center'>
            Daily 
          </h1>
        </nav> */}
      </div>

      {/* prompt container */}
      <div className='flex-1'>
        <PromptCarousel index={stageIndex}>
          <MoodWrite response={moodResponse} setResponse={setMoodResponse}/>
          <PromptWrite response={promptResponse} setResponse={setPromptResponse}/>
          <FreeWrite response={freeResponse} setResponse={setFreeResponse}/>
        </PromptCarousel>
      </div>

      {/* buttons */}
      <div className='w-full p-3 flex  gap-5 px-5'>
        <ButtonGlass onClick={() => setStageIndex(stageIndex - 1)}
          className={`flex-1 text-xl font-bold p-3`} 
          clickable={stageIndex == 0 ? false : true}
        >
          Back
        </ButtonGlass>
        <ButtonGlass onClick={() => setStageIndex(stageIndex + 1)}
          className='flex-1 text-xl font-bold p-3'
        >
          Next
        </ButtonGlass>
      </div>
    </div>
  )
}

export default Daily
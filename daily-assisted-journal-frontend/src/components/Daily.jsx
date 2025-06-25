import React, { useEffect, useState } from 'react'
import PromptCarousel from './PromptCarousel'
import PromptText from './PromptText'
import ButtonGlass from './ButtonGlass'

const Daily = ({ date = new Date() }) => {
  const [curPrompt, setCurPrompt] = useState(4)

  useEffect(() => {
    const clamped = Math.max(curPrompt, 0)
    setCurPrompt(clamped)
  }, [curPrompt])

  return (
    <div className='
      text-center 
      shadow overflow-hidden  
      background-saturated
      relative
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
        <PromptCarousel index={curPrompt}>
          {/* mood selection */}
          <div className='mt-3 bg-white/30 shadow rounded-xl overflow-hidden'>
            <p className='text-2xl shadow'>How was your mood today?</p>
            <div className=' w-full m-auto p-2 flex'>
              {['😌', '😐', '🙂', '😄', '👎', '👍'].map((emoji, index) => (
                <button
                  key={index}
                  className='text-3xl p-2 
                    cursor-pointer 
                    hover:bg-white/50 
                    rounded-full 
                    transition
                    flex-1/2'
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <PromptText prompt='What’s one small win you had today?' />
          <PromptText prompt="Is there anything bothering you today?" />
          <PromptText prompt='Learn anything new?' />
          <PromptText prompt='Free write: ' rows={12} />
          <PromptText prompt='What would your ideal tomorrow look like?' />
        </PromptCarousel>
      </div>

      {/* buttons */}
      <div className='w-full p-3 flex gap-2 items-center justify-center'>

        <ButtonGlass onClick={() => setCurPrompt(curPrompt - 1)}
          className='w-45 text-xl font-bold'
        >
          Back
        </ButtonGlass>
        <ButtonGlass onClick={() => setCurPrompt(curPrompt + 1)}
          className='w-45 text-xl font-bold'
        >
          Next
        </ButtonGlass>
      </div>
    </div>
  )
}

export default Daily
import React, { useContext, useEffect, useState } from 'react'
import { MoodContext } from '../App'

const MoodWrite = ({ className, response, setResponse }) => {
  const moods = useContext(MoodContext)

  // selected mood
  const [selected, setSelected] = useState(response.selectedMood)
  const [explanation, setExplanation] = useState(response.userResponse)

  useEffect(() => {
    setResponse({
      selectedMood: selected,
      userResponse: explanation,
    })
  }, [selected, explanation])

  return (
    <div className={`${className} text-2xl flex flex-col h-full
    `}>
      <div className={`flex-6 flex items-end transition-all
      ${selected ? 'opacity-0' : 'opacity-100'}
      `}>
        <p className='flex-1 rounded-b-none p-2 '>How are you feeling?</p>
      </div>
      <div className='flex flex-1 items-center justify-between p-3 transition-all'>
        {moods.map((item, index) => (
          <button
            className={`text-3xl cursor-pointer rounded-full
             transition-all p-3
            ${item == selected && 'bg-white/20 shadow text-4xl'}`}
            onClick={() => { selected != item ? setSelected(item) : setSelected('') }}
          >
            {item}
          </button>
        ))}
      </div>
      <div className={`flex-6 transition-opacity duration-300
        ${selected ? 'opacity-100' : 'opacity-0'}`}>
        <p>Why?</p>
        <textarea
          className='flex-1  resize-none rounded-xl p-3 focus:outline-none size-full'
          placeholder='Write here...'
          value={explanation}
          onChange={e => setExplanation(e.target.value)}
        />
      </div>

    </div>
  )
}

export default MoodWrite
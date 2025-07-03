import React, { useContext, useEffect, useState } from 'react'
import { staticDataContext } from '../../App'
import ButtonGlass from '../ui/ButtonGlass'
import { ArrowLongRightIcon, PencilIcon } from '@heroicons/react/24/outline'
import { word_count } from '../../utils/utils'
import { DocumentTextIcon } from '@heroicons/react/24/solid'

const MoodWrite = ({ className, response, setResponse, goToNextEntry }) => {
  const { moods, prompts } = useContext(staticDataContext)

  // selected mood
  const [selected, setSelected] = useState(response.selectedMood)
  const [explanation, setExplanation] = useState(response.userResponse)

  const [explanationWordCount, setExplanationWordCount] = useState(0)

  const meetsWordCount = () => explanationWordCount >= 10

  useEffect(() => {
    setExplanationWordCount(word_count(explanation))
    setResponse({
      selectedMood: selected,
      userResponse: explanation,
    })
  }, [selected, explanation])

  return (
    <div className={`${className} text-2xl flex flex-col items-center h-full w-full ${!selected ? 'overflow-hidden' : ''}`}>
      <div className={`flex items-end transition-all my-5
      ${selected ? 'opacity-100' : 'opacity-100'}
      `}>
        <p className='flex-1  rounded-b-none '>How are you feeling?</p>
      </div>
      <div className='flex items-center justify-center  flex-wrap  transition-all '>
        {moods.map((item, index) => (
          <button
            className={`text-4xl cursor-pointer grow-1 rounded-full transition-all p-1 aspect-square
            ${item == selected && 'bg-white/20 shadow text-4xl'}`}
            onClick={() => { selected != item ? setSelected(item) : setSelected('') }}
          >
            {item}
          </button>
        ))}
      </div>
      <p className={`transition-opacity duration-300 my-5
        ${selected ? 'opacity-100' : 'opacity-0'}`}
      >
        Why?
      </p>
      <textarea
        disabled={!selected}
        className={`flex-1  resize-none rounded-xl focus:outline-none 
            transition-opacity duration-300 w-11/12  
            ${selected ? 'opacity-100' : 'opacity-0'}`}
        placeholder='Write here...'
        value={explanation}
        onChange={e => setExplanation(e.target.value)}
      />
      <div className={` mt-5 h-15 w-full flex justify-center `}>
        <div className={` bg-glass text-xl rounded-none flex-2
            flex justify-center items-center p-4 transition-all duration-300 
            ${selected ? 'opacity-100' : 'opacity-0'}`}
        >
          <PencilIcon className='h-full mx-2' />
          <p className=''>
            {explanationWordCount + (!meetsWordCount() ? ' / 10' : '')}
          </p>
        </div>
        <ButtonGlass
          className={`flex-2 rounded-none h-full flex items-center justify-center p-2
                transition-all duration-300 
                ${meetsWordCount() ? 'opacity-100' : 'opacity-0 fixed'}
            `}
          onClick={goToNextEntry}
          clickable={meetsWordCount()}
        >
          <ArrowLongRightIcon strokeWidth={1} className='h-full' />
        </ButtonGlass>
      </div>
    </div>
  )
}

export default MoodWrite

// ${word_count(explanation) >= 10 ? 'opacity-100' : 'opacity-0'}
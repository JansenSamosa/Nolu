import React, { useContext } from 'react'
import ButtonGlass from '../ui/ButtonGlass'
import { useNavigate } from 'react-router'

const DailyReview = ({ entries, moodData, promptData, freeData }) => {
  const navigate = useNavigate()

  return (
    <div className='flex flex-col text-2xl overflow-auto size-full'>
      <p className='bg-glass rounded-b-none py-5 shadow-xl'>New Streak: 5</p>
      <ul className='flex flex-col gap-5 mx-5 overflow-scroll flex-10'>
        <li className='bg-glass'>
          <p className='bg-glass p-3 rounded-b-none'>
            You felt like this: {moodData.selectedMood}
          </p>
          <p className='p-2'>{moodData.userResponse}</p>
        </li>
        <li className='bg-glass'>
          <p className='bg-glass p-3 rounded-b-none'>
            {promptData.promptText}
          </p>
          <p className='p-2'>{promptData.userResponse}</p>
        </li>
        <li className='bg-glass'>
          <p className='bg-glass p-3 rounded-b-none'>
            Free Writing
          </p>
          <p className='p-2'>{freeData.userResponse}</p>
        </li>
      </ul>
      <ButtonGlass onClick={() => navigate('/journal')}
        className='p-5 rounded-none'
        >
        Go To Journal
      </ButtonGlass>
    </div>

  )
}

export default DailyReview
import React, { useEffect, useState } from 'react'
import ButtonGlass from '../ui/ButtonGlass'
import { word_count } from '../../utils/utils'

const FreeWrite = ({ className, response, setResponse}) => {
  const [userResponse, setUserResponse] = useState(response.userResponse)

  useEffect(() => {
    setResponse({
      userResponse
    })
  }, [userResponse])
  
  return (
    <div className={`${className} text-2xl size-full flex flex-col items-center`}>
      <div className=' w-full flex items-center justify-center'>
        <p className='my-3 p-4 max-w-8/12'>
          Free Write: Write what's on your mind.
        </p>
      </div>
      <div className='flex-1 w-full h-full p-4 pt-0 '>
        <textarea
          className=' 
          w-full h-full
          focus:outline-none resize-none '
          value={userResponse}
          onChange={e => setUserResponse(e.target.value)}
        />
      </div>
    </div>
  )
}

export default FreeWrite
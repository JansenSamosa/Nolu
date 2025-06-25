import React from 'react'

const PromptCarousel = ({ children, index = 0 }) => {
  return (
    <div key={index} className='h-full flex items-center justify-center'>
        {children[index]}
    </div>
  )
}

export default PromptCarousel
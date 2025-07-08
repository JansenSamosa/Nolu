import React from 'react'

const Textarea = ({
  value,
  onChange,
}) => {
  return (
    <div
      className='size-full px-5'
    >
      <textarea
        value={value}
        onChange={onChange}
        placeholder='Write here...'
        className='w-full h-full focus:outline-none resize-none md:w-3/4'
      />
    </div>
  )
}

export default Textarea
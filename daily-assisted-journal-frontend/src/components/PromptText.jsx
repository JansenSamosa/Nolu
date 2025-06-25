import React, { useEffect, useRef } from 'react'

const PromptText = ({ prompt='err prompt not defined', rows=4, characters=400 }) => {
  const ref = useRef(null)

  return (
    <div ref={ref} className={`mx-10 bg-slate-600 text-slate-300
    shadow rounded-xl overflow-hidden 
    w-full md:w-8/12 xl:w-1/2
    `}>
      <p className='text-2xl shadow p-2 bg-white/10'>{prompt}</p>
      <textarea
        placeholder='Start writing here...'
        rows={rows}
        className={`
          w-full
          border-none rounded-xl 
          px-4 py-2 
          resize-none focus:outline-none 
          overflow-
          text-xl
          `}
      />
    </div>
  )
}

export default PromptText
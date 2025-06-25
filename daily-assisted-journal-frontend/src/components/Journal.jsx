import React, { useEffect, useState } from 'react'
import ButtonGlass from './ButtonGlass'
import { useNavigate } from 'react-router'

const Journal = () => {
  const navigate = useNavigate()

  const [days, setDays] = useState([new Date(), new Date(), new Date(), new Date(), new Date()
    , new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()
    , new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()
  ])

  const [streak, setStreak] = useState(4)
  return (
    <div className='background-saturated w-screen h-screen
        flex flex-col
    '>
      <div className='
         p-3
         shadow-lg bg-white/10 flex items-end justify-between'
      >
        <h1 className='text-4xl font-bold text-color-main-title text-shadow-md'> Nolu </h1>
        <nav className='flex flex-1 justify-end gap-2'>
          <h1 className='text-color-main-title font-bold text-[1.2rem] text-shadow-md  text-center'>
            Home
          </h1>
          <h1 className='text-color-main-title font-bold text-[1.2rem] text-shadow-md text-center
             '
          >
            Journal
          </h1>
          <h1 className='text-color-main-title font-bold text-[1.2rem] text-shadow-md  text-center'>
            Account
          </h1>
        </nav>
      </div>
      <div className='overflow-auto'>
        <ul className='overflow-y-scroll m-3 h-full '>
          {days.map((d, index) => (
            <li key={index}>
              <ButtonGlass className='w-23/24 m-auto text-2xl mb-6 p-0 font-bold flex flex-col shadow-black/15'>
                <p className='rounded-2xl rounded-b-none p-2 bg-slate-500/10'>
                😃 {d.toLocaleDateString()}
                </p>
                <div className='flex m-2'>
                  <p className='font-normal'>
                  
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas, qui!
                  </p>
                </div>

              </ButtonGlass>
            </li>
          ))}
        </ul>
      </div>
      <div className='p-3 flex items-end justify-between font-bold lg:justify-start text-xl gap-2 bg-sky/10'>
        <ButtonGlass className='p-1 flex-1'>
          Write
        </ButtonGlass>
        <ButtonGlass className='p-1 flex-2' onClick={() => navigate('/daily')}>
          Start Daily
        </ButtonGlass>
        <p className='p-1 flex-1 text-center text-nowrap'>Streak: {streak}</p>
      </div>
    </div>
  )
}

export default Journal
import React, { createContext, useContext, useEffect, useState } from 'react'
import Daily from './components/Daily'
import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './components/Home'
import Journal from './components/Journal'
import { fetchMoods } from './api'

export const MoodContext = createContext()
export const StreakContext = createContext()

const App = () => {
  const [moods, setMoods] = useState([])
  const [streakData, setStreakData] = useState(0)

  useEffect(() => {
    fetchMoods().then(setMoods)
    setStreakData({
      streak: 4,
      completedToday: false
    })
  }, [])

  useEffect(() => {
    console.log(moods)
  }, [moods])

  return (
    <div className='font-display text-color-main'>
      <MoodContext value={moods}>
        <StreakContext value={streakData}>
          <BrowserRouter>
            <Routes>
              <Route index element={<Home />} />
              <Route path='/daily' element={<Daily />} />
              <Route path='/journal' element={<Journal />} />
            </Routes>
          </BrowserRouter>
        </StreakContext>
      </MoodContext>
    </div>
  )
}

export default App
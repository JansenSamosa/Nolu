import React, { createContext, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './components/pages/Home'
import Journal from './components/pages/Journal'
import Daily from './components/pages/Daily'
import Login from './components/pages/Login'
import Register from './components/pages/Register'
import { fetchMoods } from './api'
import { auth, onAuthStateChanged } from './firebase.js'
import axios from 'axios'
import Test from './components/pages/Test.jsx'

export const AuthContext = createContext()
export const StaticDataContext = createContext()
export const StreakContext = createContext()

const useUserData = () => {
  const [user, setUser] = useState(null)
  const [staticData, setStaticData] = useState({
    prompts: [],
    moods: []
  })
  const [streakData, setStreakData] = useState({
    streak: 0,
    lastStreakDate: null
  })

  useEffect(() => {
    console.log(streakData)
  }, [streakData])

  return { user, staticData, streakData, setUser, setStaticData, setStreakData }
}

const App = () => {
  const {
    user,
    staticData,
    streakData,
    setUser,
    setStaticData,
    setStreakData
  } = useUserData()

  const [loading, setLoading] = useState(true)

  const fetchUserData = async (user) => {
    const response = await axios.get('http://127.0.0.1:5000/dashboard', {
      headers: {
        Authorization: `Bearer ${await user.getIdToken()}`
      }
    })
    setStaticData({
      prompts: response.data.prompts,
      moods: response.data.moods
    })
    setStreakData({
      streak: response.data.streak,
      lastStreakDate: response.data.lastStreakDate
    })
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        const initUser = async () => {
          setUser(user)
          await fetchUserData(user)
          setLoading(false)
        }
        initUser()
      } else {
        console.log("No logged in user")
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className='font-display text-color-main hide-scrollbar'>
      {loading ?
        <div className='background-saturated w-screen h-screen flex justify-center items-center'>
        </div> :
        <AuthContext.Provider value={user} >
          <StaticDataContext.Provider value={staticData}>
            <StreakContext.Provider value={{ streakData, setStreakData }}>
              <BrowserRouter>
                <Routes>
                  <Route index element={<Home />} />
                  <Route path='/login' element={<Login />} />
                  <Route path='/register' element={<Register />} />
                  <Route path='/daily' element={<Daily />} />
                  <Route path='/journal' element={<Journal />} />
                  <Route path='/test' element={<Test />} />
                </Routes>
              </BrowserRouter>
            </StreakContext.Provider>
          </StaticDataContext.Provider>
        </AuthContext.Provider>}
    </div>
  )
}

export default App
import React, { createContext, useContext, useEffect, useState } from 'react'
import Daily from './components/Daily'
import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './components/Home'
import Journal from './components/Journal'
import { fetchMoods } from './api'
import Login from './components/Login'
import Register from './components/Register'
import { auth, onAuthStateChanged } from './firebase.js'
import axios from 'axios'

export const MoodContext = createContext()
export const StreakContext = createContext()
export const AuthContext = createContext()

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


  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const getUserInfo = async (user) => {
    const response = await axios.get('http://127.0.0.1:5000/user', {
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`
        }
      }
    )
    console.log(response.data)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        const initUser = async () => {
          setUser(user)
          await getUserInfo(user)
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
    <div className='font-display text-color-main'>
      {loading ?
        <div className='background-saturated w-screen h-screen flex justify-center items-center'>
        </div> :
        <AuthContext.Provider value={user} >
          <MoodContext value={moods}>
            <StreakContext value={streakData}>
              <BrowserRouter>
                <Routes>
                  <Route index element={<Home />} />
                  <Route path='/login' element={<Login />} />
                  <Route path='/register' element={<Register />} />
                  <Route path='/daily' element={<Daily />} />
                  <Route path='/journal' element={<Journal />} />
                </Routes>
              </BrowserRouter>
            </StreakContext>
          </MoodContext>
        </AuthContext.Provider>}
    </div>
  )
}

export default App
import React, { createContext, useContext, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './components/pages/Home'
import Journal from './components/pages/Journal'
import Daily from './components/pages/Daily'
import Login from './components/pages/Login'
import Register from './components/pages/Register'
import { fetchMoods } from './api'
import { auth, onAuthStateChanged } from './firebase.js'
import axios from 'axios'

export const AuthContext = createContext()
export const staticDataContext = createContext()

const App = () => {
  const [user, setUser] = useState(null)
  const [staticData, setStaticData] = useState({
    prompts: [],
    moods: []
  })

  const [loading, setLoading] = useState(true)

  const getUserInfo = async (user) => {
    const response = await axios.get('http://127.0.0.1:5000/dashboard', {
      headers: {
        Authorization: `Bearer ${await user.getIdToken()}`
      }
    })
    setStaticData({
      prompts: response.data.prompts,
      moods: response.data.moods
    })
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
          <staticDataContext.Provider value={staticData}>
            <BrowserRouter>
              <Routes>
                <Route index element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/daily' element={<Daily />} />
                <Route path='/journal' element={<Journal />} />
              </Routes>
            </BrowserRouter>
          </staticDataContext.Provider>
        </AuthContext.Provider>}
    </div>
  )
}

export default App
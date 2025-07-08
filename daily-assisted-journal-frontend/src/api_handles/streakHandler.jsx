import React, { useContext } from 'react'
import { AuthContext, StreakContext } from '../App'
import axios from 'axios'

const baseURL = 'http://127.0.0.1:5000/streak'

export const useUpdateStreak = () => {
  const user = useContext(AuthContext)
  const { streakData, setStreakData } = useContext(StreakContext)

  const patchStreak = async (lastStreakDate) => {
    console.log(lastStreakDate)
    try {
      const response = await axios.patch(baseURL, { lastStreakDate }, {
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`
        }
      })
      setStreakData({
        streak: response.data.streak,
        lastStreakDate: response.data.lastStreakDate
      })
    } catch (err) {
    console.log(err)
  }
}

return { patchStreak }
}


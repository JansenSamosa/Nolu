// This is a custom hook that encapsulates fetching and caching API requests for journal entries

import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../App'
import { generateSampleEntries } from '../utils/generateSampleData'
import { getLocalISOString } from '../utils/utils'

const baseURL = 'http://127.0.0.1:5000/entries'

export const useFetchEntriesWithCache = () => {
  const user = useContext(AuthContext)

  const [loading, setLoading] = useState(true)

  const fetchEntries = async (from, to) => {
    const endpoint = () => {
      const start = from.toLocaleDateString('en-CA') // Returns YYYY-MM-DD format
      const end = to.toLocaleDateString('en-CA')
      const url = `${baseURL}?start=${start}&end=${end}`

      return url
    }

    setLoading(true);
    let entries = []

    try {
      const response = await axios.get(endpoint(), {
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`
        }
      });
      entries = response.data.entries
    } catch (err) {
      entries = null
      console.log(err.message)
    } finally {
      setLoading(false);
    }

    // DEV: Return sample entries if none exist
    if (!entries || entries.length === 0) {
      console.log('No entries found, returning sample data for the requested date...')
      const sampleEntries = generateSampleEntries(from)
      console.log(`Generated ${sampleEntries.length} sample entries for ${from.toDateString()}`)
      return sampleEntries
    }

    return entries
  }

  return { fetchEntries }
}

export const useSaveEntries = () => {
  const user = useContext(AuthContext)

  const saveEntries = async (entries) => {
    try {
      const response = await axios.post(baseURL, entries, {
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
  return { saveEntries }
}

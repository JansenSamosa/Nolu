// This is a custom hook that encapsulates fetching and caching API requests for journal entries

import axios from 'axios'
import React, { cache, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../App'
import { generateSampleEntries } from '../utils/generateSampleData'
import { getLocalISOString } from '../utils/utils'

const baseURL = `${import.meta.env.VITE_API_BASE_URL}/entries`

// key: dateString in en-CA format
// value: {
//  data: ...
//  dirty: ... (false or true)
// }
const entriesCache = {}
const addDateToCache = (date, entries) => {
  const dateString = date.toLocaleDateString('en-CA')
  entriesCache[dateString] = {
    data: entries,
    dirty: false
  }
}

const setCacheEntries = (from, to, entries) => {
  // create cache entries for each date
  for (let currentDate = new Date(from); currentDate <= to; currentDate.setDate(currentDate.getDate() + 1)) {
    const cacheKey = currentDate.toLocaleDateString('en-CA')
    entriesCache[cacheKey] = {
      data: [],
      dirty: false
    }
  }
  // append journal entries across cache
  entries.forEach(entry => {
    const createdAtDate = new Date(entry.createdAt)
    const cacheKey = createdAtDate.toLocaleDateString('en-CA')
    entriesCache[cacheKey].data.push(entry)
  })
}

/**
 * Checks if any cached entries within a date range are marked as dirty (invalid).
 * Iterates through each date from the start date to the end date (inclusive) and
 * examines the corresponding cache entry to determine if it needs to be refreshed.
 *
 * @param {Date|string} from - The start date of the range to check
 * @param {Date|string} to - The end date of the range to check (inclusive)
 * @returns {boolean} True if any cached entry in the date range is dirty, false otherwise
 */
const checkCacheInvalidity = (from, to) => {
  for (let currentDate = new Date(from); currentDate <= to; currentDate.setDate(currentDate.getDate() + 1)) {
    const dateString = currentDate.toLocaleDateString('en-CA')
    const cachedEntry = entriesCache[dateString]

    if (!(dateString in entriesCache) || cachedEntry.dirty) {
      return true
    }
  }
  return false
}

const getEntriesFromCache = (from, to) => {
  const entries = []
  for (let currentDate = new Date(from); currentDate <= to; currentDate.setDate(currentDate.getDate() + 1)) {
    const dateString = currentDate.toLocaleDateString('en-CA')

    if (dateString in entriesCache) {
      const cachedEntry = entriesCache[dateString]
      entries.push(...cachedEntry.data)
    }
  }
  return entries
}

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
    const apiEndpoint = endpoint()
    let entries = []
    // grab from cache if applicable
    if (!checkCacheInvalidity(from, to)) {
      console.log('grabbing entries from cache')
      entries = getEntriesFromCache(from, to)
    } else {
      try {
        const response = await axios.get(apiEndpoint, {
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

      // // DEV: Return sample entries if none exist (but not for current date)
      // if (!entries || entries.length === 0) {
      //   const today = new Date()
      //   const isToday = from.toLocaleDateString() === today.toLocaleDateString()

      //   entries = isToday ? [] : generateSampleEntries(from);
      // }
      setCacheEntries(from, to, entries)
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

      // Invalidate cache entries for the saved entries
      entries.forEach(entry => {
        const createdAtDate = new Date(entry.createdAt)
        const dateString = createdAtDate.toLocaleDateString('en-CA')
        if (dateString in entriesCache) {
          entriesCache[dateString].dirty = true
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
  return { saveEntries }
}

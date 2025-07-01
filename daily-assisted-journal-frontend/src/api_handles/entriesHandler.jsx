// This is a custom hook that encapsulates fetching and caching API requests for journal entries

import axios from 'axios'
import React, { useEffect, useState } from 'react'

const baseURL = 'http://127.0.0.1:5000/entries'

export const useFetchEntriesWithCache = () => {
    const [entries, setEntries] = useState([])
    const [from, setFrom] = useState(() => {
        // set initial from date to be a week ago
        const date = new Date()
        date.setDate(date.getDate() - 7)
        return new Date(date)
    })
    const [to, setTo] = useState(new Date())

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);

    const endpoint = () => {
        const start = from.toISOString().split('T')[0]
        const end = to.toISOString().split('T')[0]
        const url = `${baseURL}?start=${start}&end=${end}`
        return url
    }

    const fetchEntries = async () => {
        try {
            setLoading(true);
            const response = await axios.get(endpoint());
            setEntries(response.data.entries);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEntries()
    }, [])

    useEffect(() => {
        fetchEntries()
    }, [from, to])

    return { entries, loading, error }
}

export const saveEntries = async (entries) => {
    try {
        const response = await axios.post(baseURL, entries)
        console.log(response)
    } catch (err) {
        console.log(err)
    }
}
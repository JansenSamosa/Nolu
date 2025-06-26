let entries = []

export const fetchMoods = async () => {
  const res = await fetch('/mock_data.json')

  if (!res.ok) {
    throw new Error('Failed to fetch moods')
  }

  const json = await res.json()
  return json.moods
}

export const fetchEntries = async () => {
  if (!entries) {
    return entries
  }

  const res = await fetch('/mock_data.json')

  if (!res.ok) {
    throw new Error('Failed to fetch moods')
  }

  const json = await res.json()
  entries = json.entries
  return entries
}

export const saveEntry = async (createdAt, newEntryData, type) => {
  const newEntry = {
    type,
    createdAt,
    data: newEntryData
  }
}
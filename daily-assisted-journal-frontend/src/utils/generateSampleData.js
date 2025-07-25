// Development utility to generate sample journal entries
// Run this in the browser console or call from a component during development

const moods = [
    "happy",
    "calm",
    "excited",
    "content",
    "relaxed",
    "joyful",       
    "optimistic",   
    "grateful",     
    "bored",
    "sad",
    "tired",
    "angry",
    "nervous",
    "anxious",
    "depressed",    
    "frustrated",   
]

const prompts = [
  "What's one small win you had today?",
  "Explain one thing that holds you back.",
  "Where do you see yourself one year from now?",
  "Name one thing causing you stress right now and explain how you plan on dealing with it",
  "What would your ideal tomorrow look like?",
  "Describe a moment that made you smile today.",
  "What's something you're looking forward to?",
  "If you could change one thing about today, what would it be?",
  "What are you most grateful for right now?",
  "What's one lesson you learned recently?"
]

const moodResponses = [
  "Had a great day overall, feeling productive and motivated.",
  "Feeling a bit overwhelmed with work but pushing through.",
  "Neutral day, nothing particularly exciting happened.",
  "Accomplished a lot today and feeling satisfied.",
  "Feeling down due to some personal challenges.",
  "Energetic and optimistic about upcoming opportunities.",
  "A bit tired but content with what I achieved.",
  "Feeling reflective and appreciative of small moments.",
  "Stressed about deadlines but managing to stay focused.",
  "Peaceful and centered after some quiet time."
]

const promptResponses = [
  "I finished a challenging project that I've been working on for weeks.",
  "My tendency to procrastinate when tasks feel overwhelming.",
  "I see myself in a leadership role, making meaningful contributions to my field.",
  "Work deadlines are stressing me out. I plan to break tasks into smaller chunks.",
  "A day where I feel balanced, productive, and connected with loved ones.",
  "Having a meaningful conversation with an old friend.",
  "My upcoming weekend trip to the mountains.",
  "I would have spent more time outdoors instead of being inside all day.",
  "My health, my family, and the opportunity to pursue my passions.",
  "That asking for help is a sign of strength, not weakness.",
  "Finally organizing my workspace and feeling more focused.",
  "Fear of failure sometimes prevents me from taking necessary risks.",
  "Living somewhere with better work-life balance and pursuing creative hobbies.",
  "Financial planning for the future. I'm going to start budgeting more carefully.",
  "Waking up naturally, having a leisurely breakfast, and spending time in nature."
]

const freeWriteResponses = [
  "Today I reflected on how much I've grown this year. There have been challenges, but each one taught me something valuable about resilience and adaptability.",
  "I've been thinking about my goals lately and whether I'm on the right path. Sometimes it feels like I'm moving too slowly, but progress is still progress.",
  "Had an interesting conversation with a friend today about dreams and aspirations. It made me realize how important it is to have people who support your vision.",
  "The weather was perfect today, which put me in a great mood. It's amazing how much our environment affects our mental state and productivity.",
  "I've been practicing gratitude more consistently, and I notice it's shifting my perspective on daily challenges in a positive way.",
  "Feeling grateful for the small moments today - my morning coffee, a good book, and some quiet time to think and reflect.",
  "Work was particularly challenging today, but I'm learning to see obstacles as opportunities to develop new skills and resilience.",
  "I noticed I've been comparing myself to others too much lately. Need to focus on my own journey and celebrate my unique path.",
  "Technology has been both a blessing and a curse lately. Trying to find better balance between digital connection and real-world presence.",
  "My sleep schedule has been off, and I can feel how it affects everything else. Time to prioritize rest as much as I do productivity.",
  "Spent some time in nature today and remembered how healing it can be. Need to make this a more regular part of my routine.",
  "Been reading about mindfulness and trying to implement small practices throughout my day. Even tiny moments of awareness make a difference."
]

// Simple seeded random function to ensure consistent results for the same date
const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export const generateSampleEntries = (date) => {
  const entries = []
  
  // Use date as seed for consistent results
  const dateString = date.toISOString().split('T')[0]
  const seed = dateString.split('-').reduce((acc, val) => acc + parseInt(val), 0)
  
  // Generate 0, 2, 3, or 4 entries per day (consistent for the same day)
  // 20% chance of 0 entries, 80% chance of 2-4 entries
  const shouldGenerateEntries = seededRandom(seed) > 0.3
  
  if (!shouldGenerateEntries) {
    return entries // Return empty array
  }
  
  const entriesPerDay = Math.floor(seededRandom(seed + 1) * 3) + 2 // 2-4 entries
  
  for (let j = 0; j < entriesPerDay; j++) {
    const entryDate = new Date(date)
    // Spread entries throughout the day
    entryDate.setHours(9 + j * 3, Math.floor(seededRandom(seed + j + 10) * 60), 0, 0)
    
    const entryTypes = ['mood', 'prompt', 'free']
    const randomType = entryTypes[Math.floor(seededRandom(seed + j + 20) * entryTypes.length)]
    
    let entry = {
      type: randomType,
      createdAt: entryDate.toString()
    }
    
    if (randomType === 'mood') {
      entry.data = {
        selectedMood: moods[Math.floor(seededRandom(seed + j + 30) * moods.length)],
        userResponse: moodResponses[Math.floor(seededRandom(seed + j + 40) * moodResponses.length)]
      }
    } else if (randomType === 'prompt') {
      entry.data = {
        promptText: prompts[Math.floor(seededRandom(seed + j + 50) * prompts.length)],
        userResponse: promptResponses[Math.floor(seededRandom(seed + j + 60) * promptResponses.length)]
      }
    } else {
      entry.data = {
        userResponse: freeWriteResponses[Math.floor(seededRandom(seed + j + 70) * freeWriteResponses.length)]
      }
    }
    
    entries.push(entry)
  }
  
  return entries
}

// Helper function to save entries using the API
export const saveSampleEntries = async (saveEntriesFunction, date) => {
  const sampleEntries = generateSampleEntries(date)
  await saveEntriesFunction(sampleEntries)
  console.log(`Generated and saved ${sampleEntries.length} sample entries for ${date.toDateString()}`)
  return sampleEntries
}
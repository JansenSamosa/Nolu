/**
 * Counts the number of words in a given string.
 * @param {string} str - The input string to count words from
 * @returns {number} The number of words in the string, or 0 if the string is empty
 */
export const word_count = str => {
    if (str.length == 0) {
        return 0
    }
    return str.trim().split(/\s+/).length;
}

/**
 * Gets the current date and time as an ISO string adjusted for the local timezone.
 * @returns {string} ISO string representation of the current local date and time
 */
export const getLocalISOString = () => {
    return new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString()
}

/**
 * Formats a Date object into a human-readable string with month name and ordinal day.
 * 
 * @param {Date} date - The Date object to format
 * @returns {string} A formatted date string in the format "Month DDth" (e.g., "January 1st", "February 22nd")
 * 
 * @example
 * formatDateString(new Date('2023-01-01')) // Returns "January 1st"
 * formatDateString(new Date('2023-02-22')) // Returns "February 22nd"
 * formatDateString(new Date('2023-03-03')) // Returns "March 3rd"
 * formatDateString(new Date('2023-04-15')) // Returns "April 15th"
 */
export const formatDateString = (date) => {
    const options = { 
        month: 'long', 
        day: 'numeric' 
    };
    
    const formatted = date.toLocaleDateString('en-US', options);
    
    // Add ordinal suffix to day
    const day = date.getDate();
    const suffix = day % 10 === 1 && day !== 11 ? 'st' :
                   day % 10 === 2 && day !== 12 ? 'nd' :
                   day % 10 === 3 && day !== 13 ? 'rd' : 'th';
    
    return formatted.replace(/\d+/, day + suffix);
}

/**
 * Gets the day of the week for a given date.
 * @param {Date} date - The date to get the day of the week for
 * @returns {string} The full name of the day of the week (e.g., "Monday", "Tuesday")
 */
export const getDayOfWeek = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
}

/**
 * Calculates a date offset from today by a specified number of days.
 * Positive offsets go into the future, negative offsets go into the past.
 * 
 * @param {number} [dayOffset=0] - The number of days to offset from today. 
 *                                Positive values for future dates, negative for past dates.
 * @returns {Date} A new Date object representing the calculated date
 * 
 * @example
 * calculateDateWithOffset(0)   // Returns today's date
 * calculateDateWithOffset(1)   // Returns tomorrow's date  
 * calculateDateWithOffset(-1)  // Returns yesterday's date
 * calculateDateWithOffset(7)   // Returns date 7 days from now
 */
export const calculateDateWithOffset = (dayOffset = 0) => {
  const today = new Date()
  const offsetDate = new Date(today)
  offsetDate.setDate(today.getDate() + dayOffset)
  return offsetDate
}

/**
 * Formats a Date object into a 12-hour time string with AM/PM.
 * 
 * @param {Date} date - The Date object to format
 * @returns {string} A formatted time string in the format "H:MMam/pm" (e.g., "7:36pm", "11:05am")
 * 
 * @example
 * formatTimeString(new Date('2023-01-01 19:36:00')) // Returns "7:36pm"
 * formatTimeString(new Date('2023-01-01 11:05:00')) // Returns "11:05am"
 * formatTimeString(new Date('2023-01-01 00:30:00')) // Returns "12:30am"
 */
export const formatTimeString = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    
    return `${displayHours}:${displayMinutes}${ampm}`;
}
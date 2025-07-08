
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


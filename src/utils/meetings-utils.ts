/** ToDo: Fix error handling */
export const fetchData = async <T>(url: string): Promise<T> => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`)
    }
    return (await response.json()) as T
  } catch (error) {
    console.error(error)
    return [] as T
  }
}

export const toggleArrayElement = <T>(array: T[], value: T): T[] => {
  const newArray = array.filter((x) => x !== value)
  return newArray.length === array.length ? [...newArray, value] : newArray
}

/**
 * Shuffles meetings while maintaining chronological order by start time.
 * Assumes the input array is already sorted by timeUTC (earliest to latest).
 * Meetings with the same start time are shuffled randomly among themselves.
 * @param meetings - Array of meetings sorted by timeUTC
 * @returns A new shuffled array (does not mutate the original)
 */
export const shuffleMeetings = <T extends { timeUTC: string }>(meetings: T[]): T[] => {

  // Assert the array is sorted by timeUTC
  for (let i = 1; i < meetings.length; i++) {
    if (meetings[i].timeUTC < meetings[i - 1].timeUTC) {
      console.warn('shuffleMeetings: initial meetings array is not sorted by timeUTC')
      break
    }
  }

  const result = [...meetings]
  let i = 0

  while (i < result.length) {
    const currentTime = result[i].timeUTC
    // Find the end index of meetings with the same start time
    let j = i + 1
    while (j < result.length && result[j].timeUTC === currentTime) {
      j++
    }

    // Shuffle the subarray [i, j) if there's more than one meeting
    if (j - i > 1) {
      for (let k = j - 1; k > i; k--) {
        const randIdx = i + Math.floor(Math.random() * (k - i + 1))
        ;[result[k], result[randIdx]] = [result[randIdx], result[k]]
      }
    }

    // Move to the next time slot
    i = j
  }

  return result
}

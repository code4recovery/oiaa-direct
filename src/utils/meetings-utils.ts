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


export const shuffleMeetings = <T extends { timeUTC: string }>(meetings: T[]): T[] => {
 
  for (let i = 1; i < meetings.length; i++) {
    if (meetings[i].timeUTC < meetings[i - 1].timeUTC) {
      throw new Error('shuffleMeetings requires meetings to be sorted by timeUTC')
    }
  }

  const result = [...meetings]

  for (let i = 0; i < result.length; ) {
    const currentTime = result[i].timeUTC
    
    // Find the end of this time slot
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
    
    i = j // Move to next time slot
  }

  return result
}

export function quantizeDates(timeArray) {
  const dateSet = new Set()

  // Calculation is done in the client's time zone
  // because the days will be grouped based on midnight
  timeArray.forEach(time => {
    const date = new Date(time)
    date.setHours(0, 0, 0, 0)
    dateSet.add(date.toISOString())
  })

  // Convert the set to an array
  return Array.from(dateSet).sort((a, b) => new Date(b) - new Date(a))
}